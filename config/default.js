/*
 * Things Gateway Default Configuration.
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

  profileDir: `${home}/.mozilla-iot`,

  ports: {
    https: 4443,
    http: 8080,
  },
  // Whether the gateway is behind port forwarding and should use simplified
  // port-free urls
  behindForwarding: true,
  addonManager: {
    api: 2,
    listUrl: 'https://raw.githubusercontent.com/mozilla-iot/addon-list/master/list.json',
  },
  database: {
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
  authentication: {
    defaultUser: null,
  },
  ssltunnel: {
    enabled: true,
    registration_endpoint: 'https://api.mozilla-iot.org:8443',
    domain: 'mozilla-iot.org',
    pagekite_cmd: path.normalize(process.cwd() + '/pagekite.py'),
    port: 443,
    certemail: 'certificate@mozilla-iot.org',
  },
  bcryptRounds: 2,
};
