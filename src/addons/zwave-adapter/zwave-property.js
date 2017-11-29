/**
 * ZWave Property.
 *
 * Object which decscribes a property, and its value.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var Deferred = require('../deferred');
var Property = require('../property');

class ZWaveProperty extends Property {
  constructor(device, name, propertyDescr, valueId) {
    super(device, name, propertyDescr);

    this.valueId = valueId;
    var zwValue = device.zwValues[valueId];
    if (zwValue) {
      this.value = zwValue.value;
    }
  }

  asDict() {
    var dict = super.asDict();
    dict.valueId = this.valueId;
    dict.value = this.value;
    return dict;
  }

  /**
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(value) {
    var deferredSet = new Deferred();
    if (this.deferredSet) {
      deferredSet.reject('setProperty property ' + this.name +
                         ' already has a set in progress.');
    } else {
      // We don't update the cached value here, but rather
      // wait for the valueChanged notificaton.

      console.log('setProperty property:', this.name,
                  'for:', this.device.name,
                  'valueId:', this.valueId,
                  'value:', value);
      if (this.valueId) {
        let zwValue = this.device.zwValues[this.valueId];
        this.device.adapter.zwave.setValue(zwValue.node_id, zwValue.class_id,
                                           zwValue.instance, zwValue.index,
                                           value);
        this.deferredSet = deferredSet;
      } else {
        deferredSet.reject('setProperty property ' + this.name +
                          ' for node ' + this.device.id +
                          ' doesn\'t have a valueId');
      }
    }
    return deferredSet.promise;
  }
}

module.exports = ZWaveProperty;
