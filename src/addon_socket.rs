/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

use actix_web::{App, HttpRequest, HttpResponse, HttpServer, web, Error as ActixError};
use actix_web_actors::ws;
use crate::addon_instance::AddonInstance;
use std::error::Error;

async fn route(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, ActixError> {
    println!("Incoming websocket connection from {:?}", req.peer_addr());
    ws::start(AddonInstance::new(), &req, stream)
}

pub async fn start() -> Result<(), Box<dyn Error>> {
    println!("Starting addon socket");

    HttpServer::new(|| App::new().route("/", web::get().to(route)))
        .bind("127.0.0.1:9500")?
        .run()
        .await?;

    Ok(())
}
