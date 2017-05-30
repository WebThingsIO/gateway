/**
 * Property.
 *
 * Object which decscribes a property, and its value.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

class Property {
  constructor(device, name, type) {
    this.device = device;
    this.name = name;
    this.type = type;

    // Other optional attributes that an instance of this class can have.
    // this.unit
    // this.description
    // this.value
  }

  /**
   * @returns a dictionary of useful information.
   * This is primarily used for debugging.
   */
  asDict() {
    return {
      name: this.name,
      type: this.type,
      unit: this.unit,
      description: this.description,
      value: this.value,
    };
  }

  /**
   * @returns the dictionary as used to describe a property. Currently
   * this does not include the href field.
   */
  asPropertyDescription() {
    var description = {};
    description.type = this.type;
    if (this.description) {
      description.description = this.description;
    }
    if (this.unit) {
      description.unit = this.unit;
    }
    return description;
  }

  /**
   * Sets this.value and makes adjustments to ensure that the value
   * is consitent with the type.
   */
  setCachedValue(value) {
    if (this.type === 'boolean') {
      // Make sure that the value is actually a boolean.
      this.value = !!value;
    } else {
      this.value = value;
    }
    return this.value;
  }

  /**
   * @method getValue
   * @returns a promise which resolves to the retrieved value.
   *
   * This implementation is a simple implementation that just returns
   * the previously cached value.
   */
  getValue() {
    return new Promise((resolve, reject) => {
      console.log('getValue for property', this.name,
                  'for:', this.device.name,
                  'returning', this.value);
      resolve(this.value);
    });
  }

  /**
   * @method setValue
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   *
   * It is anticipated that this method will most likely be overriden
   * by a derived class.
   */
  setValue(value) {
    return new Promise((resolve, reject) => {
      this.setCachedValue(value);
      console.log('setValue for property', this.name,
                  'to', this.value);
      resolve(this.value);
    });
  }
}

module.exports = Property;
