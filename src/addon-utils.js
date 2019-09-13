/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const config = require('config');
const find = require('find');
const fs = require('fs');
const pkg = require('../package.json');
const path = require('path');
const semver = require('semver');
const UserProfile = require('./user-profile');
const Utils = require('./utils');

const API_VERSION = 2;
const MANIFEST_VERSION = 1;

// Setting this flag will force every file present in an add-on's directory to
// have a checksum in the SHA256SUMS file. However, several add-ons currently
// write files directly into their directories. When we resolve all of those
// issues, this flag can be flipped.
const ENFORCE_STRICT_SHA_CHECK = false;

/**
 * Verify one level of an object, recursing as required.
 *
 * @param {string} prefix - Prefix to use for keys, e.g. level1.level2.
 * @param {object} object - Object to validate
 * @param {object} template - Template to validate against
 *
 * @returns {string?} Error string, or undefined if no error.
 */
function validateObject(prefix, object, template) {
  for (const key in template) {
    if (key in object) {
      const objectVal = object[key];
      const templateVal = template[key];

      if (typeof objectVal !== typeof templateVal) {
        return `Expecting ${prefix}${key} to have type: ${
          typeof templateVal}, found: ${typeof objectVal}`;
      }

      if (typeof objectVal === 'object') {
        if (Array.isArray(objectVal)) {
          if (templateVal.length > 0) {
            const expectedType = typeof templateVal[0];
            for (const val of objectVal) {
              if (typeof val !== expectedType) {
                return `Expecting all values in ${prefix}${key} to be of ` +
                  `type ${expectedType}`;
              }
            }
          }
        } else {
          const err = validateObject(
            `${prefix + key}.`,
            objectVal,
            templateVal
          );
          if (err) {
            return err;
          }
        }
      }
    } else {
      return `Manifest is missing: ${prefix}${key}`;
    }
  }
}

/**
 * Verify that a package.json looks valid. We only need to validate fields
 * which we actually use.
 *
 * @param {object} manifest - The parsed package.json manifest
 *
 * @returns {string?} Error string, or undefined if no error.
 */
function validatePackageJson(manifest) {
  const manifestTemplate = {
    name: '',
    display_name: '',
    description: '',
    version: '',
    files: [''],
    moziot: {
      api: {
        min: 0,
        max: 0,
      },
    },
  };

  if (config.get('ipc.protocol') !== 'inproc') {
    // If we're not using in-process plugins, then we also need the exec
    // keyword to exist.
    manifestTemplate.moziot.exec = '';
  }

  return validateObject('', manifest, manifestTemplate);
}

/**
 * Verify that a manifest.json looks valid. We only need to validate fields
 * which we actually use.
 *
 * @param {object} manifest - The parsed manifest.json manifest
 *
 * @returns {string?} Error string, or undefined if no error.
 */
function validateManifestJson(manifest) {
  const manifestTemplate = {
    author: '',
    description: '',
    gateway_specific_settings: {
      webthings: {
        primary_type: '',
      },
    },
    homepage_url: '',
    id: '',
    license: '',
    manifest_version: 0,
    name: '',
    version: '',
  };

  if (config.get('ipc.protocol') !== 'inproc' &&
      // eslint-disable-next-line max-len
      manifest.gateway_specific_settings.webthings.primary_type !== 'extension') {
    // If we're not using in-process plugins, and this is not an extension,
    // then we also need the exec keyword to exist.
    manifestTemplate.gateway_specific_settings.webthings.exec = '';
  }

  return validateObject('', manifest, manifestTemplate);
}

/**
 * Load an add-on manifest from a legacy package.json file.
 *
 * @param {string} packageId - The ID of the package, e.g. example-adapter
 *
 * @returns {object[]} 2-value array containing a parsed manifest and a default
 *                     config object.
 */
