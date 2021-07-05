/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

use std::error::Error;
use std::net::TcpStream;
use std::sync::{Mutex, Weak};

use tungstenite::WebSocket;

use webthings_gateway_ipc_types::{Message, MessageBase, PluginRegisterResponseMessageData, Preferences, Units, UserProfile};

pub struct AddonInstance {}

impl AddonInstance {
    pub fn new() -> Self {
        Self {}
    }

    pub fn on_msg(
        &self,
        msg: Message,
        ws: Weak<Mutex<WebSocket<TcpStream>>>,
    ) -> Result<(), Box<dyn Error>> {
        println!("Received {:?}", msg);

        if let Message::PluginRegisterRequest(msg) = msg {
            let id = msg.plugin_id();

            // TODO: Read fields from settings
            let response: Message = PluginRegisterResponseMessageData {
                gateway_version: env!("CARGO_PKG_VERSION").to_owned(),
                plugin_id: id.to_owned(),
                preferences: Preferences {
                    language: "en-US".to_owned(),
                    units: Units {
                        temperature: "degree celsius".to_owned(),
                    },
                },
                user_profile: UserProfile {
                    addons_dir: "".to_owned(),
                    base_dir: "".to_owned(),
                    config_dir: "".to_owned(),
                    data_dir: "".to_owned(),
                    gateway_dir: "".to_owned(),
                    log_dir: "".to_owned(),
                    media_dir: "".to_owned(),
                },
            }
                .into();

            println!("Sending {:?}", &response);
            ws.upgrade()
                .expect("Upgrade websocket")
                .lock()
                .expect("Acquire websocket handle")
                .write_message(tungstenite::Message::Text(serde_json::to_string(
                    &response,
                )?))?;
        } else {
            println!("Received message: {:?}", msg);
        }

        Ok(())
    }
}
