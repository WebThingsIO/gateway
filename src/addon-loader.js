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
const {PluginClient} = require('gateway-addon');
const db = require('./db');
const Settings = require('./models/settings');
const sleep = require('./sleep');
const path = require('path');

// Open the database.
db.open();

async function loadAddon(addonPath, verbose) {
  const packageName = path.basename(addonPath);

  // Get any saved settings for this add-on.
  const key = `addons.${packageName}`;
  const configKey = `addons.config.${packageName}`;
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
  } else {
    newSettings.moziot.config = {};
  }

  const pluginClient = new PluginClient(
    packageName,
    config.get('ipc.protocol'),
    null,
    {verbose}
  );

  return pluginClient.register()
    .catch((e) => {
      throw new Error(
        `Failed to register add-on ${packageName} with gateway: ${e}`
      );
    })
    .then((addonManagerProxy) => {
      console.log(`Loading add-on ${packageName} from ${addonPath}`);
      try {
        const addonLoader = dynamicRequire(addonPath);
        addonLoader(addonManagerProxy, newSettings, (packageName, err) => {
          console.error(`Failed to start add-on ${packageName}:`, err);
          fail(
            addonManagerProxy,
            `Failed to start add-on ${obj.displayName}: ${err}`
          );
        });

        if (config.get('ipc.protocol') !== 'inproc') {
          pluginClient.on('unloaded', () => {
            sleep(500).then(() => process.exit(0));
          });
        }
      } catch (e) {
        console.error(e);
        const message = `Failed to start add-on ${obj.displayName}: ${
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
