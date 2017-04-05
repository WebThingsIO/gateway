/**
 *
 * FooAdapter - a dummy adapter
 *
 * This shows a dummy adapter and thing which is incorporated into
 * a single file.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Device = require('../device.js').Device;
var Adapter = require('../adapter.js').Adapter;

class FooDevice extends Device {
  constructor(adapter, id, name) {
    let attributes = {
      'temperature': {
        'type': 'integer',
        'unit': 'celsius',
        'description': 'An ambient temperature sensor',
        'value': 23,
      },
      'humidity': {
        'type': 'integer',
        'unit': 'percent',
        'value': 35,
      },
      'led': {
        'type': 'boolean',
        'description': 'A red LED',
        'value': false,
      },
    };
    super(adapter, 'FooDevice', id, name, attributes);
  }

  setAttributeValue(name, value) {
    // This function should propogate the value to the hardware
    // Calling super.setAttrbiuteValue will update the value cache
    // and send a 'value-changed' event to any listeners.
    super.setAttributeValue(name, value);
  }
}

class FooAdapter extends Adapter {

  constructor(adapterManager) {
    super(adapterManager, 'Foo1');

    this.addDevice(new FooDevice(this, 'Foo1', 'device1'));
    this.addDevice(new FooDevice(this, 'Foo2', 'device2'));
  }
}

function loadFooAdapters(adapterManager) {
  adapterManager.addAdapter(new FooAdapter(adapterManager));
}

module.exports = loadFooAdapters;
