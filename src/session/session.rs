use std::time::Instant;

use actix::*;

use actix_web_actors::ws::{self, WebsocketContext};

use crate::server::msgs_handlers::{
    CreateRoom, CurrentRoom, FindUser, JoinRoom, ListRooms, ListUsers, Login, TextMsg,
};
use crate::{
    messages::{self},
    server,
    server::Server,
};

use super::msgs_handler as sessionsMsgs;
use messages::data_msgs as dataMsgs;
use messages::server_msgs as serverMsgs;

use crate::constants::*;

pub struct Inviter {
    pub addr: Addr<Session>,
    pub login: String,
}

pub struct Session {
    pub invites: Vec<Inviter>,

    pub hb: Instant,

    pub login: String,
    pub room_id: usize,

    pub server: Addr<Server>,
}

impl Session {
    pub fn new(server: Addr<Server>, name: String) -> Self {
        Session {
            invites: Vec::new(),
            room_id: 0,
            server: server,
            login: name,
            hb: Instant::now(),
        }
    }

    fn handle_cmd_login(&mut self, ctx: &mut ws::WebsocketContext<Self>, login: String) {
        let recipient = ctx.address();

        let msg = if self.login == "" {
            serverMsgs::user_joined_room(format!("User {} joined!", login), login.clone())
        } else {
            messages::make_text_msg(
                "Server".to_string(),
                format!("User {} has changed its name to {}!", self.login, login),
            )
        };

        let login_msg = Login {
            room_id: self.room_id,
            old_login: self.login.clone(),
            text: msg,
            new_login: login.clone(),
            recipient: recipient,
        };

        self.server
            .send(login_msg)
            .into_actor(self)
            .then(move |res, act, ctx| {
                match res {
                    Ok(result) => match result {
                        Ok(()) => {
                            let old_login = act.login.clone();
                            act.login = login.clone();

                            ctx.text(serverMsgs::logging_success(&login));

                            if old_login == "" {
                                ctx.text(serverMsgs::user_connected(&format!(
                                    "{}, you're connected! Welcome to rchat!",
                                    login
                                )));
                            }
                        }
                        Err(err) => {
                            ctx.text(err);
                        }
                    },
                    Err(err) => {
                        println!("Err = {}", err);
                        panic!("Something went wrong!");
                    }
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn handle_cmd_list_users(&mut self, _: String, ctx: &mut ws::WebsocketContext<Self>) {
        self.server
            .send(ListUsers {
                room_id: self.room_id,
            })
            .into_actor(self)
            .then(|res, _, ctx| {
                match res {
                    Ok(users) => {
                        let msg = dataMsgs::user_list_msg(&users);
                        ctx.text(msg);
                    }
                    _ => println!("Something went wrong!"),
                }
                fut::ready(())
            })
            .wait(ctx)
    }

    fn handle_cmd_current_room(&mut self, ctx: &mut ws::WebsocketContext<Self>) {
        self.server
            .send(CurrentRoom {
                room_id: self.room_id,
            })
            .into_actor(self)
            .then(|res, _, ctx| {
                match res {
                    Ok(room_name) => {
                        let msg = dataMsgs::current_room_msg(room_name);
                        ctx.text(msg);
                    }
                    _ => println!("Something is wrong"),
                }
                fut::ready(())
            })
            .wait(ctx)
    }

    fn handle_cmd_join_room(
        &mut self,
        ctx: &mut ws::WebsocketContext<Self>,
        mut room_name: String,
    ) {
        room_name = room_name.trim().to_string();
        if self.room_id == MAIN_ROOM_ID && room_name == MAIN_ROOM_NAME {
            return;
        }

        self.server
            .send(JoinRoom {
                cur_room_id: self.room_id,
                room_name: room_name.clone(),
                login: self.login.clone(),
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                if let Ok(result) = res {
                    match result {
                        Ok(room_id) => {
                            act.room_id = room_id;
                            let m = room_name;
                            ctx.text(serverMsgs::you_joined_room(&m))
                        }
                        Err(err) => {
                            ctx.text(serverMsgs::user_joined_room_fail(&err));
                        }
                    }
                } else {
                    panic!("Something went wrong!")
                }

                fut::ready(())
            })
            .wait(ctx)
    }

    fn handle_cmd_list_rooms(&mut self, ctx: &mut ws::WebsocketContext<Self>) {
        self.server
            .send(ListRooms {
                cur_room_id: self.room_id,
            })
            .into_actor(self)
            .then(|res, _, ctx| {
                if let Ok(result) = res {
                    let msg = dataMsgs::room_list_msg(&result);
                    ctx.text(msg);
                } else {
                    panic!("Something wenеt wrong!")
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn handle_cmd_create_room(
        &mut self,
        ctx: &mut ws::WebsocketContext<Self>,
        mut room_name: String,
    ) {
        room_name = room_name.trim().to_string();

        if room_name == "" {
            let msg = serverMsgs::room_creation_fail(format!("Room name has wrong format!"));
            ctx.text(msg);
            return;
        } else if room_name.chars().count() > 32 {
            ctx.text(serverMsgs::room_creation_fail(format!(
                "Your room name is too long!"
            )))
        }

        self.server
            .send(CreateRoom {
                cur_room_id: self.room_id,
                room_name: room_name.clone(),
                login: self.login.clone(),
            })
            .into_actor(self)
            .then(move |res, act, ctx| {
                if let Ok(result) = res {
                    match result {
                        Ok(id) => {
                            act.room_id = id;
                            let msg = serverMsgs::you_joined_room(&room_name);
                            ctx.text(msg);
                        }
                        Err(err) => {
                            let msg = serverMsgs::room_creation_fail(format!(
                                "Couldn't create room! {}",
                                err
                            ));
                            ctx.text(msg);
                        }
                    }
                } else {
                    panic!("Something went wrong!")
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn handle_user_msg(&mut self, text: String, ctx: &mut ws::WebsocketContext<Self>) {
        if text.chars().count() <= 2048 {
            self.server
                .try_send(TextMsg {
                    author: self.login.to_string(),
                    text: text,
                    room_id: self.room_id,
                })
                .unwrap();
        } else {
            ctx.text(serverMsgs::failed_to_send_msg(&format!(
                "Your message is too long!"
            )))
        }
    }

    fn handle_cmd_invite_to_dm_refuse(&mut self) {
        if self.invites.is_empty() {
            return;
        }

        let inviter = &self.invites.pop().unwrap();
        inviter
            .addr
            .try_send(sessionsMsgs::InviteToDMRefused {
                guest: self.login.clone(),
            })
            .unwrap();
    }

    fn handle_cmd_invite_to_dm_accpet(&mut self) {
        if self.invites.is_empty() {
            return;
        }

        let inviter = &self.invites.pop().unwrap();
        inviter
            .addr
            .try_send(sessionsMsgs::InviteToDMAccepted {
                guest: self.login.clone(),
            })
            .unwrap();
    }

    fn handler(
        &self,
        ctx: &mut WebsocketContext<Session>,
        guest_addr: Addr<Session>,
        guest_login: String,
    ) {
        guest_addr
            .send(sessionsMsgs::InviteToDMRequest {
                inviter: self.login.clone(),
                inviter_addr: ctx.address(),
            })
            .into_actor(self)
            .then(move |res, act, ctx| {
                if let Ok(result) = res {
                    match result {
                        Ok(_) => (),
                        Err(err) => ctx.text(serverMsgs::invite_user_to_dm_fail(&err)),
                    }
                } else {
                    panic!("Something went wrong!")
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn handle_cmd_invite_to_dm(
        &mut self,
        ctx: &mut ws::WebsocketContext<Self>,
        guest_login: String,
    ) {
        if guest_login == self.login || self.room_id != MAIN_ROOM_ID {
            return;
        }

        self.server
            .send(FindUser {
                login: guest_login.clone(),
                addr: ctx.address(),
            })
            .into_actor(self)
            .then(move |res, act, ctx| {
                if let Ok(result) = res {
                    if let Ok(guest_addr) = result {
                        act.handler(ctx, guest_addr, guest_login);
                        // guest_addr
                        //     .try_send(sessionsMsgs::InviteToDMRequest {
                        //         inviter: act.login.clone(),
                        //         inviter_addr: ctx.address(),
                        //     })
                        //     .unwrap();
                    } else {
                        ctx.text(serverMsgs::invite_user_to_dm_fail(&format!(
                            "User {} not found!",
                            guest_login
                        )))
                    }
                } else {
                    panic!("Something went wrong!")
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn handle_text(&mut self, text: String, ctx: &mut ws::WebsocketContext<Self>) {
        let first_word = text.chars().take_while(|c| *c != ' ').collect::<String>();
        let first_word = first_word.as_str();

        // Check if user choose a login
        if self.login == "" {
            if first_word == "/login" {
                self.handle_cmd_login(ctx, text[7..].to_string());
            }
        } else {
            match first_word {
                "/create_room" => {
                    self.handle_cmd_create_room(ctx, text[12..].to_string());
                }
                "/join" => {
                    self.handle_cmd_join_room(ctx, text[5..].to_string());
                }
                "/current_room" => {
                    self.handle_cmd_current_room(ctx);
                }
                "/list_rooms" => self.handle_cmd_list_rooms(ctx),
                "/login" => {
                    self.handle_cmd_login(ctx, text[7..].to_string());
                }
                "/list_users" => self.handle_cmd_list_users(text, ctx),

                "/invite_to_dm_refuse" => self.handle_cmd_invite_to_dm_refuse(),
                "/invite_to_dm_accept" => self.handle_cmd_invite_to_dm_accpet(),
                "/invite_to_dm" => self.handle_cmd_invite_to_dm(ctx, text[14..].to_string()),
                _ => self.handle_user_msg(text, ctx),
            }
        }
    }

    pub fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                ctx.stop();
                return;
            }
            ctx.ping(b"");
        });
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for Session {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        let msg = match msg {
            Err(_) => {
                ctx.stop();
                return;
            }
            Ok(msg) => msg,
        };

        match msg {
            ws::Message::Ping(msg) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            ws::Message::Pong(_) => {
                self.hb = Instant::now();
            }
            ws::Message::Text(text) => {
                self.handle_text(text, ctx);
            }
            ws::Message::Close(reason) => {
                ctx.close(reason);
                ctx.stop();
            }
            ws::Message::Continuation(_) => {
                ctx.stop();
            }
            _ => (),
        }
    }
}
