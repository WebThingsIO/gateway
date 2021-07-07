use crate::{
    addon::Addon,
    addon_instance::AddonInstance,
    addon_utils,
    process_manager::{ProcessManager, StartAddon},
    user_config,
};
use actix::prelude::*;
use actix::{Actor, Context};
use std::{collections::HashMap, error::Error, fs, path::PathBuf};

pub struct AddonManager {
    process_manager: Addr<ProcessManager>,
    installed_addons: HashMap<String, Addon>,
    running_addons: HashMap<String, Addr<AddonInstance>>,
}

impl Actor for AddonManager {
    type Context = Context<Self>;

    fn started(&mut self, _ctx: &mut Context<Self>) {
        println!("AddonManager started");
    }

    fn stopped(&mut self, _ctx: &mut Context<Self>) {
        println!("AddonManager stopped");
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct LoadAddons();

impl Handler<LoadAddons> for AddonManager {
    type Result = ();

    fn handle(&mut self, _msg: LoadAddons, _ctx: &mut Context<Self>) -> Self::Result {
        println!("Received LoadAddons message");
        self.load_addons().expect("Loading addons");
        println!("Finished loading addons");
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct AddonRunning(pub String, pub Addr<AddonInstance>);

impl Handler<AddonRunning> for AddonManager {
    type Result = ();

    fn handle(&mut self, msg: AddonRunning, _ctx: &mut Context<Self>) -> Self::Result {
        println!("Received addon running message");
        self.running_addons.insert(msg.0, msg.1);
    }
}

impl AddonManager {
    pub fn new() -> Self {
        let process_manager = ProcessManager::new().start();
        Self {
            installed_addons: HashMap::new(),
            running_addons: HashMap::new(),
            process_manager,
        }
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
        let id = manifest.id.clone();
        let exec = manifest.gateway_specific_settings.webthings.exec.clone();
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
        self.process_manager.do_send(StartAddon {
            path,
            id: id.clone(),
            exec,
        });

        Ok(())
    }

    pub fn unload_addons(&mut self) {
        // TODO
    }
}
