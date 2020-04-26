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

const AddonUtils = require('./addon-utils');
const config = require('config');
const dynamicRequire = require('./dynamic-require');
const GetOpt = require('node-getopt');
const {PluginClient} = require('gateway-addon');
const db = require('./db');
const Settings = require('./models/settings');
const sleep = require('./sleep');
const path = require('path');
const {DONT_RESTART_EXIT_CODE} = require('gateway-addon').Constants;
const {spawnSync} = require('child_process');
const fs = require('fs');

// Open the database.
if (process.env.NODE_ENV !== 'test') {
  // In test mode, we have a flag set to remove the database when it's opened.
  // Therefore, we need to manually load settings and such, rather than using
  // the normal db functions, in order to prevent removing the already open
  // database.
  db.open();
}

async function loadAddon(addonPath, verbose) {
  const packageName = path.basename(addonPath);

  // Get any saved settings for this add-on.
  const key = `addons.${packageName}`;
  const configKey = `addons.config.${packageName}`;

  let obj, savedConfig;
  if (process.env.NODE_ENV === 'test') {
    [obj, savedConfig] = AddonUtils.loadManifest(addonPath.split('/').pop());
  } else {
    obj = await Settings.get(key);
  }

  const newSettings = {
    name: obj.id,
    display_name: obj.name,
    moziot: {
      exec: obj.exec,
    },
  };

  if (obj.schema) {
    newSettings.moziot.schema = obj.schema;
  }

  if (process.env.NODE_ENV !== 'test') {
    savedConfig = await Settings.get(configKey);
  }

  if (savedConfig) {
    newSettings.moziot.config = savedConfig;
  } else {
    newSettings.moziot.config = {};
  }

  const pluginClient = new PluginClient(
    packageName,
    {verbose}
  );

  return pluginClient.register(config.get('ports.ipc'))
    .catch((e) => {
      throw new Error(
        `Failed to register add-on ${packageName} with gateway: ${e}`
      );
    })
    .then((addonManagerProxy) => {
      console.log(`Loading add-on ${packageName} from ${addonPath}`);
      try {
        // we try to link to a global gateway-addon module, because in some
        // cases, NODE_PATH seems to not work
        const modulePath = path.join(
          addonPath,
          'node_modules',
          'gateway-addon'
        );
        if (!fs.existsSync(modulePath)) {
          const link = spawnSync(
            'npm',
            ['link', 'gateway-addon'],
            {
              cwd: addonPath,
            }
          );

          if (link.error) {
            console.log(`Failed to npm-link the gateway-addon package: ${link.error}`);
          }
        }

        const addonLoader = dynamicRequire(addonPath);
        addonLoader(addonManagerProxy, newSettings, (packageName, err) => {
          console.error(`Failed to start add-on ${packageName}:`, err);
          fail(
            addonManagerProxy,
            `Failed to start add-on ${obj.name}: ${err}`
          );
        });

        pluginClient.on('unloaded', () => {
          sleep(500).then(() => process.exit(0));
        });
      } catch (e) {
        console.error(e);
        const message = `Failed to start add-on ${obj.name}: ${
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
  process.exit(DONT_RESTART_EXIT_CODE);
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
  process.exit(DONT_RESTART_EXIT_CODE);
}

if (opt.argv.length != 1) {
  console.error('Expecting a single package to load');
  process.exit(DONT_RESTART_EXIT_CODE);
}
const addonPath = opt.argv[0];

loadAddon(addonPath, opt.options.verbose).catch((err) => {
  console.error(err);
  process.exit(DONT_RESTART_EXIT_CODE);
});
