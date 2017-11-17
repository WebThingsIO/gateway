/*
 * Things Gateway Default Configuration.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

module.exports = {
  // Expose CLI
  cli: true,

  ports: {
    https: 4443,
    http: 8080
  },
  // Whether the gateway is behind port forwarding and should use simplified
  // port-free urls
  behindForwarding: true,
  addonManager: {
    pairingTimeout: 3 * 60,   // seconds
    path: './addons',
    api: 1
  },
  database: {
    filename: './db.sqlite3',
    removeBeforeOpen: false,
  },
  ipc: {
    protocol: 'ipc',
  },
  settings: {
    defaults: {
      experiments: {
        floorplan: {
          enabled: true,
        },
        rules: {
          enabled: true,
        },
      },
    },
  },
  uploads: {
    directory: '../static/uploads/' // Directory to store uploads in
  },
  authentication: {
    defaultUser: null,
  },
  ssltunnel: {
    enabled: true,
    registration_endpoint: 'https://api.mozilla-iot.org:8443',
    domain: 'mozilla-iot.org',
    pagekite_cmd: './pagekite.py',
    port: 443,
    certemail: 'certificate@mozilla-iot.org'
  },
  bcryptRounds: 2
};
