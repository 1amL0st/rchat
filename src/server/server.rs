use std::collections::{HashMap, HashSet};

use actix::prelude::*;
use actix::{Actor, Handler};

use crate::messages;
use crate::messages::data_msgs as dataMsgs;
use crate::messages::server_msgs as serverMsgs;

pub const MAIN_ROOM_NAME: &'static str = "World";
pub const MAIN_ROOM_ID: usize = 0;

use super::types::*;
#[derive(Debug, Clone)]
pub struct Server {
    users: HashMap<String, User>,
    rooms: HashMap<usize, Room>,
}

impl Server {
    pub fn new() -> Self {
        let mut rooms = HashMap::new();

        rooms.insert(
            MAIN_ROOM_ID,
            Room {
                name: String::from(MAIN_ROOM_NAME),
                users: HashSet::new(),
            },
        );

        #[cfg(debug_assertions)]
        for i in 1..10 {
            rooms.insert(
                i,
                Room {
                    name: format!("room_{}", i),
                    users: HashSet::new(),
                },
            );
        }

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

        if current_room.users.len() == 0 && cur_room_id != MAIN_ROOM_ID {
            let msg_text = serverMsgs::room_destroy(&current_room.name);
            self.send_msg_to_room(msg_text, MAIN_ROOM_ID, &login);

            self.rooms.remove(&cur_room_id);
        }

        let to_room = self.rooms.get_mut(&to_room_id).unwrap();
        to_room.users.insert(login.clone());

        let leave_msg = serverMsgs::user_left_room_custom_text(
            &format!("User {} left this room and joined {}!", login, to_room.name),
            login,
        );
        self.send_msg_to_room(leave_msg, cur_room_id, login);

        let msg =
            serverMsgs::user_joined_room(format!("User {} joined room!", login), login.clone());
        self.send_msg_to_room(msg, to_room_id, login);
    }

    fn is_login_valid(&self, new_login: &String) -> Result<(), String> {
        if new_login.chars().count() > 32 {
            return Err(serverMsgs::logging_fail(&format!(
                "Your login is too long!"
            )));
        } else if new_login.trim() == "" {
            return Err(serverMsgs::logging_fail(&format!(
                "Login must not be empty!"
            )));
        } else if new_login.to_ascii_lowercase() == "server" {
            return Err(serverMsgs::logging_fail(&format!(
                "Login already exists!"
            )))
        }

        Ok(())
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
            Room {
                name: msg.room_name,
                users: HashSet::new(),
            },
        );

        self.move_user_to_room(room_id, msg.cur_room_id, &msg.login);
        self.send_to_main_room(dataMsgs::room_list_msg(&self.get_room_list()));
        MessageResult(Ok(room_id))
    }
}
