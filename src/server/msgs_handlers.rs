use std::collections::HashSet;

use actix::prelude::*;
use actix::{Actor, Handler};

use super::server::*;

use crate::constants::*;
use crate::messages;
use crate::messages::data_msgs as dataMsgs;
use crate::messages::server_msgs as serverMsgs;
use crate::session::session::SessionMessage;

use super::room::*;
use super::user::*;

impl Actor for Server {
    type Context = actix::Context<Self>;
}

#[derive(Message)]
#[rtype(result = "Result<(), String>")]
pub struct Login {
    pub new_login: String,
    pub recipient: Recipient<SessionMessage>,
    pub text: String,
    pub room_id: usize,
    pub old_login: String,
}

impl Handler<Login> for Server {
    type Result = MessageResult<Login>;
    fn handle(&mut self, msg: Login, _: &mut Self::Context) -> Self::Result {
        let recipient = msg.recipient;
        let new_login = &msg.new_login;

        if let Err(err) = self.is_login_valid(new_login) {
            return MessageResult(Err(err));
        }

        let old_login = &msg.old_login;
        if self.users.contains_key(new_login) {
            MessageResult(Err(serverMsgs::logging_fail(&format!("Login exists!!"))))
        } else {
            if old_login == "" {
                self.add_user_to_main_room(new_login.clone());

                let msg = serverMsgs::user_connected(&format!("{} connected!", new_login));
                self.send_msg_to_room(msg, MAIN_ROOM_ID, new_login);
            } else {
                self.users.remove(old_login);

                let msg_text = serverMsgs::user_changed_login(&old_login, new_login);
                self.send_msg_to_room(msg_text, msg.room_id, old_login);
            }

            let room = self.rooms.get_mut(&msg.room_id).unwrap();
            room.users.remove(old_login);
            room.users.insert(new_login.clone());

            let user = User::new(recipient);

            self.users.insert(new_login.clone(), user);

            MessageResult(Ok(()))
        }
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct TextMsg {
    pub author: String,
    pub text: String,
    pub room_id: usize,
}

impl Handler<TextMsg> for Server {
    type Result = ();

    fn handle(&mut self, msg: TextMsg, _: &mut Self::Context) -> Self::Result {
        let text = messages::make_text_msg(msg.author, msg.text);
        self.send_msg_to_room(text, msg.room_id, &String::new());
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Leave {
    pub login: String,
    pub room_id: usize,
}

impl Handler<Leave> for Server {
    type Result = ();

    fn handle(&mut self, msg: Leave, _: &mut Self::Context) {
        let cur_room = self.rooms.get_mut(&msg.room_id).unwrap();
        cur_room.users.remove(&msg.login);

        let cur_room_name = cur_room.name.clone();
        if msg.room_id != MAIN_ROOM_ID && cur_room.users.len() == 0 {
            let msg_text = serverMsgs::room_destroy(&cur_room.name);
            self.send_msg_to_room(msg_text, MAIN_ROOM_ID, &msg.login);
            self.rooms.remove(&msg.room_id);
        }

        if msg.login != "" {
            self.users.remove(&msg.login);
            let msg_text = serverMsgs::user_left_room_custom_text(
                &format!("User {} has left room {}", msg.login, cur_room_name),
                &msg.login,
            );
            self.send_msg_to_room(msg_text, msg.room_id, &String::new());
        }
    }
}

#[derive(Message)]
#[rtype(result = "Vec<String>")]
pub struct ListUsers {
    pub room_id: usize,
}

impl Handler<ListUsers> for Server {
    type Result = MessageResult<ListUsers>;

    fn handle(&mut self, msg: ListUsers, _: &mut Context<Self>) -> Self::Result {
        let room = self.rooms.get(&msg.room_id).unwrap();
        let users = room.users.iter().cloned().collect();
        MessageResult(users)
    }
}
#[derive(Message)]
#[rtype(result = "String")]
pub struct CurrentRoom {
    /// Room in which user is now
    pub room_id: usize,
}

impl Handler<CurrentRoom> for Server {
    type Result = MessageResult<CurrentRoom>;

    fn handle(&mut self, msg: CurrentRoom, _: &mut Context<Self>) -> Self::Result {
        let room = self.rooms.get(&msg.room_id).unwrap();
        MessageResult(room.name.clone())
    }
}

#[derive(Message)]
#[rtype(result = "Result<usize, String>")]
pub struct JoinRoom {
    pub cur_room_id: usize,
    pub room_name: String,
    pub login: String,
}

impl Handler<JoinRoom> for Server {
    type Result = MessageResult<JoinRoom>;

    fn handle(&mut self, msg: JoinRoom, _: &mut Context<Self>) -> Self::Result {
        if msg.cur_room_id != MAIN_ROOM_ID && msg.room_name != MAIN_ROOM_NAME {
            return MessageResult(Err(format!(
                "You can join other rooms only from {} room!",
                MAIN_ROOM_NAME
            )));
        }
        // NOTE: I don't know how to avoid this copy...
        let keys: Vec<usize> = self.rooms.iter().map(|(key, _)| *key).collect();

        for key in &keys {
            if self.rooms.get(key).unwrap().name == msg.room_name {
                self.move_user_to_room(*key, msg.cur_room_id, &msg.login);
                return MessageResult(Ok(*key));
            }
        }

        MessageResult(Err("Room not found!".to_string()))
    }
}

#[derive(Message)]
#[rtype(result = "Vec<String>")]
pub struct ListRooms {
    pub cur_room_id: usize,
}

impl Handler<ListRooms> for Server {
    type Result = MessageResult<ListRooms>;

    fn handle(&mut self, msg: ListRooms, _: &mut Self::Context) -> Self::Result {
        if msg.cur_room_id != MAIN_ROOM_ID {
            let rooms = vec![String::from(MAIN_ROOM_NAME)];
            MessageResult(rooms)
        } else {
            MessageResult(self.get_room_list())
        }
    }
}

#[derive(Message)]
#[rtype(result = "Result<usize, String>")]
pub struct CreateRoom {
    pub cur_room_id: usize,
    pub room_name: String,
    pub login: String,
}

impl Handler<CreateRoom> for Server {
    type Result = MessageResult<CreateRoom>;

    fn handle(&mut self, msg: CreateRoom, _: &mut Self::Context) -> Self::Result {
        for (_, room) in &self.rooms {
            if room.name == msg.room_name {
                return MessageResult(Err("A room with such name already exists!".to_string()));
            }
        }

        let mut room_id = rand::random::<usize>();
        while self.rooms.contains_key(&room_id) {
            room_id = rand::random::<usize>();
        }

        self.rooms.insert(
            room_id,
            Room::new(msg.room_name, HashSet::new(), RoomPrivacy::Public),
        );

        self.move_user_to_room(room_id, msg.cur_room_id, &msg.login);
        self.send_to_main_room(dataMsgs::room_list_msg(&self.get_room_list()));
        MessageResult(Ok(room_id))
    }
}

#[derive(Message)]
#[rtype(result = "Result<usize, String>")]
pub struct InviteToDM {
    pub login: String,
    pub guest_login: String,
    pub recipient: Recipient<SessionMessage>,
}

impl Handler<InviteToDM> for Server {
    type Result = MessageResult<InviteToDM>;

    fn handle(&mut self, msg: InviteToDM, ctx: &mut Self::Context) -> Self::Result {
        println!("Server invite to dm:");
        println!("msg.target_login = {:?}", msg.guest_login);

        msg.recipient
            .send(SessionMessage::InviteToDM(msg.guest_login))
            .into_actor(self)
            .then(move |res, _, _| {
                match res {
                    Ok(result) => {
                        println!("Request for recipient result = {}", result);
                    }
                    Err(err) => {
                        println!("Err = {}", err);
                        panic!("Something went wrong!");
                    }
                }
                fut::ready(())
            })
            .wait(ctx);
        MessageResult(Ok(1))
    }
}
