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
    extern crate rusty_fork;
    extern crate serial_test;
    use super::*;
    use rocket::http::Status;
    use rocket::local::Client;
    use rusty_fork::rusty_fork_test;
    use serial_test::serial;
    use std::{env, fs};

    fn setup() {
        let dir = env::temp_dir().join(".webthingsio_main_tests");
        fs::remove_dir_all(&dir);
        env::set_var("WEBTHINGS_HOME", dir);
    }

    rusty_fork_test! {
        #[test]
        #[serial]
        fn get_things() {
            setup();
            let client = Client::new(rocket()).expect("Valid rocket instance");
            let mut response = client.get("/things").dispatch();
            assert_eq!(response.status(), Status::Ok);
            assert_eq!(response.body_string(), Some("[]".into()));
        }

        #[test]
        #[serial]
        fn get_thing() {
            setup();
            let client = Client::new(rocket()).expect("Valid rocket instance");
            let response = client.get("/thing/test").dispatch();
            assert_eq!(response.status(), Status::NotFound);
        }
    }
}
