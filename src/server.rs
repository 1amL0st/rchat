use std::collections::{HashMap, HashSet};

use actix::prelude::*;
use actix::{Actor, Handler};
use message::make_rooms_list_msg;

use super::message;

#[derive(Message)]
#[rtype(result = "usize")]
pub enum SessionMessage {
    Text(String),
    Login(Result<String, String>),
}

#[derive(Debug, Clone)]
pub struct Room {
    name: String,
    users: HashSet<String>,
}

#[derive(Debug, Clone)]
pub struct Server {
    users: HashMap<String, Recipient<SessionMessage>>,
    rooms: HashMap<usize, Room>,
}

const MAIN_ROOM_NAME: &'static str = "World";

impl Server {
    pub fn new() -> Self {
        let mut rooms = HashMap::new();

        rooms.insert(
            0,
            Room {
                name: String::from(MAIN_ROOM_NAME),
                users: HashSet::new(),
            },
        );

        // NOTE: This code must be removed
        rooms.insert(
            1,
            Room {
                name: String::from("a"),
                users: HashSet::new(),
            },
        );

        rooms.insert(
            2,
            Room {
                name: String::from("b"),
                users: HashSet::new(),
            },
        );

        Self {
            users: HashMap::new(),
            rooms: rooms,
        }
    }

    fn send_msg_to_room(&self, msg_text: String, room_id: usize) {
        let room = self.rooms.get(&room_id).unwrap();

        for user in &room.users {
            let recipient = self.users.get(user).unwrap();
            if let Err(err) = recipient.do_send(SessionMessage::Text(msg_text.clone())) {
                panic!("Server error in process of sending text message {}", err);
            }
        }
    }

    fn add_user_to_main_room(&mut self, login: String) {
        let main_room = self.rooms.get_mut(&0).unwrap();
        main_room.users.insert(login);
    }
}

impl Actor for Server {
    type Context = actix::Context<Self>;
}

#[derive(Message)]
#[rtype(result = "bool")]
pub struct Login {
    pub new_login: String,
    pub recipient: Recipient<SessionMessage>,
    pub text: String,
    pub old_login: String,
}

impl Handler<Login> for Server {
    type Result = MessageResult<Login>;
    fn handle(&mut self, msg: Login, _: &mut Self::Context) -> Self::Result {
        let recipient = msg.recipient;
        let new_login = msg.new_login.trim().to_string();

        // Restrict maximum login length
        if new_login == "" {
            let msg = SessionMessage::Login(Err("Wrong login format!".to_string()));
            recipient.try_send(msg).unwrap();
            return MessageResult(false);
        }

        let old_login = msg.old_login;
        let text = msg.text;

        if self.users.contains_key(&new_login) {
            let msg = SessionMessage::Login(Err("Login exists!".to_string()));
            recipient.try_send(msg).unwrap();
            MessageResult(false)
        } else {
            let msg = SessionMessage::Login(Ok(new_login.clone()));
            recipient.try_send(msg).unwrap();

            if old_login == "" {
                self.add_user_to_main_room(new_login.clone());
            } else {
                self.users.remove(&old_login);
            }

            self.users.insert(new_login, recipient);

            self.send_msg_to_room(text, 0);

            MessageResult(true)
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
        let text = message::make_text_msg(msg.author, msg.text);
        self.send_msg_to_room(text, msg.room_id);
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

        self.users.remove(&msg.login);
        let msg_text = message::make_leave_notify_msg(format!("User {} has left!", msg.login));
        self.send_msg_to_room(msg_text, msg.room_id);
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
        // Check if user is in main room or try to join main room
        if msg.cur_room_id != 0 && msg.room_name != MAIN_ROOM_NAME {
            return MessageResult(Err(format!(
                "You can join other rooms only from {} room!",
                MAIN_ROOM_NAME
            )));
        }
        // NOTE: I don't know how to avoid this copy...
        let keys: Vec<usize> = self.rooms.iter().map(|(key, _)| *key).collect();

        for key in &keys {
            let room = self.rooms.get_mut(key).unwrap();
            if room.name == msg.room_name {
                room.users.insert(msg.login.clone());

                let current_room = self.rooms.get_mut(&msg.cur_room_id).unwrap();
                current_room.users.remove(&msg.login);

                let msg_text = format!("User {} has joined room {}", msg.login, current_room.name);
                let leave_msg = message::make_leave_notify_msg(msg_text);
                self.send_msg_to_room(leave_msg, msg.cur_room_id);

                return MessageResult(Ok(*key));
            }
        }

        // for (key, room) in &mut self.rooms {
        //     if room.name == msg.room_name {
        //         room.users.insert(msg.login.clone());

        //         let msg_text = format!("User {} has joined room {}", msg.login, msg.cur_room_id);
        //         let leave_msg = message::make_leave_notify_msg(msg_text);
        //         self.send_msg_to_room(leave_msg, msg.cur_room_id);

        //         return MessageResult(Ok(*key));
        //     }
        // }

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
        if msg.cur_room_id != 0 {
            let rooms = vec![String::from(MAIN_ROOM_NAME)];
            MessageResult(rooms)
        } else {
            let rooms = self
                .rooms
                .iter()
                .map(|(_, room)| room.name.clone())
                .collect();
            MessageResult(rooms)
        }
    }
}