function loadPackageJson(packageId) {
  const addonPath = path.join(UserProfile.addonsDir, packageId);

  // Read the package.json file.
  let data;
  try {
    data = fs.readFileSync(path.join(addonPath, 'package.json'));
  } catch (e) {
    throw new Error(
      `Failed to read package.json for add-on ${packageId}: ${e}`
    );
  }

  // Parse as JSON
  let manifest;
  try {
    manifest = JSON.parse(data);
  } catch (e) {
    throw new Error(
      `Failed to parse package.json for add-on: ${packageId}: ${e}`
    );
  }

  // Verify that the name in the package matches the packageId
  if (manifest.name != packageId) {
    const err = `Name from package.json "${manifest.name}" doesn't ` +
                `match the ID from list.json "${packageId}"`;
    throw new Error(err);
  }

  // Verify the files list in the package.
  if (!manifest.hasOwnProperty('files') || manifest.files.length === 0) {
    throw new Error(`files property missing for add-on ${packageId}`);
  }

  // If the add-on is a git repository, skip checking the SHA256SUMS file.
  if (fs.existsSync(path.join(addonPath, '.git'))) {
    const sha256SumsIndex = manifest.files.indexOf('SHA256SUMS');
    if (sha256SumsIndex >= 0) {
      manifest.files.splice(sha256SumsIndex, 1);
      console.log(
        `Not checking SHA256SUMS file for ${packageId} since a .git`,
        'directory was detected'
      );
    }
  }

  // Verify that all files in the files list exist.
  for (let fname of manifest.files) {
    fname = path.join(addonPath, fname);
    if (!fs.existsSync(fname)) {
      throw new Error(`Add-on ${packageId} is missing file: ${fname}`);
    }
  }

  // If a SHA256SUMS file is present, verify it. This file is of the format:
  // <checksum> <filename>
  //
  // To generate a file of this type, you can use:
  //   `rm -f SHA256SUMS && sha256sum file1 file2 ... > SHA256SUMS`
  // To verify, use:
  //   `sha256sum --check SHA256SUMS`
  if (manifest.files.includes('SHA256SUMS')) {
    const sumsFile = path.join(addonPath, 'SHA256SUMS');
    try {
      const data = fs.readFileSync(sumsFile, 'utf8');
      const lines = data.trim().split(/\r?\n/);
      for (const line of lines) {
        const checksum = line.slice(0, 64);
        let filename = line.slice(64).trimLeft();

        if (filename.startsWith('*')) {
          filename = filename.substring(1);
        }

        if (Utils.hashFile(path.join(addonPath, filename)) !== checksum) {
          throw new Error(
            `Checksum failed in add-on ${packageId}: ${filename}`
          );
        }
      }
    } catch (e) {
      throw new Error(
        `Failed to read SHA256SUMS for add-on ${packageId}: ${e}`
      );
    }
  }

  // Verify that important fields exist in the manifest
  const err = validatePackageJson(manifest);
  if (err) {
    throw new Error(
      `Error found in manifest for add-on ${packageId}: ${err}`
    );
  }

  // Verify API version.
  if (manifest.moziot.api.min > API_VERSION ||
      manifest.moziot.api.max < API_VERSION) {
    const err = `API mismatch for add-on ${packageId}: Current: ${
      API_VERSION} Supported: ${manifest.moziot.api.min}-${
      manifest.moziot.api.max}`;
    throw new Error(err);
  }

  const obj = {
    id: manifest.name,
    name: manifest.display_name,
    description: manifest.description,
    homepage_url: manifest.homepage,
    version: manifest.version,
    primary_type: manifest.moziot.type || 'adapter',
    exec: manifest.moziot.exec,
    enabled: false,
  };

  if (typeof manifest.author === 'object') {
    obj.author = manifest.author.name;
  } else if (typeof manifest.author === 'string') {
    obj.author = manifest.author.split('<')[0].trim();
  }

  if (manifest.moziot.hasOwnProperty('schema')) {
    obj.schema = manifest.moziot.schema;
  }

  if (manifest.moziot.enabled) {
    obj.enabled = true;
  }

  return [
    obj,
    manifest.moziot.config || {},
  ];
}

/**
 * Load an add-on manifest from a manifest.json file.
 *
 * @param {string} packageId - The ID of the package, e.g. example-adapter
 *
 * @returns {object[]} 2-value array containing a parsed manifest and a default
 *                     config object.
 */
