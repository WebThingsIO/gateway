/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import find from 'find';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import UserProfile from './user-profile';
import * as Utils from './utils';
import pkg from './package.json';

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
 * @param {object} obj - Object to validate
 * @param {object} template - Template to validate against
 *
 * @returns {string|null} Error string, or null if no error.
 */
function validateObject(
  prefix: string,
  obj: Record<string, unknown>,
  template: Record<string, unknown>
): string | null {
  for (const key in template) {
    if (key in obj) {
      const objectVal = obj[key];
      const templateVal = template[key];

      if (typeof objectVal !== typeof templateVal) {
        // eslint-disable-next-line max-len
        return `Expecting ${prefix}${key} to have type: ${typeof templateVal}, found: ${typeof objectVal}`;
      }

      if (typeof objectVal === 'object') {
        if (Array.isArray(objectVal)) {
          if ((<unknown[]>templateVal).length > 0) {
            const expectedType = typeof (<unknown[]>templateVal)[0];
            for (const val of objectVal) {
              if (typeof val !== expectedType) {
                return `Expecting all values in ${prefix}${key} to be of type ${expectedType}`;
              }
            }
          }
        } else {
          const err = validateObject(
            `${prefix + key}.`,
            <Record<string, unknown>>objectVal,
            <Record<string, unknown>>templateVal
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

  return null;
}

/**
 * Verify that a manifest.json looks valid. We only need to validate fields
 * which we actually use.
 *
 * @param {object} manifest - The parsed manifest.json manifest
 *
 * @returns {string|null} Error string, or null if no error.
 */
function validateManifestJson(manifest: Record<string, unknown>): string | null {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const manifestTemplate: Record<string, any> = {
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

  // Since we're trying to use a field before full validation, make sure it
  // exists first.
  if (
    typeof manifest.gateway_specific_settings !== 'object' ||
    !manifest.gateway_specific_settings ||
    typeof (<Record<string, unknown>>manifest.gateway_specific_settings).webthings !== 'object' ||
    !(<Record<string, unknown>>manifest.gateway_specific_settings).webthings ||
    !(<Record<string, unknown>>(
      (<Record<string, unknown>>manifest.gateway_specific_settings).webthings
    )).primary_type
  ) {
    return (
      'Expecting manifest.gateway_specific_settings.webthings.primary_type to have type: ' +
      'string, found: undefined'
    );
  }

  if (
    (<Record<string, unknown>>(
      (<Record<string, unknown>>manifest.gateway_specific_settings).webthings
    )).primary_type !== 'extension'
  ) {
    // If we're not using in-process plugins, and this is not an extension,
    // then we also need the exec keyword to exist.
    manifestTemplate.gateway_specific_settings.webthings.exec = '';
  }

  return validateObject('', manifest, manifestTemplate);
}

/**
 * Load an add-on manifest from a manifest.json file.
 *
 * @param {string} packageId - The ID of the package, e.g. example-adapter
 *
 * @returns {object[]} 2-value array containing a parsed manifest and a default
 *                     config object.
 */
function loadManifestJson(packageId: string): [Record<string, unknown>, Record<string, unknown>] {
  const addonPath = path.join(UserProfile.addonsDir, packageId);

  // Read the package.json file.
  let data;
  try {
    data = fs.readFileSync(path.join(addonPath, 'manifest.json'), 'utf8');
  } catch (e) {
    throw new Error(`Failed to read manifest.json for add-on ${packageId}: ${e}`);
  }

  // Parse as JSON
  let manifest;
  try {
    manifest = JSON.parse(data);
  } catch (e) {
    throw new Error(`Failed to parse manifest.json for add-on: ${packageId}: ${e}`);
  }

  // First, verify manifest version.
  if (manifest.manifest_version !== MANIFEST_VERSION) {
    throw new Error(
      `Manifest version ${manifest.manifest_version} for add-on ${packageId} does not match ` +
        `expected version ${MANIFEST_VERSION}`
    );
  }

  // Verify that the id in the package matches the packageId
  if (manifest.id != packageId) {
    const err =
      `ID from manifest .json "${manifest.id}" doesn't ` +
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
            throw new Error(`File ${filename} missing for add-on ${packageId}`);
          }

          sums.set(filename, checksum);
        }
      } catch (e) {
        throw new Error(`Failed to read SHA256SUMS for add-on ${packageId}: ${e}`);
      }

      find.fileSync(addonPath).forEach((fname) => {
        fname = path.resolve(fname);

        if (fname === sumsFile) {
          return;
        }

        if (!sums.has(fname)) {
          if (ENFORCE_STRICT_SHA_CHECK) {
            throw new Error(`No checksum found for file ${fname} in add-on ${packageId}`);
          } else {
            return;
          }
        }

        if (Utils.hashFile(fname) !== sums.get(fname)) {
          throw new Error(`Checksum failed for file ${fname} in add-on ${packageId}`);
        }
      });
    } else if (process.env.NODE_ENV !== 'test') {
      throw new Error(`SHA256SUMS file missing for add-on ${packageId}`);
    }
  }

  // Verify that important fields exist in the manifest
  const err = validateManifestJson(manifest);
  if (err) {
    throw new Error(`Error found in manifest for add-on ${packageId}: ${err}`);
  }

  // Verify gateway version.
  let min = manifest.gateway_specific_settings.webthings.strict_min_version;
  let max = manifest.gateway_specific_settings.webthings.strict_max_version;

  const gatewayVersion = semver.coerce(pkg.version, { includePrerelease: true });
  if (gatewayVersion === null) {
    throw new Error(`Unable to compare with non-semver gateway version ${pkg.version}`);
  }

  if (typeof min === 'string' && min !== '*') {
    min = semver.coerce(min, { includePrerelease: true });
    if (semver.lt(gatewayVersion, min)) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Gateway version ${gatewayVersion} is lower than minimum version ${min} supported by add-on ${packageId}`
      );
    }
  }
  if (typeof max === 'string' && max !== '*') {
    max = semver.coerce(max, { includePrerelease: true });
    if (semver.gt(gatewayVersion, max)) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Gateway version ${gatewayVersion} is higher than maximum version ${max} supported by add-on ${packageId}`
      );
    }
  }

  const obj: Record<string, unknown> = {
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

  let cfg: Record<string, unknown> = {};
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

  return [obj, cfg];
}

/**
 * Load the manifest for a given package.
 *
 * @param {string} packageId - The ID of the package, e.g. example-adapter
 *
 * @returns {object[]} 2-value array containing a parsed manifest and a default
 *                     config object.
 */
export function loadManifest(
  packageId: string
): [Record<string, unknown>, Record<string, unknown>] {
  const addonPath = path.join(UserProfile.addonsDir, packageId);

  if (fs.existsSync(path.join(addonPath, 'manifest.json'))) {
    return loadManifestJson(packageId);
  }

  throw new Error(`No manifest found for add-on ${packageId}`);
}
