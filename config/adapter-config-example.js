/*
 * MozIoT Adapter Configuration.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

module.exports = {
  gpio: {
    enabled: false,
    path: './adapters/gpio'
  },
  zigbee: {
    enabled: true,
    path: './adapters/zigbee',
  },
  zwave: {
    enabled: true,
    path: './adapters/zwave'
  },
};
