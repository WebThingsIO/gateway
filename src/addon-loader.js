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

const UserProfile = require('./user-profile');
UserProfile.init();

const config = require('config');
const Constants = require('./constants');
const dynamicRequire = require('./dynamic-require');
const GetOpt = require('node-getopt');
const PluginClient = require('./plugin/plugin-client');
const db = require('./db');
const Settings = require('./models/settings');
const sleep = require('./sleep');
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

  // Verify API version.
  const apiVersion = config.get('addonManager.api');
  if (manifest.moziot.api.min > apiVersion ||
      manifest.moziot.api.max < apiVersion) {
    console.error(
      `API mismatch for package: ${manifest.name}\n` +
      `Current: ${apiVersion} ` +
      `Supported: ${manifest.moziot.api.min}-${manifest.moziot.api.max}`);

    const err =
      `Failed to start ${manifest.display_name} add-on: API version mismatch`;
    return Promise.reject(err);
  }

  // Get any saved settings for this add-on.
  const key = `addons.${manifest.name}`;
  const configKey = `addons.config.${manifest.name}`;
  const obj = await Settings.get(key);

  const newSettings = {
    name: obj.name,
    display_name: obj.displayName,
    moziot: {
      exec: obj.exec,
    },
  };

  if (obj.schema) {
    newSettings.moziot.schema = obj.schema;
  }

  const savedConfig = await Settings.get(configKey);
  if (savedConfig) {
    newSettings.moziot.config = savedConfig;
  }

  const pluginClient = new PluginClient(manifest.name, {verbose});

  return pluginClient.register()
    .catch((e) => {
      console.error(e);
      const err = `Failed to register package: ${manifest.name} with gateway`;
      return Promise.reject(err);
    })
    .then((addonManagerProxy) => {
      console.log('Loading add-on for', manifest.name, 'from', addonPath);
      try {
        const addonLoader = dynamicRequire(addonPath);
        addonLoader(addonManagerProxy, newSettings, (packageName, errorStr) => {
          console.error('Failed to load', packageName, '-', errorStr);
          const message =
          `Failed to start ${manifest.display_name} add-on: ${errorStr}`;
          fail(addonManagerProxy, message);
        });

        if (config.get('ipc.protocol') !== 'inproc') {
          pluginClient.on('unloaded', () => {
            sleep(500).then(() => process.exit(0));
          });
        }
      } catch (e) {
        console.error(e);
        const message =
        `Failed to start ${manifest.display_name} add-on: ${
          e.toString().replace(/^Error:\s+/, '')}`;
        fail(addonManagerProxy, message);
      }
    });
}

async function fail(addonManagerProxy, message) {
  addonManagerProxy.sendError(message);
  await sleep(200);
  addonManagerProxy.unloadPlugin();
  await sleep(200);
  process.exit(Constants.DONT_RESTART_EXIT_CODE);
}

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
const addonPath = opt.argv[0];

loadAddon(addonPath, opt.options.verbose).catch((err) => {
  console.error(err);
  process.exit(Constants.DONT_RESTART_EXIT_CODE);
});
