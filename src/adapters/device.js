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

const Constants = require('../constants');

class Device {

  constructor(adapter, id) {
    this.adapter = adapter;
    this.id = id;
    this.type = 'thing';
    this.name = '';
    this.description = '';
    this.properties = new Map();
    this.actions = new Map();
  }

  asDict() {
    var properties = {};
    this.properties.forEach((property, propertyName) => {
      properties[propertyName] = property.asDict();
    });
    return {
        'id': this.id,
        'name': this.name,
        'type': this.type,
        'properties': properties,
        'actions': this.actions,
    };
  }

  /**
   * @returns this object as a thing
   */
  asThing() {
    var thing = {
      id: this.id,
      name: this.name,
      type: this.type,
      properties: this.getPropertyDescriptions(),
    };
    if (this.description) {
      thing.description = this.description;
    }

    return thing;
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
    var propDescs = {};
    this.properties.forEach((property, propertyName) => {
      propDescs[propertyName] = property.asPropertyDescription();
    });
    return propDescs;
  }

  findProperty(propertyName) {
    return this.properties.get(propertyName);
  }

  /**
   * @method getProperty
   * @returns a promise which resolves to the retrieved value.
   */
  getProperty(propertyName) {
    return new Promise((resolve, reject) => {
      var property = this.findProperty(propertyName);
      if (property) {
        property.getValue().then((value) => {
          resolve(value);
        });
      } else {
        reject('Property "' + propertyName + '" not found');
      }
    });
  }

  notifyPropertyChanged(property) {
    this.adapter.manager.emit(Constants.PROPERTY_CHANGED, property);
  }

  setDescription(description) {
    this.description = description;
  }

  setName(name) {
    this.name = name;
  }

  /**
   * @method setProperty
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setProperty(propertyName, value) {
    return new Promise((resolve, reject) => {
      var property = this.findProperty(propertyName);
      if (property) {
        property.setValue(value).then((updatedValue) => {
          resolve(updatedValue);
        });
      } else {
        reject('Property "' + propertyName + '" not found');
      }
    });
  }
}

module.exports = Device;
