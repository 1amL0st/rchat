use actix::*;
use actix_web_actors::ws;

use crate::server::Leave;

use super::session::*;

impl Actor for Session {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);
    }

    fn stopping(&mut self, _: &mut Self::Context) -> Running {
        self.server.do_send(Leave {
            login: self.login.clone(),
            room_id: self.room_id,
        });
        Running::Stop
    }
}

impl Handler<SessionMessage> for Session {
    type Result = String;

    fn handle(&mut self, msg: SessionMessage, ctx: &mut Self::Context) -> Self::Result {
        match msg {
            SessionMessage::Text(text) => ctx.text(text),
            SessionMessage::InviteToDM(from_login) => {
                println!("User is handling from_login = {}", from_login);
                return format!("InviteToDM from_login = {}", from_login);
            }
        }
        String::from("Default branch!")
    }
}
