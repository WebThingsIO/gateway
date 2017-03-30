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
    this.ready = false;
  }

  setAttributeValue(name, value) {
    console.log('ZWave: setAttributeValue name:', name, 'value:', value);
    if (name === 'pair') {
      if (value) {
        console.log('ZWave: Press the Inclusion button on the device to add');
        this.adapter.zwave.addNode();
      } else {
        console.log('ZWave: Cancelling pairing mode');
        this.adapter.zwave.cancelControllerCommand();
      }
    } else if (name === 'unpair') {
      if (value) {
        console.log('Press the Exclusion button on the device to remove');
        this.adapter.zwave.removeNode();
      } else {
        console.log('ZWave: Cancelling unpairing mode');
        this.adapter.zwave.cancelControllerCommand();
      }
    } else {
      let zwValue = this.attributes[name]['zwValue'];
      this.adapter.zwave.setValue(zwValue.node_id, zwValue.class_id,
                                  zwValue.instance, zwValue.index, value);
    }

    // Calling super.setPropertyValue will update the value cache
    // and send a 'value-changed' event to any listeners.
    super.setAttributeValue(name, value);
  }
}

module.exports = ZWaveNode;

