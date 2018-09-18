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

const config = require('config');
const Constants = require('./constants');
const GetOpt = require('node-getopt');
const PluginClient = require('./plugin/plugin-client');
const db = require('./db');
const Settings = require('./models/settings');
const fs = require('fs');
const path = require('path');

// Open the database.
db.open();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  const packageName = manifest.name;

  const pluginClient = new PluginClient(packageName, {verbose: verbose});

  let addonManagerProxy;
  const pluginClientPromise = pluginClient.register().then((proxy) => {
    addonManagerProxy = proxy;
  }).catch((e) => {
    console.error(e);
    const err = `Failed to register package: ${manifest.name} with gateway`;
    return Promise.reject(err);
  });

  const fail = (message) => {
    return pluginClientPromise.then(() => {
      addonManagerProxy.sendError(message);
      return sleep(200);
    }).then(() => {
      addonManagerProxy.unloadPlugin();
      return sleep(200);
    }).then(() => {
      process.exit(Constants.DONT_RESTART_EXIT_CODE);
    });
  };

  // Verify API version.
  const apiVersion = config.get('addonManager.api');
  if (manifest.moziot.api.min > apiVersion ||
      manifest.moziot.api.max < apiVersion) {
    console.error(
      `API mismatch for package: ${manifest.name}\n` +
      `Current: ${apiVersion} ` +
      `Supported: ${manifest.moziot.api.min}-${manifest.moziot.api.max}`);

    const message =
      `Failed to start ${manifest.display_name} add-on: API version mismatch`;
    return fail(message);
  }

  // Get any saved settings for this add-on.
  const key = `addons.${manifest.name}`;
  const savedSettings = await Settings.get(key);
  const newSettings = Object.assign({}, manifest);
  if (savedSettings) {
    // Overwrite config values.
    newSettings.moziot.config = Object.assign(manifest.moziot.config || {},
                                              savedSettings.moziot.config);
  } else if (!newSettings.moziot.hasOwnProperty('config')) {
    newSettings.moziot.config = {};
  }

  return pluginClientPromise.then(() => {
    console.log('Loading add-on for', manifest.name, 'from', addonPath);

    let addonLoader;
    try {
      addonLoader = dynamicRequire(addonPath);
      addonLoader(addonManagerProxy, newSettings, (packageName, errorStr) => {
        console.error('Failed to load', packageName, '-', errorStr);
        const message =
          `Failed to start ${manifest.display_name} add-on: ${errorStr}`;
        fail(message);
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
      return fail(message);
    }
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
const addonPath = opt.argv[0];

loadAddon(addonPath, opt.verbose).catch((err) => {
  console.error(err);
  process.exit(Constants.DONT_RESTART_EXIT_CODE);
});
