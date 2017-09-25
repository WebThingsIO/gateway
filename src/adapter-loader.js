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
  ['d', 'debug', 'Enable debug features'],
  ['p', 'port=PORT', 'Specify the server port to use'],
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
var adapterConfig = config.get('adapters.' + adapterId);
if (!adapterConfig) {
  console.error('No configuration for adapter "' + adapterId + '"');
  process.exit(1);
}
if (!adapterConfig.enabled) {
  console.error('Adapter "' + adapterId + '" is disabled.');
  process.exit(1);
}
if (!adapterConfig.plugin) {
  console.error('Adapter "' + adapterId + '" isn\'t configured as a plugin.');
  process.exit(1);
}

var pluginClient = new PluginClient(adapterId, {verbose: opt.verbose});
pluginClient.register().then(adapterManagerProxy => {
  console.log('Loading adapters for', adapterId,
              'from', adapterConfig.path);
  let adapterLoader = dynamicRequire(adapterConfig.path);
  adapterLoader(adapterManagerProxy, adapterId, adapterConfig);
}).catch(err => {
  console.error('Failed to register adapter with gateway');
  console.error(err);
});
