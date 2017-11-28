/*
 * Things Gateway Test Configuration.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

module.exports = {
  cli: false,
  ports: {
    https: 0, // 0 = find a free open port
    http: 0,
  },
  behindForwarding: false,
  addonManager: {
    path: './addons-test',
    listUrl: 'https://raw.githubusercontent.com/mozilla-iot/addon-list/master/test.json',
  },
  database: {
    filename: ':memory:',
    removeBeforeOpen: false,
  },
  ipc: {
    protocol: 'inproc',
  },
  settings: {
    defaults: {
    },
  },
  uploads: {
    directory: '../../static/uploads/' // Directory to store uploads in
  },
  authentication: {
    defaultUser: null,
  },
  bcryptRounds: 2
};
