/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

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
    this.onThingAdded = this.onThingAdded.bind(this);
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
   * @return {Promise} resolves to property's value or undefined if not found
   */
  async get() {
    try {
      return await Things.getThingProperty(this.thing, this.id);
    } catch (e) {
      console.warn('Rule get failed', e);
    }
  }

  /**
   * @param {any} value
   * @return {Promise} resolves when set is done
   */
  set(value) {
    return Things.setThingProperty(this.thing, this.id, value).catch((e) => {
      console.warn('Rule set failed, retrying once', e);
      return Things.setThingProperty(this.thing, this.id, value);
    }).catch((e) => {
      console.warn('Rule set failed completely', e);
    });
  }

  async start() {
    AddonManager.on(Constants.PROPERTY_CHANGED, this.onPropertyChanged);

    try {
      await this.getInitialValue();
    } catch (_e) {
      AddonManager.on(Constants.THING_ADDED, this.onThingAdded);
    }
  }

  async getInitialValue() {
    const initialValue = await this.get();
    if (typeof initialValue === 'undefined') {
      throw new Error('Did not get a real value');
    }
    this.emit(Events.VALUE_CHANGED, initialValue);
  }

  /**
   * Listener for AddonManager's THING_ADDED event
   * @param {String} thing - thing id
   */
  onThingAdded(thing) {
    if (thing.id !== this.thing) {
      return;
    }
    this.getInitialValue().catch((e) => {
      console.warn('Rule property unable to get value', e);
    });
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
    AddonManager.removeListener(Constants.THING_ADDED,
                                this.onThingAdded);
  }
}

module.exports = Property;
