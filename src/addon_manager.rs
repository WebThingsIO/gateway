use std::{collections::HashMap, error::Error, fs, path::PathBuf};

use crate::{addon::Addon, addon_utils, plugin_server::PluginServer, user_config};

pub struct AddonManager {
    plugin_server: PluginServer,
    installed_addons: HashMap<String, Addon>,
}

impl AddonManager {
    pub fn new() -> Result<Self, Box<dyn Error>> {
        Ok(Self {
            plugin_server: PluginServer::new()?,
            installed_addons: HashMap::new(),
        })
    }

    pub fn load_addons(&mut self) -> Result<(), Box<dyn Error>> {
        let entries: Result<Vec<_>, _> = fs::read_dir(user_config::ADDONS_DIR.clone())?.collect();
        let entries: Result<Vec<_>, Box<dyn Error>> = entries?
            .into_iter()
            .map(|entry| Ok((entry.file_type()?, entry)))
            .collect(); // FIXME: may not work for symlinks?
        for entry in entries? {
            self.load_addon(entry.1.path())?;
        }
        Ok(())
    }

    fn load_addon(&mut self, path: PathBuf) -> Result<(), Box<dyn Error>> {
        let package_id = addon_utils::package_id(&path)?;
        let manifest = addon_utils::load_manifest(&path)?;
        let addon = Addon::new(manifest);
        self.installed_addons.insert(package_id.to_owned(), addon);
        let addon = self.installed_addons.get(package_id).unwrap();

        // let addon_key = format!("addons.{}", package_id);
        // TODO: Load add-on (enabled, ...)
        // let config_key = format!("addons.config.{}", package_id);
        // TODO: Load add-on settings

        if !addon.enabled {
            return Err(Box::<dyn Error>::from(format!(
                "Add-on not enabled: {}",
                package_id,
            )));
        }

        // TODO: extension add-ons

        // TODO: Create data path

        println!("Loading add-on {}", addon.manifest.id);
        self.plugin_server.load_plugin(
            &path,
            addon
                .manifest
                .gateway_specific_settings
                .webthings
                .exec
                .to_owned(),
        )?;

        Ok(())
    }

    pub fn unload_addons(&mut self) {
        // TODO
    }
}
