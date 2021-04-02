use actix::prelude::*;

use crate::session::session::SessionMessage;

type UserRecipient = Recipient<SessionMessage>;

#[derive(Debug, Clone)]
pub struct User {
    pub recipient: UserRecipient,
}

impl User {
    pub fn new(recipient: UserRecipient) -> User {
        Self { recipient }
    }

    pub fn do_send(&self, msg: SessionMessage) -> Result<(), SendError<SessionMessage>> {
        self.recipient.do_send(msg)
    }
}
