use std::{
    error::Error,
    net::{TcpListener, TcpStream},
    sync::{Arc, Mutex, Weak},
    thread,
};

use tungstenite::{
    protocol::{Message, WebSocket},
    server::accept,
};

use crate::message_types::MessageType;

type Callback = fn(MessageType, Weak<Mutex<WebSocket<TcpStream>>>);

pub fn start(callback: Callback) -> Result<(), Box<dyn Error>> {
    let server = TcpListener::bind("127.0.0.1:9500")?; // TODO: configurable port

    thread::spawn(move || {
        for stream in server.incoming() {
            thread::spawn(move || {
                let websocket = Arc::new(Mutex::new(
                    accept(stream.expect("Get connection stream"))
                        .expect("Setup websocket connection"),
                ));
                loop {
                    let mut websocket_mut = websocket
                        .lock()
                        .expect("Acquire read handle for web socket");
                    let msg = websocket_mut.read_message().expect("Receive message");
                    if let Message::Text(msg) = msg {
                        callback(
                            msg.parse::<MessageType>().unwrap(),
                            Arc::downgrade(&websocket),
                        );
                    } else {
                        panic!("Expected text message");
                    }
                }
            });
        }
    });
    Ok(())
}
