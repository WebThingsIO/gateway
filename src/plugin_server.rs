use std::{
    collections::HashMap,
    error::Error,
    net::TcpStream,
    path::PathBuf,
    sync::{Arc, Mutex, Weak},
};

use tungstenite::{self, WebSocket};
use webthings_gateway_ipc_types::{
    Message, MessageBase, PluginRegisterResponseMessageData, Preferences, Units, UserProfile,
};

use crate::{addon_utils, ipc_socket, plugin::Plugin};

pub struct PluginServer {
    plugins: HashMap<String, Plugin>,
}

impl PluginServer {
    pub fn new() -> Result<Arc<Mutex<Self>>, Box<dyn Error>> {
        let plugins = HashMap::new();
        let plugin_server = Arc::new(Mutex::new(Self { plugins }));
        let plugin_server_clone = plugin_server.clone();
        ipc_socket::start(move |msg, ws| {
            plugin_server_clone
                .lock()
                .expect("Lock plugin server")
                .on_msg(msg, ws)
                .unwrap();
        })?;
        Ok(plugin_server)
    }

    pub fn load_plugin(&mut self, path: &PathBuf, exec: String) -> Result<(), Box<dyn Error>> {
        let id = addon_utils::package_id(&path)?;
        self.register_plugin(id);
        let plugin = self.plugins.get(id).ok_or("Plugin not found")?;
        plugin.start(exec, path.to_owned())?;
        Ok(())
    }

    pub fn register_plugin(&mut self, id: &str) {
        if !self.plugins.contains_key(id) {
            let plugin = Plugin::new(id.to_owned());
            self.plugins.insert(id.to_owned(), plugin);
        }
    }

    fn on_msg(
        &mut self,
        msg: Message,
        ws: Weak<Mutex<WebSocket<TcpStream>>>,
    ) -> Result<(), Box<dyn Error>> {
        println!("Received {:?}", msg);

        if let Message::PluginRegisterRequest(msg) = msg {
            let id = msg.plugin_id();
            self.register_plugin(id);
            let plugin = self.plugins.get_mut(id).ok_or("Plugin not found")?;
            plugin.ws = ws.clone();

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
            if let Some(plugin) = self.plugins.get(msg.plugin_id()) {
                plugin.on_msg(msg);
            }
        }
        Ok(())
    }
}
