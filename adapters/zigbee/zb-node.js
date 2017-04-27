/**
 *
 * ZigBeeDevice - represents a device on the ZigBee network
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Device = require('../../device').Device;

class ZigBeeNode extends Device {

  constructor(adapter, id64, id16) {
    // Our id is a Mac address on the ZigBee network. It's unique within
    // the zigbee network, but might not be globally unique, so we prepend
    // with zb- to put it in a namespace.
    var deviceId = 'zb-' + id64;
    super(adapter, deviceId);

    this.addr64 = id64;
    this.addr16 = id16;
    this.neighbors = [];
    this.activeEndpoints = {};
    this.propertyMap = {};

    this.isCoordinator = (id64 == adapter.serialNumber);
  }

  asDict() {
    var dict = super.asDict();
    dict.addr64 = this.addr64;
    dict.addr16 = this.addr16;
    dict.neighbors = this.neighbors;
    dict.activeEndpoints = this.activeEndpoints;
    dict.propertyMap = this.propertyMap;
    dict.isCoordinator = this.isCoordinator;
    return dict;
  }

  getProperty(propertyName) {
    console.log('ZigBee: getProperty not implemented yet - returning false');
    return false;
  }

  setProperty(propertyName, value) {
    var clusterId = this.propertyMap[propertyName];
    console.log('ZigBee: setProperty propertyName:', propertyName,
                'clusterId:', clusterId,
                'value:', value);
    if (clusterId !== undefined) {
      this.adapter.setValue(this, clusterId, value);
      this.notifyValueChanged(propertyName, value);
    }
  }
}

module.exports = ZigBeeNode;
