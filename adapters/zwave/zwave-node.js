/**
 *
 * ZWaveAdapter - Adapter which manages ZWave nodes
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Device = require('../../device').Device;
var utils = require('../../utils');

var padLeft = utils.padLeft;
var padRight = utils.padRight;
var repeatChar = utils.repeatChar;

let BASIC_STR = [
  '???',
  'Controller',
  'StaticController',
  'Slave',
  'RoutingSlave'
];

class ZWaveNode extends Device {

  constructor(adapter, nodeId) {
    // Our nodeId is a number from 1-255 and is only unique within
    // the ZWave controller. So we extend this by appending the node id
    // to the controller id and use that as the device's id.
    var deviceId = adapter.id.toString(16) + '-' + nodeId;
    super(adapter, deviceId);

    this.zwInfo = {
      location: '',
      nodeId: nodeId,
      manufacturer: '',
      manufacturerId: '',
      product: '',
      productId: '',
      productType: '',
      type: '',
    };

    this.nodeId = nodeId;
    this.location = '';
    this.classes = {};
    this.values = {};
    this.ready = false;
    this.lastStatus = 'constructed';
  }

  asDict() {
    var dict = super.asDict();
    dict.zwInfo = this.zwInfo;
    dict.status = this.status;
    dict.classes = this.classes;
    dict.values = this.values;
    return dict;
  }

  getPropertyValue(propertyName) {
    var valueId = this.propertyMap[propertyName];
    if (valueId) {
        return this.values[valueId].value;
    }
  }

  static oneLineHeader(line) {
    if (line === 0) {
      return 'Node LastStat ' +
        padRight('Basic Type', 16) + ' ' +
        padRight('Type', 24) + ' ' +
        padRight('Product Name', 50) + ' ' +
        padRight('Name', 30) + ' ' +
        'Location';
    }
    return repeatChar('-', 4) + ' ' +
      repeatChar('-', 8) + ' ' +
      repeatChar('-', 16) + ' ' +
      repeatChar('-', 24) + ' ' +
      repeatChar('-', 50) + ' ' +
      repeatChar('-', 30) + ' ' +
      repeatChar('-', 30);
  }

  oneLineSummary() {
    var nodeId = this.zwInfo.nodeId;
    var zwave = this.adapter.zwave;

    var basic = zwave.getNodeBasic(nodeId);
    var basicStr = (basic >= 1 && basic < BASIC_STR.length) ?
                    BASIC_STR[basic] :
                    '??? ' + basic + ' ???';

    return padLeft(nodeId, 3) + ': ' +
           padRight(this.lastStatus, 8) + ' ' +
           padRight(basicStr, 16) + ' ' +
           padRight(this.zwInfo.type, 24) + ' ' +
           padRight(this.zwInfo.product, 50) + ' ' +
           padRight(this.name, 30) + ' ' +
           this.zwInfo.location;
  }

  setPropertyValue(propertyName, value) {
    var valueId = this.propertyMap[propertyName];
    console.log('ZWave: setPropertyValue propertyName:', propertyName,
                'valueId:', valueId,
                'value:', value);
    if (valueId) {
      let zwValue = this.values[valueId];
      this.adapter.zwave.setValue(zwValue.node_id, zwValue.class_id,
                                  zwValue.instance, zwValue.index, value);
      this.notifyValueChanged(propertyName, value);
    }
  }
}

module.exports = ZWaveNode;

