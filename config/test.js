/*
 * WebThings Gateway Test Configuration.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const os = require('os');
const home = os.homedir();

module.exports = {
  cli: false,
  profileDir: `${home}/.mozilla-iot/test`,
  ports: {
    https: 0, // 0 = find a free open port
    http: 0,
  },
  behindForwarding: false,
  addonManager: {
    testAddons: true,
  },
  database: {
    removeBeforeOpen: true,
  },
  ipc: {
    protocol: 'inproc',
  },
  oauthTestClients: true,
};
