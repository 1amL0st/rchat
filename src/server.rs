use std::collections::{HashMap, HashSet};

use actix::prelude::*;
use actix::{Actor, Handler};

use super::message;

pub const MAIN_ROOM_NAME: &'static str = "World";

#[derive(Message)]
#[rtype(result = "usize")]
pub enum SessionMessage {
    Text(String),
}

#[derive(Debug, Clone, Default)]
pub struct Room {
    name: String,
    users: HashSet<String>,
}

#[derive(Debug, Clone)]
pub struct Server {
    users: HashMap<String, Recipient<SessionMessage>>,
    rooms: HashMap<usize, Room>,
}

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

    fn send_msg_to_room(&self, msg_text: String, room_id: usize, ignore_user: &String) {
        let room = if let Some(room) = self.rooms.get(&room_id) {
            room
        } else {
            return;
        };

        for user in &room.users {
            if user != ignore_user {
                let recipient = self.users.get(user).unwrap();
                if let Err(err) = recipient.do_send(SessionMessage::Text(msg_text.clone())) {
                    panic!("Server error in process of sending text message {}", err);
                }
            }
        }
    }

    fn send_to_main_room(&self, msg_text: String) {
        let room = self.rooms.get(&0).unwrap();

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

    fn get_room_list(&self) -> Vec<String> {
        self.rooms
            .iter()
            .map(|(_, room)| room.name.clone())
            .collect()
    }

    fn move_user_to_room(&mut self, to_room_id: usize, cur_room_id: usize, login: &String) {
        let current_room = self.rooms.get_mut(&cur_room_id).unwrap();
        current_room.users.remove(login);

        if current_room.users.len() == 0 && cur_room_id != 0 {
            self.rooms.remove(&cur_room_id);
        }

        let to_room = self.rooms.get_mut(&to_room_id).unwrap();
        to_room.users.insert(login.clone());

        let leave_msg = message::make_join_notify_msg(format!(
            "User {} has joined room {}",
            login, to_room.name
        ));
        self.send_msg_to_room(leave_msg, cur_room_id, login);

        // TODO: Don't send this message to user itself...
        let msg = message::make_join_notify_msg(format!("{} join!", login));
        self.send_msg_to_room(msg, to_room_id, login);
    }
}

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
        let new_login = msg.new_login;

        if new_login.chars().count() > 32 {
            return MessageResult(Err(format!("Your login is too long!")));
        }

        if new_login.trim() == "" {
            return MessageResult(Err(format!("Wrong login format!")));
        }

        let old_login = msg.old_login;
        if self.users.contains_key(&new_login) {
            MessageResult(Err(format!("Login exists!!")))
        } else {
            if old_login == "" {
                self.add_user_to_main_room(new_login.clone());
            } else {
                self.users.remove(&old_login);
            }

            let room = self.rooms.get_mut(&msg.room_id).unwrap();
            room.users.remove(&old_login);
            room.users.insert(new_login.clone());

            self.users.insert(new_login.clone(), recipient);
            self.send_msg_to_room(msg.text, msg.room_id, &new_login);

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
        let text = message::make_text_msg(msg.author, msg.text);
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

        self.users.remove(&msg.login);
        let msg_text = message::make_leave_notify_msg(format!("User {} has left!", msg.login));
        self.send_msg_to_room(msg_text, msg.room_id, &String::new());
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
        // Check if user is in main room or trying to join main room
        if msg.cur_room_id != 0 && msg.room_name != MAIN_ROOM_NAME {
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
        if msg.cur_room_id != 0 {
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

    fn handle(&mut self, msg: CreateRoom, ctx: &mut Self::Context) -> Self::Result {
        for (_, room) in &self.rooms {
            if room.name == msg.room_name {
                return MessageResult(Err("A room with such name already exists!".to_string()));
            }
        }

        // NOTE: Might generate same ids
        let room_id = rand::random::<usize>();
        self.rooms.insert(
            room_id,
            Room {
                name: msg.room_name,
                users: HashSet::new(),
            },
        );

        self.move_user_to_room(room_id, msg.cur_room_id, &msg.login);

        self.send_to_main_room(message::make_rooms_list_msg(&self.get_room_list()));

        MessageResult(Ok(room_id))
    }
}
