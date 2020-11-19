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
  // Base profile directory
  profileDir: `${home}/.webthings`,

  ports: {
    // HTTPS port
    https: 4443,

    // HTTP port
    http: 8080,

    // IPC port -- changing this will likely break all add-ons
    ipc: 9500,
  },

  // Whether the gateway is behind port forwarding and should use simplified
  // port-free urls
  behindForwarding: true,

  addonManager: {
    // URLs of add-on lists to parse, in order
    listUrls: [
      'https://api.webthings.io:8443/addons',
    ],

    // Whether or not to allow installation of test-only add-ons
    testAddons: false,
  },

  database: {
    // Remove the database before opening. Only useful for testing.
    removeBeforeOpen: false,
  },

  settings: {
    defaults: {
      mdns: {
        // Whether or not to enable mDNS advertisements
        enabled: true,

        // Domain to advertise via mDNS
        domain: os.hostname().split('.')[0],
      },
    },
  },

  ssltunnel: {
    // Whether or not to enable the PageKite tunnel (if set up)
    enabled: true,

    // Endpoint of the PageKite server
    registration_endpoint: 'https://api.webthings.io:8443',

    // Base domain
    domain: 'webthings.io',

    // Command to run PageKite
    pagekite_cmd: path.normalize(path.join(process.cwd(), 'pagekite.py')),

    // Port the PageKite server is running on
    port: 443,

    // Email address to use during certificate generation
    certemail: 'noreply@webthings.io',
  },

  updates: {
    // URL of update server
    url: 'https://api.webthings.io:8443/releases',

    // Whether or not to allow prerelease updates
    allowPrerelease: false,
  },

  wifi: {
    ap: {
      // IP address to run captive portal on
      ipaddr: '192.168.2.1',

      // Base SSID to use for captive portal (suffix will include MAC address
      // components)
      ssid_base: 'WebThings Gateway',
    },
  },

  oauth: {
    // Whether or not to post the OAuth token back in the response
    postToken: false,

    // Whether or not to allow test clients
    testClients: false,
  },
};
