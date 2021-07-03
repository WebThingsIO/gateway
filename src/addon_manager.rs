use std::{
    collections::HashMap,
    error::Error,
    fs,
    path::PathBuf,
    io::{BufRead, BufReader},
    process::{Command, Stdio},
    thread,
};

use crate::{addon::Addon, addon_utils, user_config};
use crate::addon_instance::AddonInstance;
use regex::Regex;

pub struct AddonManager {
    installed_addons: HashMap<String, Addon>,
    running_addons: HashMap<String, AddonInstance>,
}

impl AddonManager {
    pub fn new() -> Self {
        Self {
            installed_addons: HashMap::new(),
            running_addons: HashMap::new(),
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
        self.start_addon(path, id.clone(), exec)?;
        self.running_addons.insert(id, AddonInstance::new());

        Ok(())
    }

    pub fn start_addon(&self, path: PathBuf, id: String, exec: String) -> Result<(), Box<dyn Error>> {
        thread::spawn(move || {
            let exec_cmd = format(
                &exec,
                &id,
                &path.to_str().expect("Convert exec_path to string"),
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
                .for_each(|line| println!("{} {}", id, line));

            let stderr = child.stderr.take().expect("Capture standard error");
            let reader = BufReader::new(stderr);
            reader
                .lines()
                .filter_map(|line| line.ok())
                .for_each(|line| eprintln!("{} {}", id, line));

            let code = child.wait().expect("Obtain exit code");

            println!("Plugin: {} died, code = {}", id, code);

            // TODO: Handling plugin exit
        });

        Ok(())
    }

    pub fn unload_addons(&mut self) {
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
