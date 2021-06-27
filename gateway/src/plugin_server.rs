use std::{collections::HashMap, error::Error, path::PathBuf};

use crate::{addon_utils, ipc_socket, plugin::Plugin};

pub struct PluginServer {
    plugins: HashMap<String, Plugin>,
}

impl PluginServer {
    pub fn new() -> Result<Self, Box<dyn Error>> {
        ipc_socket::start(|msg, _ws| {
            println!("{:?}", msg);
        })?;
        let plugins = HashMap::new();
        Ok(Self { plugins })
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
