/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const config = require('config');
const fs = require('fs');
const path = require('path');
const UserProfile = require('./user-profile');
const Utils = require('./utils');

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
 * Load an add-on manifest from a legacy package.json file.
 *
 * @param {string} packageName - The name of the package, e.g. example-adapter
 *
 * @returns {object[]} 2-value array containing a parsed manifest and a default
 *                     config object.
 */
function loadPackageJson(packageName) {
  const addonPath = path.join(UserProfile.addonsDir, packageName);

  // Read the package.json file.
  let data;
  try {
    data = fs.readFileSync(path.join(addonPath, 'package.json'));
  } catch (e) {
    throw new Error(
      `Failed to read package.json for add-on ${packageName}: ${e}`
    );
  }

  // Parse as JSON
  let manifest;
  try {
    manifest = JSON.parse(data);
  } catch (e) {
    throw new Error(
      `Failed to parse package.json for add-on: ${packageName}: ${e}`
    );
  }

  // Verify that the name in the package matches the packageName
  if (manifest.name != packageName) {
    const err = `Name from package.json "${manifest.name}" doesn't ` +
                `match the name from list.json "${packageName}"`;
    throw new Error(err);
  }

  // Verify the files list in the package.
  if (!manifest.hasOwnProperty('files') || manifest.files.length === 0) {
    throw new Error(`files property missing for add-on ${packageName}`);
  }

  // If the add-on is a git repository, skip checking the SHA256SUMS file.
  if (fs.existsSync(path.join(addonPath, '.git'))) {
    const sha256SumsIndex = manifest.files.indexOf('SHA256SUMS');
    if (sha256SumsIndex >= 0) {
      manifest.files.splice(sha256SumsIndex, 1);
      console.log(
        `Not checking SHA256SUMS file for ${packageName} since a .git`,
        'directory was detected'
      );
    }
  }

  // Verify that all files in the files list exist.
  for (let fname of manifest.files) {
    fname = path.join(addonPath, fname);
    if (!fs.existsSync(fname)) {
      throw new Error(`Add-on ${packageName} is missing file: ${fname}`);
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
            `Checksum failed in add-on ${packageName}: ${filename}`
          );
        }
      }
    } catch (e) {
      throw new Error(
        `Failed to read SHA256SUMS for add-on ${packageName}: ${e}`
      );
    }
  }

  // Verify that important fields exist in the manifest
  const err = validatePackageJson(manifest);
  if (err) {
    throw new Error(
      `Error found in manifest for add-on ${packageName}: ${err}`
    );
  }

  // Verify API version.
  const apiVersion = config.get('addonManager.api');
  if (manifest.moziot.api.min > apiVersion ||
      manifest.moziot.api.max < apiVersion) {
    const err = `API mismatch for add-on ${packageName}: Current: ${
      apiVersion} Supported: ${manifest.moziot.api.min}-${
      manifest.moziot.api.max}`;
    throw new Error(err);
  }

  const obj = {
    name: manifest.name,
    displayName: manifest.display_name,
    description: manifest.description,
    homepage: manifest.homepage,
    version: manifest.version,
    type: manifest.moziot.type || 'adapter',
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

  if (process.env.NODE_ENV === 'test' && manifest.moziot.enabled) {
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
 * @param {string} packageName - The name of the package, e.g. example-adapter
 *
 * @returns {object[]} 2-value array containing a parsed manifest and a default
 *                     config object.
 */
function loadManifestJson(_packageName) {
}

/**
 * Load the manifest for a given package.
 *
 * @returns {object[]} 2-value array containing a parsed manifest and a default
 *                     config object.
 */
function loadManifest(packageName) {
  const addonPath = path.join(UserProfile.addonsDir, packageName);

  if (fs.existsSync(path.join(addonPath, 'manifest.json'))) {
    return loadManifestJson(packageName);
  }

  if (fs.existsSync(path.join(addonPath, 'package.json'))) {
    console.warn(`manifest.json did not exist for add-on ${packageName}`);
    return loadPackageJson(packageName);
  }

  throw new Error(`No manifest found for add-on ${packageName}`);
}

module.exports = {
  loadManifest,
};
