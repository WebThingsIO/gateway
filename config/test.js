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
    https: 0 // 0 = find a free open port
  },
  adapters : {
    hid: {
      enabled: false,
    },
    mock: {
      enabled: true,
      path: './adapters/mock',
    },
    zwave: {
      enabled: false,
    },
    zigbee: {
      enabled: false,
    },
  },
  database: {
    filename: ':memory:',
    removeBeforeOpen: false,
  },
  authentication: {
    enabled: true,
    defaultUser: null
  }
};
