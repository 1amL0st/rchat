use std::time::{Duration, Instant};

use actix::*;
use actix_files::Files;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;

mod message;
mod server;

use server::{
    CreateRoom, CurrentRoom, JoinRoom, Leave, ListRooms, Login, Server, SessionMessage, TextMsg,
};

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

struct Session {
    hb: Instant,

    login: String,
    room_id: usize,

    server: Addr<Server>,
}

impl Actor for Session {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);
    }
}

impl Handler<SessionMessage> for Session {
    type Result = usize;

    fn handle(&mut self, msg: SessionMessage, ctx: &mut Self::Context) -> Self::Result {
        match msg {
            SessionMessage::Text(text) => ctx.text(text),
            SessionMessage::Login(result) => match result {
                Ok(login) => {
                    self.login = login;
                    ctx.text("Login is set")
                }
                Err(err) => {
                    ctx.text(err);
                }
            },
        }
        0
    }
}

impl Session {
    fn new(server: Addr<Server>, name: String) -> Self {
        Session {
            room_id: 0,
            server: server,
            login: name,
            hb: Instant::now(),
        }
    }

    fn handle_login(&mut self, ctx: &mut ws::WebsocketContext<Self>, login: &str) {
        let recipient = ctx.address().recipient();

        let msg = if self.login == "" {
            message::make_join_notify_msg(format!("User {} joined!", login))
        } else {
            message::make_text_msg(
                "Server".to_string(),
                format!("User {} has changed its name to {}!", self.login, login),
            )
        };

        let login_msg = Login {
            old_login: self.login.clone(),
            text: msg,
            new_login: login.to_string(),
            recipient: recipient,
        };

        self.server.try_send(login_msg).unwrap();
    }

    fn handle_cmd_list_users(&mut self, _: String, ctx: &mut ws::WebsocketContext<Self>) {
        self.server
            .send(server::ListUsers {
                room_id: self.room_id,
            })
            .into_actor(self)
            .then(|res, _, ctx| {
                match res {
                    Ok(users) => {
                        let msg = message::make_user_list_msg(&users);
                        ctx.text(msg);
                    }
                    _ => println!("Something is wrong"),
                }
                fut::ready(())
            })
            .wait(ctx)
    }

    fn handle_cmd_current_room(&mut self, ctx: &mut ws::WebsocketContext<Self>) {
        self.server
            .send(CurrentRoom {
                room_id: self.room_id,
            })
            .into_actor(self)
            .then(|res, _, ctx| {
                match res {
                    Ok(room_name) => {
                        let msg = message::make_current_room_msg(room_name);
                        ctx.text(msg);
                    }
                    _ => println!("Something is wrong"),
                }
                fut::ready(())
            })
            .wait(ctx)
    }

    fn handle_cmd_join_room(&mut self, ctx: &mut ws::WebsocketContext<Self>, room_name: String) {
        if self.room_id == 0 && room_name == server::MAIN_ROOM_NAME {
            return;
        }

        self.server
            .send(JoinRoom {
                cur_room_id: self.room_id,
                room_name: room_name.clone(),
                login: self.login.clone(),
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                if let Ok(result) = res {
                    match result {
                        Ok(room_id) => {
                            act.room_id = room_id;
                            ctx.text("Join to room!");

                            let m = room_name;
                            let text = format!("You joined room '{}'", m);
                            ctx.text(message::make_server_msg(text));
                        }
                        Err(err) => ctx.text(err),
                    }
                } else {
                    panic!("Something went wrong!")
                }

                fut::ready(())
            })
            .wait(ctx)
    }

    fn handle_cmd_list_rooms(&mut self, ctx: &mut ws::WebsocketContext<Self>) {
        self.server
            .send(ListRooms {
                cur_room_id: self.room_id,
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                if let Ok(result) = res {
                    let msg = message::make_rooms_list_msg(&result);
                    ctx.text(msg);
                } else {
                    panic!("Something wen wrong!")
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn handle_cmd_create_room(&mut self, ctx: &mut ws::WebsocketContext<Self>, room_name: String) {
        self.server
            .send(CreateRoom {
                cur_room_id: self.room_id,
                room_name: room_name,
                login: self.login.clone(),
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                if let Ok(result) = res {
                    if let Ok(id) = result {
                        // TODO: Send a message with result or error if room creatin failed...
                        act.room_id = id;
                    }
                } else {
                    panic!("Something wen wrong!")
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn handle_text(&mut self, text: String, ctx: &mut ws::WebsocketContext<Self>) {
        let pair: Vec<&str> = text.split(" ").collect();
        match pair[0] {
            "/create_room" => {
                self.handle_cmd_create_room(ctx, pair[1].to_string()) // NOTE: What is pair[1] doesn't exist
            }
            "/join" => {
                self.handle_cmd_join_room(ctx, pair[1].to_string()) // NOTE: What is pair[1] doesn't exist
            }
            "/current_room" => {
                self.handle_cmd_current_room(ctx);
            }
            "/list_rooms" => self.handle_cmd_list_rooms(ctx),
            "/login" => {
                let login = &text[6..];
                self.handle_login(ctx, login)
            }
            "/list_users" => self.handle_cmd_list_users(text, ctx),
            _ => {
                self.server
                    .try_send(TextMsg {
                        author: self.login.to_string(),
                        text: text,
                        room_id: self.room_id,
                    })
                    .unwrap();
            }
        }
    }

    fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                act.server.do_send(Leave {
                    login: act.login.clone(),
                    room_id: act.room_id,
                });

                ctx.stop();
                return;
            }
            ctx.ping(b"");
        });
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for Session {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        let msg = match msg {
            Err(_) => {
                ctx.stop();
                return;
            }
            Ok(msg) => msg,
        };

        match msg {
            ws::Message::Ping(msg) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            ws::Message::Pong(_) => {
                self.hb = Instant::now();
            }
            ws::Message::Text(text) => {
                self.handle_text(text, ctx);
            }
            ws::Message::Close(_) => {
                if self.login != "" {
                    self.server
                        .try_send(Leave {
                            login: self.login.clone(),
                            room_id: self.room_id,
                        })
                        .unwrap();
                }
            }
            _ => (),
        }
    }
}

async fn start_ws_connection(
    req: HttpRequest,
    stream: web::Payload,
    server: web::Data<Addr<Server>>,
) -> Result<HttpResponse, actix_web::Error> {
    let client = Session::new(server.get_ref().clone(), String::from(""));
    let resp = ws::start(client, &req, stream);
    resp
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let server = Server::start(Server::new());

    HttpServer::new(move || {
        App::new()
            .data(server.clone())
            .service(web::resource("/ws/").to(start_ws_connection))
            .service(Files::new("/", "./client/").index_file("index.html"))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
