use std::collections::{HashMap, HashSet};

use crate::messages::server_msgs as serverMsgs;

use super::room::*;
use super::user::*;

use crate::constants::*;
use crate::session::msgs_handler as SessionMessage;

#[derive(Clone)]
pub struct Server {
    pub users: HashMap<String, User>,
    pub rooms: HashMap<usize, Room>,
}

impl Server {
    pub fn new() -> Self {
        let mut rooms = HashMap::new();

        rooms.insert(
            MAIN_ROOM_ID,
            Room::new(
                String::from(MAIN_ROOM_NAME),
                HashSet::new(),
                RoomPrivacy::Public,
            ),
        );

        #[cfg(debug_assertions)]
        for i in 1..10 {
            rooms.insert(
                i,
                Room::new(format!("room_{}", i), HashSet::new(), RoomPrivacy::Public),
            );
        }

        for i in 20..25 {
            rooms.insert(
                i,
                Room::new(
                    format!("Private room {}", i),
                    HashSet::new(),
                    RoomPrivacy::Private,
                ),
            );
        }

        Self {
            users: HashMap::new(),
            rooms: rooms,
        }
    }

    pub fn send_msg_to_room(&self, msg_text: String, room_id: usize, ignore_user: &String) {
        let room = if let Some(room) = self.rooms.get(&room_id) {
            room
        } else {
            return;
        };

        for user in &room.users {
            if user != ignore_user {
                let recipient = &self.users.get(user).unwrap().addr;
                if let Err(err) = recipient.try_send(SessionMessage::Text {
                    text: msg_text.clone(),
                }) {
                    panic!("Server error in process of sending text message {}", err);
                }
            }
        }
    }

    pub fn send_to_main_room(&self, msg_text: String) {
        let room = self.rooms.get(&0).unwrap();

        for user in &room.users {
            let recipient = &self.users.get(user).unwrap().addr;
            if let Err(err) = recipient.try_send(SessionMessage::Text {
                text: msg_text.clone(),
            }) {
                panic!("Server error in process of sending text message {}", err);
            }
        }
    }

    pub fn add_user_to_main_room(&mut self, login: String) {
        let main_room = self.rooms.get_mut(&0).unwrap();
        main_room.users.insert(login);
    }

    pub fn get_room_list(&self) -> Vec<String> {
        self.rooms
            .iter()
            .filter_map(|(_, room)| {
                if room.privacy == RoomPrivacy::Public {
                    Some(room.name.clone())
                } else {
                    None
                }
            })
            .collect()
    }

    pub fn move_user_to_room(&mut self, to_room_id: usize, cur_room_id: usize, login: &String) {
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

    pub fn is_login_valid(&self, new_login: &String) -> Result<(), String> {
        if new_login.chars().count() > 32 {
            return Err(serverMsgs::logging_fail(&format!(
                "Your login is too long!"
            )));
        } else if new_login.trim() == "" {
            return Err(serverMsgs::logging_fail(&format!(
                "Login must not be empty!"
            )));
        } else if new_login.to_ascii_lowercase() == "server" {
            return Err(serverMsgs::logging_fail(&format!("Login already exists!")));
        }

        Ok(())
    }

    pub fn create_room_with_name(&mut self, room_name: String, privacy: RoomPrivacy) -> (usize, Room) {
        let mut room_id = rand::random::<usize>();
        while self.rooms.contains_key(&room_id) {
            room_id = rand::random::<usize>();
        }
        (room_id, Room::new(room_name, HashSet::new(), privacy))
    }
}
