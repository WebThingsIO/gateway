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
    this.name = '';
    this.description = '';
    this.properties = [];
    this.actions = [];
  }

  asDict() {
    return {
        'id': this.id,
        'name': this.name,
        'type': this.type,
        'properties': this.properties,
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

  getPropertyDescriptions() {
    return this.properties;
  }

  getPropertyDescription(propertyName) {
    for (var property of this.properties) {
      if (property.name == propertyName) {
        return property;
      }
    }
  }

  getProperty(propertyName) {
    assert(false, 'getProperty must be implemented in derived class');
  }

  getThing() {
    var thing = {
      id: this.id,
      name: this.name,
      type: this.type,
      properties: this.getPropertyDescriptions(),
    };
    if (this.description.length > 0) {
      thing.description = this.description;
    }

    return thing;
  }

  notifyValueChanged(propertyName, value) {
    this.adapter.manager.emit('value-changed', {
      'device': this,
      'property': propertyName,
      'value': value
    });
  }

  setDescription(description) {
    this.description = description;
  }

  setName(name) {
    this.name = name;
  }

  setProperty(propertyName, value) {
    assert(false, 'setProperty must be implemented in derived class');
  }
}

exports.Device = Device;
