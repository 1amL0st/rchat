use actix::*;
use actix_files::Files;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;

mod constants;
mod messages;
mod server;
mod session;

use server::server::Server;
use session::session::Session;

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
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
