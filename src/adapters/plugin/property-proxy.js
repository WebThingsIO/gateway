/**
 * PropertyProxy - Gateway side representation of a property
 *                 when using an adapter plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var Property = require('../property');

class PropertyProxy extends Property {
  constructor(device, propertyDict) {
    super(device, propertyDict.name, propertyDict.type);

    if (propertyDict.description) {
      this.description = propertyDict.description;
    }
    if (propertyDict.unit) {
      this.description = propertyDict.unit;
    }

    this.value = propertyDict.value;
  }

  /**
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(value) {
    return new Promise((resolve, reject) => {
      console.log('PropertyProxy: setProperty property:', this.name,
                  'for:', this.device.name,
                  'to value:', value);

      var device = this.device;
      device.adapter.sendMsgGetReply(
        'setProperty', {
          deviceId: device.id,
          propertyName: this.name,
          propertyValue: value,
        }
      ).then(reply => {
        this.setCachedValue(reply.data.propertyValue);
        resolve(this.value);
      }).catch(error => {
        console.error('PropertyProxy: Failed to setProperty',
                      this.name, 'to', value,
                      'for device:', device.id);
        console.error(error);
        reject(error);
      });
    });
  }
}

module.exports = PropertyProxy;
