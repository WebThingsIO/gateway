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
var SsdpClient = require('node-ssdp').Client;

var bridgeAdapters = {};

/**
 * Search for bridges using local SSDP
 * @return {Promise}
 */
function ssdpSearch(adapterManager) {
  var client = new SsdpClient();
  client.on('response', (headers, statusCode, rinfo) => {
    var bridgeId = headers['HUE-BRIDGEID'];
    if (!bridgeId) {
      return;
    }
    // Normalize bridge id
    bridgeId = bridgeId.toLowerCase();
    var bridgeIp = rinfo.address;
    if (bridgeAdapters[bridgeId]) {
      return;
    }
    bridgeAdapters[bridgeId] = new PhilipsHueAdapter(adapterManager, bridgeId,
      bridgeIp);
  });

  return client.start().then(() => {
    client.search('ssdp:all');
  });
}

/**
 * Search for bridges using Philips's N-UPnP web API
 * @return {Promise}
 */
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
      // Normalize bridge id
      bridge.id = bridge.id.toLowerCase();
      if (bridgeAdapters[bridge.id]) {
        // TODO(hobinjk): update existing adapter's IP address if it has changed
        continue;
      }
      bridgeAdapters[bridge.id] = new PhilipsHueAdapter(adapterManager,
        bridge.id, bridge.internalipaddress);
    }
  });
}

/**
 * Perform both searches concurrently
 */
function loadPhilipsHueAdapters(adapterManager) {
  ssdpSearch(adapterManager);
  discoverBridges(adapterManager);
}

module.exports = loadPhilipsHueAdapters;
