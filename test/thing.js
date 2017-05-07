#!/usr/bin/env node
/*
 * MozIoT Gateway App.
 *
 * Back end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

class Thing {
  constructor(gateway, thingDescription) {
    this.gateway = gateway;
    for (var fieldName in thingDescription) {
      this[fieldName] = thingDescription[fieldName];
    }
  }

  getPropertyDescription(propertyName) {
    for (var property of this.properties) {
      if (property.name == propertyName) {
        return property;
      }
    }
  }

  getProperty(propertyName) {
    var promise = new Promise((resolve, reject) => {
      var property = this.getPropertyDescription(propertyName);
      if (property) {
        this.gateway.get(property.href).then((result) => {
          var value = result[propertyName];
          console.log(this.name,
                      'property', propertyName,
                      'has value', value);
          resolve(value);
        });
      } else {
        reject('Property ' + propertyName + ' not found.');
      }
    });
    return promise;
  }

  setProperty(propertyName, value) {
    var promise = new Promise((resolve, reject) => {
      var property = this.getPropertyDescription(propertyName);
      if (property) {
        var data = {};
        data[propertyName] = value;
        console.log(this.name,
                    'setting property', propertyName,
                    'to', value);
        this.gateway.put(property.href, data).then((result) => {
          resolve(value);
        });
      } else {
        reject('Property ' + propertyName + ' not found.');
      }
    });
    return promise;
  }

  hasProperty(propertyName) {
    return this.getPropertyDescription(propertyName) !== undefined;
  }
}

module.exports = Thing;