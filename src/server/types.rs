use std::collections::{HashMap, HashSet};

use actix::prelude::*;
use actix::{Actor, Handler};

#[derive(Message)]
#[rtype(result = "usize")]
pub enum SessionMessage {
    Text(String),
}

#[derive(Debug, Clone, Default)]
pub struct Room {
    pub name: String,
    pub users: HashSet<String>,
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