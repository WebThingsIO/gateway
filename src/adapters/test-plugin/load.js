/**
 * @module PluginLoader
 *
 * Loads a plugin and sets up the AdapterManagerProxy
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const PluginClient = require('../plugin/plugin-client');
const adapterId = 'test-plugin';

var pluginClient = new PluginClient(adapterId, {verbose: false});
pluginClient.register().then(adapterManager => {

  var adapterLoader = require('./index');
  console.log('Loading adapter', adapterId);
  adapterLoader(adapterManager);

}).catch(err => {
  console.error('Failed to register adapter with gateway');
  console.error(err);
});
