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
      var propertyProxy = new PropertyProxy(this, propertyDict);
      this.properties.set(propertyName, propertyProxy);
    }

    //TODO: Add support for actions once we know what they look like.
  }
}

module.exports = DeviceProxy;