function loadManifestJson(packageId) {
  const addonPath = path.join(UserProfile.addonsDir, packageId);

  // Read the package.json file.
  let data;
  try {
    data = fs.readFileSync(path.join(addonPath, 'manifest.json'));
  } catch (e) {
    throw new Error(
      `Failed to read manifest.json for add-on ${packageId}: ${e}`
    );
  }

  // Parse as JSON
  let manifest;
  try {
    manifest = JSON.parse(data);
  } catch (e) {
    throw new Error(
      `Failed to parse manifest.json for add-on: ${packageId}: ${e}`
    );
  }

  // First, verify manifest version.
  if (manifest.manifest_version !== MANIFEST_VERSION) {
    throw new Error(
      `Manifest version ${manifest.manifest_version} for add-on ${packageId
      } does not match expected version ${MANIFEST_VERSION}`
    );
  }

  // Verify that the id in the package matches the packageId
  if (manifest.id != packageId) {
    const err = `ID from manifest .json "${manifest.id}" doesn't ` +
                `match the ID from list.json "${packageId}"`;
    throw new Error(err);
  }

  // If the add-on is not a git repository, check the SHA256SUMS file.
  if (!fs.existsSync(path.join(addonPath, '.git'))) {
    const sumsFile = path.resolve(path.join(addonPath, 'SHA256SUMS'));

    if (fs.existsSync(sumsFile)) {
      const sums = new Map();

      try {
        const data = fs.readFileSync(sumsFile, 'utf8');
        const lines = data.trim().split(/\r?\n/);
        for (const line of lines) {
          const checksum = line.slice(0, 64);
          let filename = line.slice(64).trimLeft();

          if (filename.startsWith('*')) {
            filename = filename.substring(1);
          }

          filename = path.resolve(path.join(addonPath, filename));
          if (!fs.existsSync(filename)) {
            throw new Error(
              `File ${filename} missing for add-on ${packageId}`
            );
          }

          sums.set(filename, checksum);
        }
      } catch (e) {
        throw new Error(
          `Failed to read SHA256SUMS for add-on ${packageId}: ${e}`
        );
      }

      find.fileSync(addonPath).forEach((fname) => {
        fname = path.resolve(fname);

        if (fname === sumsFile) {
          return;
        }

        if (!sums.has(fname)) {
          if (ENFORCE_STRICT_SHA_CHECK) {
            throw new Error(
              `No checksum found for file ${fname} in add-on ${packageId}`
            );
          } else {
            return;
          }
        }

        if (Utils.hashFile(fname) !== sums.get(fname)) {
          throw new Error(
            `Checksum failed for file ${fname} in add-on ${packageId}`
          );
        }
      });
    } else if (process.env.NODE_ENV !== 'test') {
      throw new Error(`SHA256SUMS file missing for add-on ${packageId}`);
    }
  }

  // Verify that important fields exist in the manifest
  const err = validateManifestJson(manifest);
  if (err) {
    throw new Error(
      `Error found in manifest for add-on ${packageId}: ${err}`
    );
  }

  // Verify gateway version.
  let min = manifest.gateway_specific_settings.webthings.strict_min_version;
  let max = manifest.gateway_specific_settings.webthings.strict_max_version;

  if (typeof min === 'string' && min !== '*') {
    min = semver.coerce(min);
    if (semver.lt(pkg.version, min)) {
      throw new Error(
        `Gateway version ${pkg.version} is lower than minimum version ${min
        } supported by add-on ${packageId}`
      );
    }
  }
  if (typeof max === 'string' && max !== '*') {
    max = semver.coerce(max);
    if (semver.gt(pkg.version, max)) {
      throw new Error(
        `Gateway version ${pkg.version} is higher than maximum version ${max
        } supported by add-on ${packageId}`
      );
    }
  }

  const obj = {
    id: manifest.id,
    author: manifest.author,
    name: manifest.name,
    description: manifest.description,
    homepage_url: manifest.homepage_url,
    version: manifest.version,
    primary_type: manifest.gateway_specific_settings.webthings.primary_type,
    exec: manifest.gateway_specific_settings.webthings.exec,
    content_scripts: manifest.content_scripts,
    web_accessible_resources: manifest.web_accessible_resources,
    enabled: false,
  };

  let cfg = {};
  if (manifest.hasOwnProperty('options')) {
    if (manifest.options.hasOwnProperty('default')) {
      cfg = manifest.options.default;
    }

    if (manifest.options.hasOwnProperty('schema')) {
      obj.schema = manifest.options.schema;
    }
  }

  if (manifest.gateway_specific_settings.webthings.enabled) {
    obj.enabled = true;
  }

  return [
    obj,
    cfg,
  ];
}

/**
 * Load the manifest for a given package.
 *
 * @param {string} packageId - The ID of the package, e.g. example-adapter
 *
 * @returns {object[]} 2-value array containing a parsed manifest and a default
 *                     config object.
 */
function loadManifest(packageId) {
  const addonPath = path.join(UserProfile.addonsDir, packageId);

  if (fs.existsSync(path.join(addonPath, 'manifest.json'))) {
    return loadManifestJson(packageId);
  }

  if (fs.existsSync(path.join(addonPath, 'package.json'))) {
    console.warn(`manifest.json did not exist for add-on ${packageId}`);
    return loadPackageJson(packageId);
  }

  throw new Error(`No manifest found for add-on ${packageId}`);
}

module.exports = {
  loadManifest,
};
