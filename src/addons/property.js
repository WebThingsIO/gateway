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

const assert = require('assert');

const DESCR_FIELDS = ['type', 'unit', 'description', 'min', 'max'];
function copyDescrFieldsInto(target, source) {
  for (let field of DESCR_FIELDS) {
    if (source.hasOwnProperty(field)) {
      target[field] = source[field];
    }
  }
}

class Property {
  constructor(device, name, propertyDescr) {
    // The propertyDescr argument used to be the 'type' string, so we add an
    // assertion here to notify anybody who has an older plugin.

    assert.equal(typeof(propertyDescr), 'object',
                 'Please update plugin to use property description.');

    this.device = device;
    this.name = name;
    this.visible = true;
    this.fireAndForget = false;
    if (propertyDescr.hasOwnProperty('visible')) {
      this.visible = propertyDescr.visible;
    }

    copyDescrFieldsInto(this, propertyDescr);
  }

  /**
   * @returns a dictionary of useful information.
   * This is primarily used for debugging.
   */
  asDict() {
    var prop = {
      name: this.name,
      value: this.value,
      visible: this.visible,
    };
    copyDescrFieldsInto(prop, this);
    return prop;
  }

  /**
   * @returns the dictionary as used to describe a property. Currently
   * this does not include the href field.
   */
  asPropertyDescription() {
    var description = {};
    copyDescrFieldsInto(description, this);
    return description;
  }

  /**
   * @method isVisible
   * @returns true if this is a visible property, which is a property
   *          that is reported in the property description.
   */
  isVisible() {
    return this.visible;
  }

  /**
   * Sets this.value and makes adjustments to ensure that the value
   * is consistent with the type.
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
   * This implementation is a simple one that just returns
   * the previously cached value.
   */
  getValue() {
    return new Promise((resolve) => {
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
   * It is anticipated that this method will most likely be overridden
   * by a derived class.
   */
  setValue(value) {
    return new Promise((resolve) => {
      this.setCachedValue(value);
      console.log('setValue for property', this.name,
                  'to', this.value, 'for', this.device.id);
      resolve(this.value);
    });
  }
}

module.exports = Property;
