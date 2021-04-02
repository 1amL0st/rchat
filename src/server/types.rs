use std::collections::{HashMap, HashSet};

use actix::prelude::*;
use actix::{Actor, Handler};
use actix_files::NamedFile;

#[derive(Message)]
#[rtype(result = "usize")]
pub enum SessionMessage {
    Text(String),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RoomPrivacy {
    Public,
    Private // Hidden from end list
}

impl Default for RoomPrivacy {
    fn default() -> Self { RoomPrivacy::Public }
}

#[derive(Debug, Clone, Default)]
pub struct Room {
    pub name: String,
    pub users: HashSet<String>,

    pub privacy: RoomPrivacy
}

impl Room {
    pub fn new(name: String, users: HashSet<String>, privacy: RoomPrivacy) -> Self {
        Self {
            name,
            users,
            privacy
        }
    }
}

type UserRecipient = Recipient<SessionMessage>;

#[derive(Debug, Clone)]
pub struct User {
    pub recipient: UserRecipient
}

impl User {
    pub fn new(recipient: UserRecipient) -> User {
        Self {
            recipient
        }
    }

    pub fn do_send(&self, msg: SessionMessage) -> Result<(), SendError<SessionMessage>> {
        self.recipient.do_send(msg)
    }
}