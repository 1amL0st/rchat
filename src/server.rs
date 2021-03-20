use std::collections::HashMap;

use actix::dev::{MessageResponse, ResponseChannel};
use actix::prelude::*;
use actix::{Actor, Handler};
use actix_web::client::Client;

#[derive(Message)]
#[rtype(result = "usize")]
pub enum ClientMessage {
    Text(String),
    LoginFail,
    LoginSuccess(String)
}

#[derive(Message, Debug)]
#[rtype(result = "ServerResponse")]
pub enum ServerMessage {
    TextMsg(String),
    Login(String, Recipient<ClientMessage>),
    Leaved(String),
}

pub enum ServerResponse {
    Success,

    LoginSuccess,
    LoginFailed(String),

    Leaved,
    UnkownCommand
}

impl<A, M> MessageResponse<A, M> for ServerResponse
where
    A: Actor,
    M: Message<Result = ServerResponse>,
{
    fn handle<R: ResponseChannel<M>>(self, _: &mut A::Context, tx: Option<R>) {
        if let Some(tx) = tx {
            tx.send(self);
        }
    }
}

#[derive(Debug, Clone)]
pub struct Server {
    users: HashMap<String, Recipient<ClientMessage>>
}

impl Server {
    pub fn new() -> Self {
        Self {
            users: HashMap::new()
        }
    }
}

impl Actor for Server {
    type Context = actix::Context<Self>;

    fn started(&mut self, _: &mut Self::Context) {
        println!("Server is started!");
    }

    fn stopped(&mut self, _: &mut Self::Context) {
        println!("Server is stopped!")
    }
}

impl Handler<ServerMessage> for Server {
    type Result = ServerResponse;

    fn handle(&mut self, msg: ServerMessage, _: &mut Context<Self>) -> Self::Result {
        match msg {
            ServerMessage::Login(login, recipient) => {
                if self.users.contains_key(&login) {
                    recipient.do_send(ClientMessage::LoginFail).unwrap();
                    ServerResponse::LoginFailed("Login exists!".to_string())
                } else {
                    recipient.do_send(ClientMessage::LoginSuccess(login.clone())).unwrap();
                    self.users.insert(login, recipient);
                    ServerResponse::Success
                }
            }
            ServerMessage::TextMsg(text) => {
                for (_, recipient) in &self.users {
                    if let Err(err) = recipient.do_send(ClientMessage::Text(text.clone())) {
                        panic!("Server error in process of send text message {}", err);
                    }
                }
                ServerResponse::Success                
            }
            _ => ServerResponse::UnkownCommand
        }
    }
}
