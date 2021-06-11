use rocket::{http::Status, response::status, Route, State};
use rocket_contrib::{json, json::JsonValue};

use crate::db::Db;

pub fn routes() -> Vec<Route> {
    routes![get_things, get_thing]
}

#[get("/things")]
fn get_things(db: State<Db>) -> Result<JsonValue, status::Custom<&'static str>> {
    match db.get_things() {
        Err(e) => {
            println!("Error during db.get_things: {:?}", e);
            Err(status::Custom(Status::InternalServerError, "Err"))
        }
        Ok(t) => Ok(json!(t)),
    }
}

#[get("/thing/<thing_id>")]
fn get_thing(db: State<Db>, thing_id: String) -> Result<Option<JsonValue>, status::Custom<String>> {
    match db.get_thing(&thing_id) {
        Err(e) => {
            println!("Error during db.get_things: {:?}", e);
            Err(status::Custom(
                Status::InternalServerError,
                "Err".to_owned(),
            ))
        }
        Ok(t) => {
            if let Some(t) = t {
                Ok(Some(json!(t)))
            } else {
                Err(status::Custom(
                    Status::NotFound,
                    format!("Unable to find thing with title = {}", thing_id),
                ))
            }
        }
    }
}
