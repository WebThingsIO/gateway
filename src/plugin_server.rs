use std::{collections::HashMap, error::Error, path::PathBuf};

use crate::{addon_utils, ipc_socket::IPCSocket, plugin::Plugin};

pub struct PluginServer {
    ipc_socket: IPCSocket,
    plugins: HashMap<String, Plugin>,
}

impl PluginServer {
    pub fn new() -> Result<Self, Box<dyn Error>> {
        let ipc_socket = IPCSocket::new()?;
        let plugins = HashMap::new();
        Ok(Self {
            ipc_socket,
            plugins,
        })
    }

    pub fn load_plugin(&mut self, path: &PathBuf, exec: String) -> Result<(), Box<dyn Error>> {
        let id = addon_utils::package_id(&path)?;
        if !self.plugins.contains_key(id) {
            let plugin = Plugin::new(id.to_owned(), exec, path.to_owned());
            plugin.start()?;
            self.plugins.insert(id.to_owned(), plugin);
        }
        Ok(())
    }
}
