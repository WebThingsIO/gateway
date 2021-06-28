use std::{
    error::Error,
    net::{TcpListener, TcpStream},
    sync::{Arc, Mutex, Weak},
    thread,
};

use tungstenite::{self, protocol::WebSocket, server::accept};

use crate::messages::Message;

pub fn start<F>(callback: F) -> Result<(), Box<dyn Error>>
where
    F: FnMut(Message, Weak<Mutex<WebSocket<TcpStream>>>) + Send + Sync + 'static,
{
    let server = TcpListener::bind("127.0.0.1:9500")?; // TODO: configurable port

    let callback = Arc::new(Mutex::new(callback));
    thread::spawn(move || {
        for stream in server.incoming() {
            let callback = callback.clone();
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
                    if let tungstenite::Message::Text(msg) = msg {
                        (callback.lock().expect("Lock callback"))(
                            msg.parse::<Message>().unwrap(),
                            Arc::downgrade(&websocket), // FIXME: Build abstraction for this websocket, so the outer world needn't care about tungstenite::Message but only know messages::Message
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
