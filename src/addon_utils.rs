use crate::addon_manifest::Manifest;
use semver::Version;
use serde_json;
use std::{error::Error, fs::File, path::PathBuf};

const MANIFEST_VERSION: i32 = 1;

pub fn load_manifest(path: &PathBuf) -> Result<Manifest, Box<dyn Error>> {
    let package_id = package_id(&path)?;

    if path.join("manifest.json").exists() {
        load_manifest_json(path)
    } else {
        Err(Box::<dyn Error>::from(format!(
            "No manifest found for add-on {}",
            package_id,
        )))
    }
}

fn load_manifest_json(path: &PathBuf) -> Result<Manifest, Box<dyn Error>> {
    let package_id = package_id(&path)?;

    let file = File::open(path.join("manifest.json"))
        .map_err(|_| format!("Failed to open manifest.json for add-on {}", package_id))?;
    let manifest: Manifest = serde_json::from_reader(file)
        .map_err(|_| format!("Failed to read manifest.json for add-on {}", package_id))?;

    check_mainfest_version(&manifest, package_id)?;
    check_manifest_id(&manifest, package_id)?;

    if !path.join(".git").exists() {
        // TODO: Check checksum
    }

    check_manifest_version_min(&manifest, package_id)?;
    check_manifest_version_max(&manifest, package_id)?;

    Ok(manifest)
}

pub fn package_id<'a>(path: &'a PathBuf) -> Result<&'a str, Box<dyn Error>> {
    Ok(path
        .file_name()
        .ok_or("Failed to obtain file name")?
        .to_str()
        .ok_or("Failed to convert file name to string")?)
}

fn check_mainfest_version(manifest: &Manifest, package_id: &str) -> Result<(), Box<dyn Error>> {
    if manifest.manifest_version != MANIFEST_VERSION {
        Err(Box::<dyn Error>::from(format!(
            "Manifest version {} for add-on ${} does not match expected version {}",
            manifest.manifest_version, package_id, MANIFEST_VERSION,
        )))
    } else {
        Ok(())
    }
}

fn check_manifest_id(manifest: &Manifest, package_id: &str) -> Result<(), Box<dyn Error>> {
    if manifest.id != package_id {
        Err(Box::<dyn Error>::from(format!(
            "ID from manifest \"{}\" doesn't match the ID from list \"{}\"",
            manifest.id, package_id,
        )))
    } else {
        Ok(())
    }
}

fn check_manifest_version_min(manifest: &Manifest, package_id: &str) -> Result<(), Box<dyn Error>> {
    let min = &(manifest
        .gateway_specific_settings
        .webthings
        .strict_min_version);
    if let Some(min) = min {
        if min != "*" && Version::parse(min)? > Version::parse(env!("CARGO_PKG_VERSION"))? {
            return Err(Box::<dyn Error>::from(format!(
                "Gateway version {} is lower than minimum version {} supported by add-on {}",
                env!("CARGO_PKG_VERSION"),
                min,
                package_id,
            )));
        }
    }
    Ok(())
}

fn check_manifest_version_max(manifest: &Manifest, package_id: &str) -> Result<(), Box<dyn Error>> {
    let max = &(manifest
        .gateway_specific_settings
        .webthings
        .strict_max_version);
    if let Some(max) = max {
        if max != "*" && Version::parse(max)? < Version::parse(env!("CARGO_PKG_VERSION"))? {
            return Err(Box::<dyn Error>::from(format!(
                "Gateway version {} is higher than maximum version {} supported by add-on {}",
                env!("CARGO_PKG_VERSION"),
                max,
                package_id,
            )));
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn test_manifest_version() {
        let mut manifest = Manifest::default();
        manifest.manifest_version = 0;
        assert!(check_mainfest_version(&manifest, "").is_err());
        manifest.manifest_version = 1;
        assert!(check_mainfest_version(&manifest, "").is_ok());
    }

    #[test]
    fn test_manifest_id() {
        let mut manifest = Manifest::default();
        manifest.id = "an-id".to_owned();
        assert!(check_manifest_id(&manifest, "another-id").is_err());
        assert!(check_manifest_id(&manifest, "an-id").is_ok());
    }

    #[test]
    fn test_manifest_version_min() {
        let mut manifest = Manifest::default();
        manifest
            .gateway_specific_settings
            .webthings
            .strict_min_version = None;
        assert!(check_manifest_version_min(&manifest, "").is_ok());
        manifest
            .gateway_specific_settings
            .webthings
            .strict_min_version = Some("*".to_owned());
        assert!(check_manifest_version_min(&manifest, "").is_ok());
        manifest
            .gateway_specific_settings
            .webthings
            .strict_min_version = Some("0.10.0".to_owned());
        assert!(check_manifest_version_min(&manifest, "").is_ok());
        manifest
            .gateway_specific_settings
            .webthings
            .strict_min_version = Some("5.0.0".to_owned());
        assert!(check_manifest_version_min(&manifest, "").is_err());
    }

    #[test]
    fn test_manifest_version_max() {
        let mut manifest = Manifest::default();
        manifest
            .gateway_specific_settings
            .webthings
            .strict_max_version = None;
        assert!(check_manifest_version_max(&manifest, "").is_ok());
        manifest
            .gateway_specific_settings
            .webthings
            .strict_max_version = Some("*".to_owned());
        assert!(check_manifest_version_max(&manifest, "").is_ok());
        manifest
            .gateway_specific_settings
            .webthings
            .strict_max_version = Some("0.10.0".to_owned());
        assert!(check_manifest_version_max(&manifest, "").is_err());
        manifest
            .gateway_specific_settings
            .webthings
            .strict_max_version = Some("5.0.0".to_owned());
        assert!(check_manifest_version_max(&manifest, "").is_ok());
    }
}
