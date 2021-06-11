use std::{env, fs::DirBuilder, path::PathBuf};

lazy_static! {
    static ref DIR_BUILDER: DirBuilder = {
        let mut builder = DirBuilder::new();
        builder.recursive(true);
        builder
    };
    pub static ref BASE_DIR: PathBuf = {
        let path = match env::var("WEBTHINGS_HOME") {
            Ok(p) => PathBuf::from(&p),
            Err(_) => dirs::home_dir().unwrap().join(".webthings2"),
        };
        DIR_BUILDER.create(&path).unwrap();
        path
    };
    pub static ref CONFIG_DIR: PathBuf = {
        let path = BASE_DIR.join("config");
        DIR_BUILDER.create(&path).unwrap();
        path
    };
}
