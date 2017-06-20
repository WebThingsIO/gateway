/*
 * MozIoT Gateway Test Configuration.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

module.exports = {
  adapters : {
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
    filename: './test-db.sqlite3',
    removeBeforeOpen: true,
  },
  authentication: {
    enabled: true,
    defaultUser: null
  }
};
