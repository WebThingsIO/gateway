use std::{
    error::Error,
    io::{BufRead, BufReader},
    net::TcpStream,
    path::PathBuf,
    process::{Command, Stdio},
    sync::{Mutex, Weak},
    thread,
};

use regex::Regex;
use tungstenite::WebSocket;

use crate::{messages::Message, user_config};

#[derive(Debug)]
pub struct Plugin {
    id: String,
    exec: Option<String>,
    exec_path: Option<PathBuf>,
    log_prefix: String,
    pub ws: Weak<Mutex<WebSocket<TcpStream>>>,
}

impl Plugin {
    pub fn new(id: String) -> Self {
        let log_prefix = id.to_owned();
        Self {
            id: id,
            exec: None,
            exec_path: None,
            log_prefix,
            ws: Weak::new(),
        }
    }

    pub fn start(&self, exec: String, exec_path: PathBuf) -> Result<(), Box<dyn Error>> {
        let id = self.id.to_owned();
        let log_prefix = self.log_prefix.to_owned();

        thread::spawn(move || {
            let exec_cmd = format(
                &exec,
                &id,
                &exec_path.to_str().expect("Convert exec_path to string"),
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
                .for_each(|line| println!("{} {}", log_prefix, line));

            let stderr = child.stderr.take().expect("Capture standard error");
            let reader = BufReader::new(stderr);
            reader
                .lines()
                .filter_map(|line| line.ok())
                .for_each(|line| eprintln!("{} {}", log_prefix, line));

            let code = child.wait().expect("Obtain exit code");

            println!("Plugin: {} died, code = {}", id, code);

            // TODO: Handling plugin exit
        });

        Ok(())
    }

    pub fn on_msg(&self, msg: Message) {
        println!("Plugin handling message: {:?}", msg);
        // TODO
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
