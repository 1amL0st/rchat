use actix::*;
use actix_web_actors::ws;

use super::session::*;
use crate::messages::server_msgs as serverMsgs;
use crate::server::Leave;

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

#[derive(Message)]
#[rtype(result = "()")]
pub struct Text {
    pub text: String,
}

impl Handler<Text> for Session {
    type Result = MessageResult<Text>;

    fn handle(&mut self, msg: Text, ctx: &mut Self::Context) -> Self::Result {
        ctx.text(msg.text);
        MessageResult(())
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct InviteToDM {
    pub inviter: String,
}

impl Handler<InviteToDM> for Session {
    type Result = MessageResult<InviteToDM>;

    fn handle(&mut self, msg: InviteToDM, ctx: &mut Self::Context) -> Self::Result {
        ctx.text(serverMsgs::invite_user_to_dm_request(&msg.inviter));
        MessageResult(())
    }
}
