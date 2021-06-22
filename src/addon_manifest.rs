use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Manifest {
    pub author: String,
    pub description: String,
    pub gateway_specific_settings: GatewaySpecificSettings,
    pub homepage_url: String,
    pub id: String,
    pub license: String,
    pub manifest_version: i32,
    pub name: String,
    pub version: String,
    pub options: Option<Options>,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct GatewaySpecificSettings {
    pub webthings: Webthings,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Webthings {
    pub primary_type: String,
    pub exec: String,
    pub strict_min_version: Option<String>,
    pub strict_max_version: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Options {
    pub default: Option<Map<String, Value>>,
    pub schema: Option<Map<String, Value>>,
}
