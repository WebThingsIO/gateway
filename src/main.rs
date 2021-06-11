#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate lazy_static;
extern crate rocket_contrib;
extern crate rusqlite;

mod db;
mod model;
mod router;
mod user_config;

use rocket::Rocket;

use db::Db;

fn rocket() -> Rocket {
    rocket::ignite()
        .manage(Db::new())
        .mount("/", router::routes())
}

fn main() {
    rocket().launch();
}

#[cfg(test)]
mod test {
    use super::*;
    use rocket::http::Status;
    use rocket::local::Client;

    fn setup() {
        let dir = std::env::temp_dir().join(".webthingsio");
        std::fs::remove_dir_all(&dir);
        std::env::set_var("WEBTHINGS_HOME", dir);
    }

    #[test]
    fn get_things() {
        setup();
        let client = Client::new(rocket()).expect("Valid rocket instance");
        let mut response = client.get("/things").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.body_string(), Some("[]".into()));
    }

    #[test]
    fn get_thing() {
        setup();
        let client = Client::new(rocket()).expect("Valid rocket instance");
        let response = client.get("/thing/test").dispatch();
        assert_eq!(response.status(), Status::NotFound);
    }
}
