/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const assert = require('assert');
const AddonManager = require('../addon-manager');
const Constants = require('../constants');
const Things = require('../models/things');
const EventEmitter = require('events').EventEmitter;
const Events = require('./Events');

/**
 * Utility to support operations on Thing's properties
 */
class Property extends EventEmitter {
  /**
   * Create a Property from a descriptor returned by the WoT API
   * @param {PropertyDescription} desc
   */
  constructor(desc) {
    super();

    assert(desc.type);
    assert(desc.thing);
    assert(desc.id);

    this.type = desc.type;
    this.thing = desc.thing;
    this.id = desc.id;

    if (desc.unit) {
      this.unit = desc.unit;
    }
    if (desc.description) {
      this.description = desc.description;
    }

    this.onPropertyChanged = this.onPropertyChanged.bind(this);
  }

  /**
   * @return {PropertyDescription}
   */
  toDescription() {
    const desc = {
      type: this.type,
      thing: this.thing,
      id: this.id,
    };
    if (this.unit) {
      desc.unit = this.unit;
    }
    if (this.description) {
      desc.description = this.description;
    }
    return desc;
  }

  /**
   * @return {Promise} resolves to property's value
   */
  async get() {
    return await Things.getThingProperty(this.thing, this.id);
  }

  /**
   * @param {any} value
   * @return {Promise} resolves if property is set to value
   */
  async set(value) {
    await Things.setThingProperty(this.thing, this.id, value);
  }

  async start() {
    AddonManager.on(Constants.PROPERTY_CHANGED, this.onPropertyChanged);
  }

  onPropertyChanged(property) {
    if (property.device.id !== this.thing) {
      return;
    }
    if (property.name !== this.id) {
      return;
    }
    this.emit(Events.VALUE_CHANGED, property.value);
  }

  stop() {
    AddonManager.removeListener(Constants.PROPERTY_CHANGED,
                                this.onPropertyChanged);
  }
}

module.exports = Property;
