/**
 *
 * ZWaveAdapter - Adapter which manages ZWave nodes
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Device = require('../../device.js').Device;

class ZWaveNode extends Device {

  constructor(adapter, id, name) {
    super(adapter, 'ZWaveNode', id, name, {}, [], []);

    this.manufacturer = '';
    this.manufacturerId = '';
    this.product = '';
    this.productId = '';
    this.productType = '';
    this.zwType = '';
    this.location = '';
    this.classes = {};
    this.values = {};
    this.ready = false;
  }

  asDict() {
    var dict = super.asDict();
    dict.classes = this.classes;
    dict.values = this.values;
    return dict;
  }

  setAttributeValue(name, value) {
    console.log('ZWave: setAttributeValue name:', name, 'value:', value);
    let zwValue = this.attributes[name]['zwValue'];
    this.adapter.zwave.setValue(zwValue.node_id, zwValue.class_id,
                                zwValue.instance, zwValue.index, value);

    // Calling super.setPropertyValue will update the value cache
    // and send a 'value-changed' event to any listeners.
    super.setAttributeValue(name, value);
  }
}

module.exports = ZWaveNode;

