use crate::addon_manifest::Manifest;

pub struct Addon {
    pub manifest: Manifest,
    pub enabled: bool,
}

impl Addon {
    pub fn new(manifest: Manifest) -> Self {
        Self {
            manifest,
            enabled: true,
        }
    }
}
