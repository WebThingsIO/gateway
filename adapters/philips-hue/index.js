/**
 * index.js - Loads the Philips Hue bridge API adapter.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var PhilipsHueAdapter = require('./philips-hue-adapter');
var rp = require('request-promise-native');

var bridgeAdapters = {};

function discoverBridges(adapterManager) {
  return rp({
    uri: 'https://www.meethue.com/api/nupnp',
    json: true
  }).then(bridges => {
    if (!bridges) {
      return Promise.reject('philips-hue: no bridges found');
    }
    // TODO(hobinjk): remove adapters whose bridges are offline
    for (var bridge of bridges) {
      if (bridgeAdapters[bridge.id]) {
        // TODO(hobinjk): update existing adapter's IP address if it has changed
        continue;
      }
      bridgeAdapters[bridge.id] = new PhilipsHueAdapter(adapterManager, bridge);
    }
  });
}

function loadPhilipsHueAdapters(adapterManager) {
  discoverBridges(adapterManager);
}
module.exports = loadPhilipsHueAdapters;
