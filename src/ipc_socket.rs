use std::{
    error::Error,
    net::TcpListener,
    sync::{Arc, Mutex},
    thread,
};

use tungstenite::server::accept;

pub struct IPCSocket {
    server: Arc<Mutex<TcpListener>>,
}

impl IPCSocket {
    pub fn new() -> Result<Self, Box<dyn Error>> {
        let server = TcpListener::bind("127.0.0.1:9500").unwrap();
        let server = Arc::new(Mutex::new(server));
        let server_clone = server.clone();

        thread::spawn(move || {
            for stream in server.lock().unwrap().incoming() {
                thread::spawn(move || {
                    let mut websocket = accept(stream.unwrap()).unwrap();
                    loop {
                        let msg = websocket.read_message().unwrap();

                        println!("Received plugin message: {}", msg);

                        // TODO: Handle messages
                        if msg.is_binary() || msg.is_text() {
                            websocket.write_message(msg).unwrap();
                        }
                    }
                });
            }
        });

        Ok(Self {
            server: server_clone,
        })
    }
}
