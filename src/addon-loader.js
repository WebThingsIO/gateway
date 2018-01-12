/*
 * Add-on Loader app.
 *
 * This app will load an add-on as a standalone process.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var config = require('config');
const Constants = require('./constants');
const GetOpt = require('node-getopt');
const PluginClient = require('./addons/plugin/plugin-client');
const db = require('./db');
const Settings = require('./models/settings');
const fs = require('fs');
const path = require('path');

// Open the database.
db.open();

async function loadAddon(addonPath, verbose) {

  // Skip if there's no package.json file.
  const packageJson = path.join(addonPath, 'package.json');
  if (!fs.lstatSync(packageJson).isFile()) {
    const err = `package.json not found: ${packageJson}`;
    return Promise.reject(err);
  }

  // Read the package.json file.
  let data;
  try {
    data = fs.readFileSync(packageJson);
  } catch (e) {
    const err =
      `Failed to read package.json: ${packageJson}\n${e}`;
    return Promise.reject(err);
  }

  let manifest;
  try {
    manifest = JSON.parse(data);
  } catch (e) {
    const err =
      `Failed to parse package.json: ${packageJson}\n${e}`;
    return Promise.reject(err);
  }
  let packageName = manifest.name;

  // Verify API version.
  const apiVersion = config.get('addonManager.api');
  if (manifest.moziot.api.min > apiVersion ||
      manifest.moziot.api.max < apiVersion) {
    return Promise.reject(
      `API mismatch for package: ${manifest.name}\n` +
      `Current: ${apiVersion} ` +
      `Supported: ${manifest.moziot.api.min}-${manifest.moziot.api.max}`);
  }

  // Get any saved settings for this add-on.
  const key = `addons.${manifest.name}`;
  let savedSettings = await Settings.get(key);
  let newSettings = Object.assign({}, manifest);
  if (savedSettings) {
    // Overwrite config values.
    newSettings.moziot.config = Object.assign(manifest.moziot.config || {},
                                              savedSettings.moziot.config);
  } else {
    if (!newSettings.moziot.hasOwnProperty('config')) {
      newSettings.moziot.config = {};
    }
  }

  var pluginClient = new PluginClient(packageName, {verbose: verbose});
  return new Promise((resolve, reject) => {
    pluginClient.register().then(addonManagerProxy => {
      console.log('Loading add-on for', manifest.name,
                  'from', addonPath);
      let addonLoader = dynamicRequire(addonPath);
      addonLoader(addonManagerProxy, newSettings, (packageName, errorStr) => {
        console.error('Failed to load', packageName, '-', errorStr);
        addonManagerProxy.unloadPlugin();
        process.exit(Constants.DONT_RESTART_EXIT_CODE);
      });
      resolve();
    }).catch(e => {
      console.error(e);
      const err =
        `Failed to register package: ${manifest.name} with gateway`;
      reject(err);
    });
  });
}

// Use webpack provided require for dynamic includes from the bundle  .
const dynamicRequire = (() => {
  if (typeof __non_webpack_require__ !== 'undefined') {
    // eslint-disable-next-line no-undef
    return __non_webpack_require__;
  }
  return require;
})();

// Get some decent error messages for unhandled rejections. This is
// often just errors in the code.
process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection');
  console.error(reason);
});

// Command line arguments
const getopt = new GetOpt([
  ['h', 'help', 'Display help' ],
  ['v', 'verbose', 'Show verbose output'],
]);

const opt = getopt.parseSystem();

if (opt.options.verbose) {
  console.log(opt);
}

if (opt.options.help) {
  getopt.showHelp();
  process.exit(Constants.DONT_RESTART_EXIT_CODE);
}

if (opt.argv.length != 1) {
  console.error('Expecting a single package to load');
  process.exit(Constants.DONT_RESTART_EXIT_CODE);
}
var addonPath = opt.argv[0];

loadAddon(addonPath, opt.verbose).catch(err => {
  console.error(err);
  process.exit(Constants.DONT_RESTART_EXIT_CODE);
});
