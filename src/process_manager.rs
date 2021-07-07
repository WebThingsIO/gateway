use crate::addon_manager::{AddonManager, AddonStopped};
use crate::user_config;
use actix::prelude::*;
use actix::{Actor, Context};
use regex::Regex;
use std::{
    io::{BufRead, BufReader},
    path::PathBuf,
    process::{Command, Stdio},
    thread,
};

#[derive(Default)]
pub struct ProcessManager;

impl Actor for ProcessManager {
    type Context = Context<Self>;

    fn started(&mut self, _ctx: &mut Context<Self>) {
        println!("ProcessManager started");
    }

    fn stopped(&mut self, _ctx: &mut Context<Self>) {
        println!("ProcessManager stopped");
    }
}

impl actix::Supervised for ProcessManager {}

impl SystemService for ProcessManager {
    fn service_started(&mut self, _ctx: &mut Context<Self>) {
        println!("ProcessManager service started");
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct StartAddon {
    pub path: PathBuf,
    pub id: String,
    pub exec: String,
}

impl Handler<StartAddon> for ProcessManager {
    type Result = ();

    fn handle(&mut self, msg: StartAddon, _ctx: &mut Context<Self>) -> Self::Result {
        let StartAddon { exec, id, path } = msg;
        let addon_manager = AddonManager::from_registry().clone();
        thread::spawn(move || {
            let exec_cmd = format(
                &exec,
                &id,
                &path.to_str().expect("Convert exec_path to string"),
            );

            let args: Vec<_> = exec_cmd.split_ascii_whitespace().collect();
            let mut child = Command::new(args[0])
                .args(&args[1..])
                .env("WEBTHINGS_HOME", user_config::BASE_DIR.as_os_str())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
                .expect(&format!("Start plugin {}\n Command: {}", id, exec));

            let stdout = child.stdout.take().expect("Capture standard output");
            let reader = BufReader::new(stdout);
            reader
                .lines()
                .filter_map(|line| line.ok())
                .for_each(|line| println!("{} {}", id, line));

            let stderr = child.stderr.take().expect("Capture standard error");
            let reader = BufReader::new(stderr);
            reader
                .lines()
                .filter_map(|line| line.ok())
                .for_each(|line| eprintln!("{} {}", id, line));

            let code = child.wait().expect("Obtain exit code");

            println!("Addon: {} died, code = {}", id, code);

            addon_manager.do_send(AddonStopped(id));
        });
    }
}

// FIXME: Find a better way to do this
fn format(s: &str, name: &str, path: &str) -> String {
    let re = Regex::new("\\{name\\}").unwrap();
    let result = re.replace_all(s, name).to_string();
    let re = Regex::new("\\{path\\}").unwrap();
    let result = re.replace_all(&result, path).to_string();
    result
}
