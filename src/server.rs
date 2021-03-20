use std::collections::HashMap;

use actix::prelude::*;
use actix::{Actor, Handler};

use super::message;

#[derive(Message)]
#[rtype(result = "usize")]
pub enum ClientMessage {
    Text(String),
    Login(String),
}

#[derive(Debug, Clone)]
pub struct Server {
    users: HashMap<String, Recipient<ClientMessage>>,
}

impl Server {
    pub fn new() -> Self {
        Self {
            users: HashMap::new(),
        }
    }

    fn send_msg_to_all_users(&self, msg_text: String) {
        for (_, recipient) in &self.users {
            if let Err(err) = recipient.do_send(ClientMessage::Text(msg_text.clone())) {
                panic!("Server error in process of sending text message {}", err);
            }
        }
    }
}

impl Actor for Server {
    type Context = actix::Context<Self>;
}

#[derive(Message)]
#[rtype(result = "bool")]
pub struct Login {
    pub new_login: String,
    pub recipient: Recipient<ClientMessage>,
    pub text: String,
    pub old_login: String,
}

impl Handler<Login> for Server {
    type Result = MessageResult<Login>;

    fn handle(&mut self, msg: Login, _: &mut Self::Context) -> Self::Result {
        let new_login = msg.new_login;
        let recipient = msg.recipient;
        let old_login = msg.old_login;
        let text = msg.text;

        if self.users.contains_key(&new_login) {
            MessageResult(false)
        } else {
            recipient
                .try_send(ClientMessage::Login(new_login.clone()))
                .unwrap();

            self.users.remove(&old_login);
            self.users.insert(new_login, recipient);

            self.send_msg_to_all_users(text);

            MessageResult(true)
        }
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct TextMsg {
    pub author: String,
    pub text: String,
}

impl Handler<TextMsg> for Server {
    type Result = ();

    fn handle(&mut self, msg: TextMsg, _: &mut Self::Context) -> Self::Result {
        let text = message::user_text_message(msg.author, msg.text);
        self.send_msg_to_all_users(text);
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Leave(pub String);

impl Handler<Leave> for Server {
    type Result = ();

    fn handle(&mut self, msg: Leave, _: &mut Self::Context) {
        println!("Login leave = {}", msg.0);
        self.users.remove(&msg.0);

        let msg_text =
            message::user_text_message("Server".to_string(), format!("User {} has left!", msg.0));

        self.send_msg_to_all_users(msg_text);
    }
}

#[derive(Message)]
#[rtype(result = "Vec<String>")]
pub struct ListUsers;

impl Handler<ListUsers> for Server {
    type Result = MessageResult<ListUsers>;

    fn handle(&mut self, _: ListUsers, _: &mut Context<Self>) -> Self::Result {
        let users: Vec<String> = self.users.keys().cloned().collect();
        MessageResult(users)
    }
}
