use std::time::{Duration, Instant};

use actix::*;
use actix_files::Files;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;

mod messages;
mod server;

use server::{
    CreateRoom, CurrentRoom, JoinRoom, Leave, ListRooms, Login, Server, SessionMessage, TextMsg,
};

use messages::data_msgs as dataMsgs;
use messages::server_msgs as serverMsgs;

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

    fn stopping(&mut self, ctx: &mut Self::Context) -> Running {
        self.server.do_send(Leave {
            login: self.login.clone(),
            room_id: self.room_id,
        });
        Running::Stop
    }
}

impl Handler<SessionMessage> for Session {
    type Result = usize;

    fn handle(&mut self, msg: SessionMessage, ctx: &mut Self::Context) -> Self::Result {
        match msg {
            SessionMessage::Text(text) => ctx.text(text),
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

    fn handle_login(&mut self, ctx: &mut ws::WebsocketContext<Self>, login: String) {
        let recipient = ctx.address().recipient();

        let msg = if self.login == "" {
            serverMsgs::user_joined_room(format!("User {} joined!", login), login.clone())
        } else {
            messages::make_text_msg(
                "Server".to_string(),
                format!("User {} has changed its name to {}!", self.login, login),
            )
        };

        let login_msg = Login {
            room_id: self.room_id,
            old_login: self.login.clone(),
            text: msg,
            new_login: login.clone(),
            recipient: recipient,
        };

        self.server
            .send(login_msg)
            .into_actor(self)
            .then(move |res, act, ctx| {
                match res {
                    Ok(result) => {
                        match result {
                            Ok(()) => {
                                let old_login = act.login.clone();
                                act.login = login.clone();
    
                                ctx.text(serverMsgs::logging_success(&login));
    
                                if old_login == "" {
                                    ctx.text(serverMsgs::user_connected(&format!(
                                        "{}, you're connected! Welcome to rchat!",
                                        login
                                    )));
                                }
                            }
                            Err(err) => {
                                ctx.text(err);
                            }
                        }
                    },
                    Err(err) => {
                        println!("Err = {}", err);
                        panic!("Something went wrong!");
                    }
                }
                fut::ready(())
            })
            .wait(ctx);
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
                        let msg = dataMsgs::user_list_msg(&users);
                        ctx.text(msg);
                    }
                    _ => println!("Something went wrong!"),
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
                        let msg = dataMsgs::current_room_msg(room_name);
                        ctx.text(msg);
                    }
                    _ => println!("Something is wrong"),
                }
                fut::ready(())
            })
            .wait(ctx)
    }

    fn handle_cmd_join_room(
        &mut self,
        ctx: &mut ws::WebsocketContext<Self>,
        mut room_name: String,
    ) {
        room_name = room_name.trim().to_string();
        if self.room_id == server::MAIN_ROOM_ID && room_name == server::MAIN_ROOM_NAME {
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

                            let m = room_name;
                            ctx.text(serverMsgs::you_joined_room(&m))
                        }
                        Err(err) => {
                            ctx.text(serverMsgs::user_joined_room_fail(&err));
                        }
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
            .then(|res, _, ctx| {
                if let Ok(result) = res {
                    let msg = dataMsgs::room_list_msg(&result);
                    ctx.text(msg);
                } else {
                    panic!("Something wenеt wrong!")
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn handle_cmd_create_room(
        &mut self,
        ctx: &mut ws::WebsocketContext<Self>,
        mut room_name: String,
    ) {
        room_name = room_name.trim().to_string();

        if room_name == "" {
            let msg = serverMsgs::room_creation_fail(format!(
                "Room name has wrong format!"
            ));
            ctx.text(msg);
            return;
        } else if room_name.chars().count() > 32 {
            ctx.text(serverMsgs::room_creation_fail(format!(
                "Your room name is too long!"
            )))
        }

        self.server
            .send(CreateRoom {
                cur_room_id: self.room_id,
                room_name: room_name.clone(),
                login: self.login.clone(),
            })
            .into_actor(self)
            .then(move |res, act, ctx| {
                if let Ok(result) = res {
                    match result {
                        Ok(id) => {
                            act.room_id = id;
                            let msg = serverMsgs::you_joined_room(&room_name);
                            ctx.text(msg);
                        }
                        Err(err) => {
                            let msg = serverMsgs::room_creation_fail(format!(
                                "Couldn't create room! {}",
                                err
                            ));
                            ctx.text(msg);
                        }
                    }
                } else {
                    panic!("Something went wrong!")
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn handle_user_msg(&mut self, text: String, ctx: &mut ws::WebsocketContext<Self>) {
        if text.chars().count() <= 2048 {
            self.server
            .try_send(TextMsg {
                author: self.login.to_string(),
                text: text,
                room_id: self.room_id,
            })
            .unwrap();
        } else {
            ctx.text(
                serverMsgs::failed_to_send_msg(
                    &format!("Your message is too long!")
                )
            )
        }
    }

    fn handle_text(&mut self, text: String, ctx: &mut ws::WebsocketContext<Self>) {
        let first_word = text.chars().take_while(|c| *c != ' ').collect::<String>();
        let first_word = first_word.as_str();

        // Check if user choose a login
        if self.login == "" {
            if first_word == "/login" {
                self.handle_login(ctx, text[7..].to_string());
            }
        } else {
            match first_word {
                "/create_room" => {
                    self.handle_cmd_create_room(ctx, text[12..].to_string());
                }
                "/join" => {
                    self.handle_cmd_join_room(ctx, text[5..].to_string());
                }
                "/current_room" => {
                    self.handle_cmd_current_room(ctx);
                }
                "/list_rooms" => self.handle_cmd_list_rooms(ctx),
                "/login" => {
                    self.handle_login(ctx, text[7..].to_string());
                }
                "/list_users" => self.handle_cmd_list_users(text, ctx),
                _ => self.handle_user_msg(text, ctx)
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
            ws::Message::Close(reason) => {
                ctx.close(reason);
                ctx.stop();
            },
            ws::Message::Continuation(_) => {
                ctx.stop();
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

async fn p404() -> actix_web::Result<actix_files::NamedFile> {
    Ok(actix_files::NamedFile::open("./public/index.html")?)
    // Ok(actix_files::NamedFile::open("static/404.html")?.set_status_code(StatusCode::NOT_FOUND))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let server = Server::start(Server::new());

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("PORT must be a number");

    HttpServer::new(move || {
        App::new()
            .data(server.clone())
            .service(web::resource("/ws/").to(start_ws_connection))
            .service(Files::new("/", "./public/").index_file("index.html"))
            .default_service(web::resource("/").route(web::get().to(p404)))
            // .default_service(web::resource("/").route(web::get().to(|req: HttpRequest| {
            //     actix_files::NamedFile::open("./publi/index.html").unwrap()
            //     // HttpResponse::Found()
            //     //     .header(actix_web::http::header::LOCATION, "/")
            //     //     .finish()
            // })))
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
