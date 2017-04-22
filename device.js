/**
 * Device Model.
 *
 * Abstract base class for devices managed by an adapter.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var assert = require('assert');

class Device {

  constructor(adapter, id) {
    this.adapter = adapter;
    this.id = id;
    this.type = 'thing';
    this.name = 'unknown';
    this.properties = [];
    this.propertyMap = {};
    this.actions = [];
  }

  asDict() {
    return {
        'id': this.id,
        'name': this.name,
        'type': this.type,
        'properties': this.properties,
        'propertyMap': this.propertyMap,
        'actions': this.actions,
    };
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  getProperties() {
    return this.properties;
  }

  getProperty(name) {
    for (var property of this.properties) {
      if (property.name == name) {
        return property;
      }
    }
  }

  getPropertyValue(name) {
    assert(false, 'getPropertyValue must be implemented in derived class');
  }

  notifyValueChanged(name, value) {
    this.adapter.manager.emit('value-changed', {
      'device': this,
      'property': name,
      'value': value
    });
  }

  setName(name) {
    this.name = name;
    this.adapter.manager.emit('device-name-changed', this);
  }

  setPropertyValue(name, value) {
    assert(false, 'setPropertyValue must be implemented in derived class');
  }
}

exports.Device = Device;
