use std::collections::{HashMap, HashSet};

use actix::prelude::*;
use actix::{Actor, Handler};

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
    users: HashSet<String>
}

#[derive(Debug, Clone)]
pub struct Server {
    users: HashMap<String, Recipient<SessionMessage>>,
    rooms: HashMap<usize, Room>
}

impl Server {
    pub fn new() -> Self {
        let mut rooms = HashMap::new();

        rooms.insert(0, Room {
            name: String::from("World"),
            users: HashSet::new()
        });

        // NOTE: This code must be removed
        rooms.insert(usize::MAX, Room {
            name: String::from("Outworld"),
            users: HashSet::new()
        });

        Self {
            users: HashMap::new(),
            rooms: rooms
        }
    }

    fn send_msg_to_room(&self, msg_text: String, room_id: usize) {
        for (_, recipient) in &self.users {
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
    pub room_id: usize
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
    pub room_id: usize
}

impl Handler<Leave> for Server {
    type Result = ();

    fn handle(&mut self, msg: Leave, _: &mut Self::Context) {
        self.users.remove(&msg.login);
        let msg_text = message::make_leave_notify_msg(format!("User {} has left!", msg.login));
        self.send_msg_to_room(msg_text, msg.room_id);
    }
}

#[derive(Message)]
#[rtype(result = "Vec<String>")]
pub struct ListUsers {
    pub room_id: usize
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
    pub room_id: usize
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
    pub room: String,
    pub login: String
}

impl Handler<JoinRoom> for Server {
    type Result = MessageResult<JoinRoom>;

    fn handle(&mut self, msg: JoinRoom, _: &mut Context<Self>) -> Self::Result {
        for (key, room) in &mut self.rooms {
            if room.name == msg.room {
                room.users.insert(msg.login);
                return MessageResult(Ok(*key));
            }
        }
        MessageResult(Err("Room not found!".to_string()))
    }
}