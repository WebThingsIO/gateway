/*
 * Adapter Plugin Loader app.
 *
 * This app will load an adapter plugin as a standalone process.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var config = require('config');
const GetOpt = require('node-getopt');
const PluginClient = require('./adapters/plugin/plugin-client');
const fs = require('fs');
const path = require('path');

function loadAdapter(adapterId, verbose) {
  const adapterPath = path.join(__dirname,
                                config.get('adapterManager.path'),
                                adapterId);

  // Skip if there's no package.json file.
  const packageJson = path.join(adapterPath, 'package.json');
  if (!fs.lstatSync(packageJson).isFile()) {
    console.error('package.json not found for adapter:', adapterId);
    return false;
  }

  // Read the package.json file.
  let data;
  try {
    data = fs.readFileSync(packageJson);
  } catch (err) {
    console.error('Failed to read package.json for adapter:', adapterId);
    console.error(err);
    return false;
  }

  let manifest;
  try {
    manifest = JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse package.json for adapter:', adapterId);
    console.error(err);
    return false;
  }

  // Verify API version.
  const apiVersion = config.get('adapterManager.api');
  if (manifest.moziot.api.min > apiVersion ||
      manifest.moziot.api.max < apiVersion) {
    console.error('API mismatch for adapter:', manifest.name);
    console.error('Current:', apiVersion, 'Supported:',
                  manifest.moziot.api.min, '-', manifest.moziot.api.max);
    return false;
  }
  let newSettings = Object.assign({}, manifest);
  if (!newSettings.moziot.hasOwnProperty('config')) {
    newSettings.moziot.config = {};
  }

  const errorCallback = function(packageName, errorStr) {
    console.log('Failed to load', packageName, '-', errorStr);
  };

  var pluginClient = new PluginClient(adapterId, {verbose: verbose});
  pluginClient.register().then(adapterManagerProxy => {
    console.log('Loading adapter for', manifest.name,
                'from', adapterPath);
    let adapterLoader = dynamicRequire(adapterPath);
    adapterLoader(adapterManagerProxy, newSettings, errorCallback);
  }).catch(err => {
    console.error('Failed to register adapter with gateway');
    console.error(err);
    return false;
  });

  return true;
}

// Use webpack provided require for dynamic includes from the bundle  .
const dynamicRequire = (() => {
  if (typeof __non_webpack_require__ !== 'undefined') {
    // eslint-disable-next-line no-undef
    return __non_webpack_require__;
  }
  return require;
})();

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
  process.exit(1);
}

if (opt.argv.length != 1) {
  console.error('Expecting a single adapterId to load');
  process.exit(1);
}
var adapterId = opt.argv[0];
if (!loadAdapter(adapterId, opt.verbose)) {
  process.exit(1);
}
