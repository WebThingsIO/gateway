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
    super(adapter, id);

    this.name = name;
    this.type = 'onOffSwitch';
    this.description = this.name + ' description.';

    this.properties = [{
      'name': 'on',
      'type': 'boolean',
    }];
    this.actions = [{
      'name': 'toggle',
      'description': 'Foo toggler',
    }];
    this.value = {'on': false};
  }

  getProperty(name) {
    if (name in this.value) {
      return this.value[name];
    }
  }

  setProperty(name, value) {
    this.value[name] = value;
    console.log('Foo: device:', this.name, 'set property:', name, 'to:', value);
    this.notifyValueChanged(name, value);
  }
}

class FooAdapter extends Adapter {

  constructor(adapterManager) {
    super(adapterManager, 'Foo1');

    this.handleDeviceAdded(new FooDevice(this, 'Foo1', 'device1'));
    this.handleDeviceAdded(new FooDevice(this, 'Foo2', 'device2'));
  }
}

function loadFooAdapters(adapterManager) {
  adapterManager.addAdapter(new FooAdapter(adapterManager));
}

module.exports = loadFooAdapters;
