use actix::*;
use actix_files::Files;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;

mod server;
use server::{ClientMessage, Server, ServerMessage as ServerMsg, ServerResponse};

struct Client {
    login: String,

    server: Addr<Server>
}

impl Actor for Client {
    type Context = ws::WebsocketContext<Self>;
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
            login: name
        }
    }

    fn handle_login(&mut self, ctx: &mut ws::WebsocketContext<Self>, login: &str) {
        let login = login.to_string();
        let recipient = ctx.address().recipient();

        let msg = ServerMsg::Login(login, recipient);
        self.server.try_send(msg);
    }
}

/// Handler for ws::Message message
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
            ws::Message::Ping(msg) => ctx.pong(&msg),
            ws::Message::Text(text) => {
                let pair: Vec<&str>  = text.split(" ").collect();

                match pair[0] {
                    "/login" => {
                        let login = pair[1];
                        self.handle_login(ctx, login)
                    },
                    _ => {
                        let msg = serde_json::json!({
                            "author": self.login,
                            "text": text
                        });
                        self.server.do_send(ServerMsg::TextMsg(msg.to_string()));
                        ctx.text(text)
                    }
                }
            },
            ws::Message::Binary(bin) => ctx.binary(bin),
            ws::Message::Close(data) => {
                // println!("data = {:?}", data);
                // println!("Connection is closed!")
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
    let client = Client::new(server.get_ref().clone(), String::from("Client"));
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
