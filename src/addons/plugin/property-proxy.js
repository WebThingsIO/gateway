/**
 * PropertyProxy - Gateway side representation of a property
 *                 when using an adapter plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Constants = require('../addon-constants');
const Deferred = require('../deferred');
const Property = require('../property');

class PropertyProxy extends Property {
  constructor(device, propertyName, propertyDict) {
    super(device, propertyName, propertyDict);

    this.value = propertyDict.value;

    this.propertyChangedPromises = [];
    this.propertyDict = {};
  }

  asDict() {
    return Object.assign({}, this.propertyDict, super.asDict());
  }

  /**
   * @method onPropertyChanged
   * @returns a promise which is resoved when the next
   * propertyChanged notification is received.
   */
  onPropertyChanged() {
    var deferredChange = new Deferred();
    this.propertyChangedPromises.push(deferredChange);
    return deferredChange.promise;
  }

  /**
   * @method doPropertyChanged
   * Called whenever a property changed notification is received
   * from the adapter.
   */
  doPropertyChanged(propertyDict) {
    this.propertyDict = Object.assign({}, propertyDict);
    this.setCachedValue(propertyDict.value);
    while (this.propertyChangedPromises.length > 0) {
      var deferredChange = this.propertyChangedPromises.pop();
      deferredChange.resolve(propertyDict.value);
    }
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
                  'for:', this.device.id,
                  'to value:', value);

      this.device.adapter.sendMsg(
        Constants.SET_PROPERTY, {
          deviceId: this.device.id,
          propertyName: this.name,
          propertyValue: value,
      });

      //TODO: Add a timeout

      this.onPropertyChanged().then(updatedValue => {
        resolve(updatedValue);
      }).catch(error => {
        console.error('PropertyProxy: Failed to setProperty',
                      this.name, 'to', value,
                      'for device:', this.device.id);
        console.error(error);
        reject(error);
      });
    });
  }
}

module.exports = PropertyProxy;
