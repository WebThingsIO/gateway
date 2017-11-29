/**
 * DeviceProxy - Gateway side representation of a device when using
 *               an adapter plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const PropertyProxy = require('./property-proxy');

var Device = require('../device');

class DeviceProxy extends Device {

  constructor(adapter, deviceDict) {
    super(adapter, deviceDict.id);

    this.name = deviceDict.name;
    this.type = deviceDict.type;

    for (var propertyName in deviceDict.properties) {
      var propertyDict = deviceDict.properties[propertyName];
      var propertyProxy = new PropertyProxy(this, propertyName, propertyDict);
      this.properties.set(propertyName, propertyProxy);
    }

    // Copy over any extra device fields which might be useful for debugging.
    this.deviceDict = {};
    for (let field in deviceDict) {
      if (field in ['id', 'name', 'type', 'properties', 'actions', 'events']) {
        continue;
      }
      this.deviceDict[field] = deviceDict[field];
    }

    //TODO: Add support for actions once we know what they look like.
  }

  asDict() {
    return Object.assign({}, this.deviceDict, super.asDict());
  }
}

module.exports = DeviceProxy;