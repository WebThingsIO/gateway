/*
 * WebThings Gateway Default Configuration.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const os = require('os');
const path = require('path');
const home = os.homedir();

module.exports = {
  // Expose CLI
  cli: true,

  profileDir: `${home}/.webthings`,

  ports: {
    https: 4443,
    http: 8080,
    ipc: 9500,
  },
  // Whether the gateway is behind port forwarding and should use simplified
  // port-free urls
  behindForwarding: true,
  addonManager: {
    listUrls: [
      'https://api.webthings.io:8443/addons',
    ],
    testAddons: false,
  },
  database: {
    removeBeforeOpen: false,
  },
  settings: {
    defaults: {
      mdns: {
        enabled: true,
        domain: os.hostname().split('.')[0],
      },
    },
  },
  ssltunnel: {
    enabled: true,
    registration_endpoint: 'https://api.webthings.io:8443',
    domain: 'webthings.io',
    pagekite_cmd: path.normalize(path.join(process.cwd(), 'pagekite.py')),
    port: 443,
    certemail: 'noreply@webthings.io',
  },
  bcryptRounds: 2,
  updateUrl: 'https://api.webthings.io:8443/releases',
  wifi: {
    ap: {
      ipaddr: '192.168.2.1',
      ssid_base: 'WebThings Gateway',
    },
  },
  oauthPostToken: false,
  oauthTestClients: false,
};
