/**
 *
 * ZWaveNode - represents a node on the ZWave network.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Device = require('../device');
var utils = require('../utils');

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

const DEBUG = false;

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
    this.zwClasses = [];
    this.zwValues = {};
    this.ready = false;
    this.lastStatus = 'constructed';
  }

  asDict() {
    var dict = super.asDict();
    dict.lastStatus = this.lastStatus;
    dict.zwInfo = this.zwInfo;
    dict.zwClasses = this.zwClasses;
    dict.zwValues = this.zwValues;
    return dict;
  }

  findPropertyFromValueId(valueId) {
    for (var property of this.properties) {
      if (property.valueId == valueId) {
        return property;
      }
    }
  }

  notifyPropertyChanged(property) {
    var deferredSet = property.deferredSet;
    if (deferredSet) {
      property.deferredSet = null;
      deferredSet.resolve(property.value);
    }
    super.notifyPropertyChanged(property);
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

  zwValueAdded(comClass, zwValue) {
    this.lastStatus = 'value-added';
    if (this.zwClasses.indexOf(comClass) < 0) {
      this.zwClasses.push(comClass);
    }
    this.zwValues[zwValue.value_id] = zwValue;

    var property = this.findPropertyFromValueId(zwValue.value_id);
    if (zwValue.genre === 'user' || DEBUG) {
      if (property) {
        property.value = zwValue.value;
        console.log('ZWave: node%d valueAdded: %d:%s -> %s property: %s',
                    this.zwInfo.nodeId, comClass, zwValue.label, zwValue.value,
                    property.name);
      } else {
        console.log('ZWave: node%d valueAdded: %d:%s -> %s',
                    this.zwInfo.nodeId, comClass, zwValue.label, zwValue.value);
      }
    }
    if (zwValue.genre === 'user' && !this.defaultName)  {
      // We use the label from the first 'user' value that we see to help
      // disambiguate different nodes.
      this.defaultName = this.id + '-' + zwValue.label;
    }
  }

  zwValueChanged(comClass, zwValue) {
    this.lastStatus = 'value-changed';
    this.zwValues[zwValue.value_id] = zwValue;

    var property = this.findPropertyFromValueId(zwValue.value_id);
    if (property) {
      property.setCachedValue(zwValue.value);
      console.log('ZWave: node%d valueChanged: %d:%s = %s -> property: %s = %s',
                  this.zwInfo.nodeId, comClass, zwValue.label, zwValue.value,
                  property.name, property.value);
      this.notifyPropertyChanged(property);
    } else {
      console.log('ZWave: node%d valueChanged: %d:%s = %s',
                  this.zwInfo.nodeId, comClass, zwValue.label, zwValue.value);
    }
  }

  zwValueRemoved(comClass, instance, index) {
    this.lastStatus = 'value-removed';
    var valueId = this.zwInfo.nodeId + '-' +
                  comClass + '-' + instance + '-' + index;
    var zwValue = this.zwValues[valueId];
    if (zwValue) {
      delete this.zwValues[valueId];
      var property = this.findPropertyFromValueId(zwValue.value_id);
      if (property) {
        delete property.valueId;
        delete property.value;
        console.log('ZWave: node%d valueRemoved: %d:%s -> %s property: %s',
                    this.zwInfo.nodeId, comClass, zwValue.label, zwValue.value,
                    property.name);
      } else {
        console.log('ZWave: node%d valueRemoved: %d:%s -> %s',
                    this.zwInfo.nodeId, comClass, zwValue.label, zwValue.value);
      }
    } else {
      console.log('ZWave: zwValueRemoved unknown valueId:', valueId);
    }
  }
}

module.exports = ZWaveNode;
