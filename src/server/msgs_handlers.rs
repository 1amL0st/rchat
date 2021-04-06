use actix::prelude::*;
use actix::{Actor, Handler};

use super::server::*;

use crate::constants::*;
use crate::messages;
use crate::messages::data_msgs as dataMsgs;
use crate::messages::server_msgs as serverMsgs;
use crate::session::msgs_handler as SessionMessage;
use crate::session::session::Session;

use super::room::*;
use super::user::*;

impl Actor for Server {
    type Context = actix::Context<Self>;
}

#[derive(Message)]
#[rtype(result = "Result<(), String>")]
pub struct Login {
    pub new_login: String,
    pub recipient: Addr<Session>,
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
        let cur_room_name = self.rooms.get(&msg.room_id).unwrap().name.clone();
        self.move_user_out_room(msg.room_id, &msg.login);

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

        let (room_id, room) = self.create_room_with_name(msg.room_name, RoomPrivacy::Public);
        self.rooms.insert(room_id, room);

        self.move_user_to_room(room_id, msg.cur_room_id, &msg.login);
        self.send_to_main_room(dataMsgs::room_list_msg(&self.get_room_list()));
        MessageResult(Ok(room_id))
    }
}
#[derive(Message)]
#[rtype(result = "Result<Addr<Session>, String>")] // TODO: can i set result = Addr<Session>?
pub struct FindUser {
    pub login: String,
    pub addr: Addr<Session>,
}

impl Handler<FindUser> for Server {
    type Result = MessageResult<FindUser>;

    fn handle(&mut self, msg: FindUser, ctx: &mut Self::Context) -> Self::Result {
        if let Some(user_login) = self.rooms.get(&MAIN_ROOM_ID).unwrap().users.get(&msg.login) {
            if let Some(user) = self.users.get(user_login) {
                MessageResult(Ok(user.addr.clone()))
            } else {
                MessageResult(Err("User not found!".to_string()))
            }
        } else {
            MessageResult(Err("User not found!".to_string()))
        }
    }
}
#[derive(Message)]
#[rtype(result = "usize")]
pub struct CreateDM {
    pub first_login: String,
    pub second_login: String,
}

impl Handler<CreateDM> for Server {
    type Result = MessageResult<CreateDM>;

    fn handle(&mut self, msg: CreateDM, ctx: &mut Self::Context) -> Self::Result {
        let (room_id, room) =
            self.create_room_with_name("Private room".to_string(), RoomPrivacy::Private);
        let room_name = room.name.clone();
        self.rooms.insert(room_id, room);

        self.move_user_to_room(room_id, MAIN_ROOM_ID, &msg.second_login);
        let second_user = self.users.get(&msg.second_login).unwrap();
        second_user
            .addr
            .try_send(SessionMessage::YouJoinedRoom {
                room_name: room_name.clone(),
                room_id: room_id,
            })
            .unwrap();

        self.move_user_to_room(room_id, MAIN_ROOM_ID, &msg.first_login);
        let first_user = self.users.get(&msg.first_login).unwrap();
        first_user
            .addr
            .try_send(SessionMessage::YouJoinedRoom {
                room_name: room_name.clone(),
                room_id: room_id,
            })
            .unwrap();

        // std::thread::sleep(std::time::Duration::from_secs(60000));

        first_user
            .addr
            .try_send(SessionMessage::InviteToDMRoomCreated {})
            .unwrap();
        self.users
            .get(&msg.second_login)
            .unwrap()
            .addr
            .try_send(SessionMessage::InviteToDMRoomCreated {})
            .unwrap();

        MessageResult(0)
    }
}
