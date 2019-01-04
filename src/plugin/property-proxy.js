/**
 * PropertyProxy - Gateway side representation of a property
 *                 when using an adapter plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Constants = require('../constants');
const Deferred = require('../deferred');
const {Property} = require('gateway-addon');

class PropertyProxy extends Property {
  constructor(device, propertyName, propertyDict) {
    super(device, propertyName, propertyDict);

    this.value = propertyDict.value;

    this.propertyChangedPromises = [];
    this.propertyDict = Object.assign({}, propertyDict);
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
    const deferredChange = new Deferred();
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
    if (propertyDict.hasOwnProperty('title')) {
      this.title = propertyDict.title;
    }
    if (propertyDict.hasOwnProperty('type')) {
      this.type = propertyDict.type;
    }
    if (propertyDict.hasOwnProperty('@type')) {
      this['@type'] = propertyDict['@type'];
    }
    if (propertyDict.hasOwnProperty('unit')) {
      this.unit = propertyDict.unit;
    }
    if (propertyDict.hasOwnProperty('description')) {
      this.description = propertyDict.description;
    }
    if (propertyDict.hasOwnProperty('minimum')) {
      this.minimum = propertyDict.minimum;
    }
    if (propertyDict.hasOwnProperty('maximum')) {
      this.maximum = propertyDict.maximum;
    }
    if (propertyDict.hasOwnProperty('multipleOf')) {
      this.multipleOf = propertyDict.multipleOf;
    }
    if (propertyDict.hasOwnProperty('enum')) {
      this.enum = propertyDict.enum;
    }
    if (propertyDict.hasOwnProperty('links')) {
      this.links = propertyDict.links;
    }
    while (this.propertyChangedPromises.length > 0) {
      const deferredChange = this.propertyChangedPromises.pop();
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
      this.device.adapter.sendMsg(
        Constants.SET_PROPERTY, {
          deviceId: this.device.id,
          propertyName: this.name,
          propertyValue: value,
        });

      // TODO: Add a timeout

      this.onPropertyChanged().then((updatedValue) => {
        resolve(updatedValue);
      }).catch((error) => {
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
