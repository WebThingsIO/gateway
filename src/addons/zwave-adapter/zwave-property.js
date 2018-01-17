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

const Deferred = require('../deferred');
const Property = require('../property');

class ZWaveProperty extends Property {
  constructor(device, name, propertyDescr, valueId,
              setZwValueFromValue, parseValueFromZwValue) {
    super(device, name, propertyDescr);

    this.valueId = valueId;

    if (!setZwValueFromValue) {
      setZwValueFromValue = 'setIdentityValue';
    }
    this.setZwValueFromValue = Object.getPrototypeOf(this)[setZwValueFromValue];
    if (!this.setZwValueFromValue) {
      let err = 'Unknown function: ' + setZwValueFromValue;
      console.error(err);
      throw err;
    }

    if (!parseValueFromZwValue) {
      parseValueFromZwValue = 'parseIdentityValue';
    }
    this.parseValueFromZwValue =
      Object.getPrototypeOf(this)[parseValueFromZwValue];
    if (!this.parseValueFromZwValue) {
      let err = 'Unknown function: ' + parseValueFromZwValue;
      console.error(err);
      throw err;
    }

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

  parseIdentityValue(zwData) {
    let propertyValue = zwData;
    return [propertyValue, '' + propertyValue];
  }

  parseLevelZwValue(zwData) {
    this.level = Math.max(zwData, 0);
    let percent = this.level;
    if (zwData >= 99) {
      percent = 100;
    }
    return [
      percent,
      percent.toFixed(1) + '% (zw: ' + this.level + ')'
    ];
  }

  parseZwValue(zwData) {
    return this.parseValueFromZwValue(zwData);
  }

  setIdentityValue(propertyValue) {
    let zwData = propertyValue;
    return [zwData, '' + zwData];
  }

  /**
   *
   * The ZWave spec for COMMAND_CLASS_SWITCH_MULTILEVEL maps the values
   * 0-99 onto 0%-100%
   *
   * For simplicity we treat it as an identity mapping but treat 99%
   * and 100% as the same.
   */
  setLevelValue(percent) {
    if (typeof(percent) !== 'number') {
      console.error('setLevelValue passed a non-numeric percentage:',
                    percent, '- ignoring');
      return;
    }
    if (this.hasOwnProperty('min')) {
      percent = Math.max(percent, this.min);
    }
    if (this.hasOwnProperty('max')) {
      percent = Math.min(percent, this.max);
    }
    this.level = Math.round(Math.min(Math.max(percent, 0), 99));

    return [
      this.level,
      'zw: ' + this.level + ' (' + percent.toFixed(1) + '%)'
    ];
  }

  /**
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(propertyValue) {
    var deferredSet = this.deferredSet;
    if (!deferredSet) {
      deferredSet = new Deferred();
      this.deferredSet = deferredSet;
    }

    this.setCachedValue(propertyValue);

    let [zwValueData, logData] = this.setZwValueFromValue(propertyValue);

    console.log('setProperty property:', this.name,
                'for:', this.device.name,
                'valueId:', this.valueId,
                'value:', logData);

    if (this.valueId) {
      let zwValue = this.device.zwValues[this.valueId];
      this.device.adapter.zwave.setValue(zwValue.node_id, zwValue.class_id,
                                          zwValue.instance, zwValue.index,
                                          zwValueData);
    } else {
      deferredSet.reject('setProperty property ' + this.name +
                        ' for node ' + this.device.id +
                        ' doesn\'t have a valueId');
    }
    return deferredSet.promise;
  }
}

module.exports = ZWaveProperty;
