/**
 * DeviceProxy - Gateway side representation of a device when using
 *               an adapter plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Constants = require('../constants');
const PropertyProxy = require('./property-proxy');
const {Device} = require('gateway-addon');

class DeviceProxy extends Device {

  constructor(adapter, deviceDict) {
    super(adapter, deviceDict.id);

    this.name = deviceDict.name;
    this.type = deviceDict.type;
    this.description = deviceDict.description || '';

    for (var propertyName in deviceDict.properties) {
      var propertyDict = deviceDict.properties[propertyName];
      var propertyProxy = new PropertyProxy(this, propertyName, propertyDict);
      this.properties.set(propertyName, propertyProxy);
    }

    // Copy over any extra device fields which might be useful for debugging.
    this.deviceDict = {};
    for (let field in deviceDict) {
      if (['id', 'name', 'type', 'description', 'properties', 'actions',
           'events'].includes(field)) {
        continue;
      }
      this.deviceDict[field] = deviceDict[field];
    }

    //TODO: Add support for actions once we know what they look like.
  }

  asDict() {
    return Object.assign({}, this.deviceDict, super.asDict());
  }

  debugCmd(cmd, params) {
    this.adapter.sendMsg(
      Constants.DEBUG_CMD, {
        deviceId: this.id,
        cmd: cmd,
        params: params
      }
    );
  }
}

module.exports = DeviceProxy;
