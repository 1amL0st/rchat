use actix::*;
use actix_web_actors::ws;

use super::session::*;
use crate::messages::server_msgs as serverMsgs;
use crate::server::msgs_handlers as ServerHandlerMsgs;

use super::session::IncomingInvite;

impl Actor for Session {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);
    }

    fn stopping(&mut self, _: &mut Self::Context) -> Running {
        self.server.do_send(ServerHandlerMsgs::Leave {
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
pub struct YouJoinedRoom {
    pub room_id: usize,
    pub room_name: String,
}

impl Handler<YouJoinedRoom> for Session {
    type Result = MessageResult<YouJoinedRoom>;

    fn handle(&mut self, msg: YouJoinedRoom, ctx: &mut Self::Context) -> Self::Result {
        self.room_id = msg.room_id;

        ctx.text(serverMsgs::you_joined_room(&msg.room_name));

        MessageResult(())
    }
}

#[derive(Message)]
#[rtype(result = "Result<(), String>")]
pub struct InviteToDMRequest {
    pub inviter: String,
    pub inviter_addr: Addr<Session>,
}

impl Handler<InviteToDMRequest> for Session {
    type Result = MessageResult<InviteToDMRequest>;

    fn handle(&mut self, msg: InviteToDMRequest, ctx: &mut Self::Context) -> Self::Result {
        if self.incoming_invites.len() == 0 {
            ctx.text(serverMsgs::invite_user_to_dm_request(&msg.inviter));
            self.incoming_invites.push(IncomingInvite {
                addr: msg.inviter_addr,
                login: msg.inviter,
            });
            return MessageResult(Ok(()));
        } else {
            return MessageResult(Err("User already has a request!".to_string()));
        }
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct InviteToDMAccepted {
    pub guest: String,
}

impl Handler<InviteToDMAccepted> for Session {
    type Result = MessageResult<InviteToDMAccepted>;

    fn handle(&mut self, msg: InviteToDMAccepted, ctx: &mut Self::Context) -> Self::Result {
        self.outcoming_invite = None;
        ctx.text(serverMsgs::invite_user_to_dm_accepted(&msg.guest));

        self.server
            .try_send(ServerHandlerMsgs::CreateDM {
                first_login: msg.guest,
                second_login: self.login.clone(),
            })
            .unwrap();

        MessageResult(())
    }
}
#[derive(Message)]
#[rtype(result = "()")]
pub struct InviteToDMRefused {
    pub guest: String,
}

impl Handler<InviteToDMRefused> for Session {
    type Result = MessageResult<InviteToDMRefused>;

    fn handle(&mut self, msg: InviteToDMRefused, ctx: &mut Self::Context) -> Self::Result {
        self.outcoming_invite = None;
        ctx.text(serverMsgs::invite_user_to_dm_refused(&msg.guest));
        MessageResult(())
    }
}
#[derive(Message)]
#[rtype(result = "()")]
pub struct InviteToDMRoomCreated {}

impl Handler<InviteToDMRoomCreated> for Session {
    type Result = MessageResult<InviteToDMRoomCreated>;

    fn handle(&mut self, _: InviteToDMRoomCreated, ctx: &mut Self::Context) -> Self::Result {
        ctx.text(serverMsgs::invite_user_to_dm_room_created());
        MessageResult(())
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct InviteToDMCanceled {
    pub inviter_login: String,
}

impl Handler<InviteToDMCanceled> for Session {
    type Result = MessageResult<InviteToDMCanceled>;

    fn handle(&mut self, msg: InviteToDMCanceled, ctx: &mut Self::Context) -> Self::Result {
        let pos = self
            .incoming_invites
            .iter()
            .position(|invite| invite.login == msg.inviter_login)
            .unwrap();
        self.incoming_invites.remove(pos);

        ctx.text(serverMsgs::invite_user_to_dm_canceled(&msg.inviter_login));
        MessageResult(())
    }
}
