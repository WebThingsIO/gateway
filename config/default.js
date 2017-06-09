/*
 * MozIoT Gateway Default Configuration.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

module.exports = {
  adapters : {
    gpio: {
      enabled: false,
      path: './adapters/gpio',
      pins: {
        18: {
          name: 'led',
          direction: 'out',   // 'in' or 'out'
          value: 0            // value on required when 'direction' is 'out'
        },
      }
    },
    zigbee: {
      enabled: true,
      path: './adapters/zigbee',
    },
    zwave: {
      enabled: true,
      path: './adapters/zwave',
    }
  },
  adapterManager: {
    pairingTimeout: 3 * 60,   // seconds
  },
  database: {
    filename: './db.sqlite3',
    removeBeforeOpen: false,
  },
  authentication: {
    enabled: false,
    defaultUser:  {              // DO NOT USE THIS IN PRODUCTION
      email: 'user@example.com',
      password: 'password',
      name: 'Example User'
    },
    secret: 'top secret 51'      // DO NOT USE THIS IN PRODUCTION
  }
};
