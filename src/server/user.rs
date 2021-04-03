use actix::prelude::*;

use crate::session::session::Session;

type UserAddr = Addr<Session>;

#[derive(Clone)]
pub struct User {
    pub addr: UserAddr,
}

impl User {
    pub fn new(recipient: UserAddr) -> User {
        Self { addr: recipient }
    }
}
