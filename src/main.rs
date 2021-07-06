#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate lazy_static;
extern crate rocket_contrib;
extern crate rusqlite;

mod addon;
mod addon_manager;
mod addon_manifest;
mod addon_utils;
mod db;
mod model;
mod router;
mod user_config;
mod addon_instance;
mod addon_socket;

use rocket::Rocket;

use crate::addon_manager::{AddonManager, LoadAddons};
use crate::db::Db;
use actix::{System, Actor};
use std::thread;

fn rocket() -> Rocket {
    rocket::ignite()
        .manage(Db::new())
        // TODO: Manage addon_manager
        .mount("/", router::routes())
}

fn main() -> () {
    let system = System::new("default");

    let address = AddonManager::new().start();

    actix::spawn(async move {
        addon_socket::start().await.expect("Starting addon socket");
    });

    actix::spawn(async move {
        address.send(LoadAddons()).await.expect("Sending LoadAddons message ");
    });

    thread::spawn(||{
        rocket().launch();
    });

    system.run().expect("Running system");
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
        let dir = env::temp_dir().join(".webthingsio");
        fs::remove_dir_all(&dir); // We really don't want to handle this result, since we don't care if the directory never existed
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
