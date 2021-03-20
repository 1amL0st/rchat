use std::time::{Instant, Duration};

use actix::*;
use actix_files::Files;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;

mod server;
mod message;
use server::{ClientMessage, Server, ServerMessage};

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

struct Client {
    hb: Instant,

    login: String,

    server: Addr<Server>
}

impl Client {
    fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                println!("Websocket Client heartbeat failed, disconnecting!");

                let msg = ServerMessage::Leave { login: act.login.clone() };
                act.server.do_send(msg);

                ctx.stop();
                return;
            }

            ctx.ping(b"");
        });
    }
}

impl Actor for Client {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);
    }
}

impl Handler<ClientMessage> for Client {
    type Result = usize;

    fn handle(&mut self, msg: ClientMessage, ctx: &mut Self::Context) -> Self::Result {
        match msg {
            ClientMessage::Text(text) => ctx.text(text),
            ClientMessage::LoginFail => {
                ctx.text("Login exists!")
            }
            ClientMessage::LoginSuccess(login) => {
                self.login = login;
                ctx.text("Login is set")
            }
        }
        0
    }
}

impl Client {
    fn new(server: Addr<Server>, name: String) -> Self {
        Client {
            server: server,
            login: name,
            hb: Instant::now()
        }
    }

    fn handle_login(&mut self, ctx: &mut ws::WebsocketContext<Self>, login: &str) {
        let login = login.to_string();
        let recipient = ctx.address().recipient();

        let msg = if self.login == "" {
            message::user_text_message(
                "Server".to_string(),
                format!("User {} joined!", login)
            )
        } else {
            message::user_text_message(
                "Server".to_string(),
                format!("User {} has change its name to {}!", self.login, login)
            )
        };

        let msg = ServerMessage::Login {
            old_login: self.login.clone(),
            text: msg,
            new_login: login,
            recipient: recipient
        };

        self.server.try_send(msg).unwrap();
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for Client {
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
                let pair: Vec<&str>  = text.split(" ").collect();

                match pair[0] {
                    "/login" => {
                        let login = pair[1];
                        self.handle_login(ctx, login)
                    },
                    _ => {
                        self.server.do_send(ServerMessage::TextMsg {
                            author: self.login.to_string(),
                            text: text
                        });
                    }
                }
            },
            ws::Message::Close(_) => {
                let server_msg = ServerMessage::Leave {
                    login: self.login.clone(),
                };

                self.server.try_send(server_msg).unwrap();
            }
            _ => (),
        }
    }
}

async fn start_ws_connection(
    req: HttpRequest,
    stream: web::Payload,
    server: web::Data<Addr<Server>>
) -> Result<HttpResponse, actix_web::Error> {
    let client = Client::new(server.get_ref().clone(), String::from(""));
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
