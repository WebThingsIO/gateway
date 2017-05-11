/**
 *
 * GpioAdapter - an adapter for controlling GPIO pins.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var fs = require('fs');
var Gpio = require('onoff').Gpio;
var Device = require('../../device.js').Device;
var Adapter = require('../../adapter.js').Adapter;

const THING_TYPE_ON_OFF_SWITCH = 'onOffSwitch';

class GpioDevice extends Device {
  constructor(adapter, pin, pinConfig) {
    var id = 'gpio-' + pin;
    super(adapter, id);

    if (pinConfig.direction === undefined) {
      pinConfig.direction = 'in';
    }
    if (pinConfig.name === undefined) {
      pinConfig.name = id;
    }
    if (pinConfig.direction == 'in') {
      if (pinConfig.edge === undefined) {
        pinConfig.edge = 'none';
      }
      this.gpio = new Gpio(pin, 'in', pinConfig.edge);
    } else if (pinConfig.direction == 'out') {
      if (pinConfig.value === undefined) {
        pinConfig.value = 0;
      }
      this.gpio = new Gpio(pin, 'out');
      this.gpio.writeSync(pinConfig.value);
    }
    pinConfig.pin = pin;
    this.pinConfig = pinConfig;
    this.name = pinConfig.name;

    if (pinConfig.direction === 'out') {
      this.initOnOffSwitch();
      this.adapter.handleDeviceAdded(this);
    }
  }

  asDict() {
    var dict = super.asDict();
    dict.pinConfig = this.pinConfig;
    return dict;
  }

  initOnOffSwitch() {
    this.type = THING_TYPE_ON_OFF_SWITCH;
    this.properties = [{
      'name': 'on',
      'type': 'boolean',
    }];
    this.values['on'] = (this.pinConfig.value != 0);
  }

  getProperty(propertyName) {
    if (propertyName in this.values) {
      return this.values[propertyName];
    }
  }

  setProperty(propertyName, value) {
    this.values[propertyName] = value;
    console.log('GPIO:', this.name, 'set:', propertyName, 'to:', value);
    this.gpio.writeSync(value ? 1 : 0);
    this.notifyValueChanged(propertyName, value);
  }
}

class GpioAdapter extends Adapter {

  constructor(adapterManager, gpioConfigs) {
    super(adapterManager, 'GPIO');

    for (var pin in gpioConfigs) {
      /* jshint -W031 */
      new GpioDevice(this, pin, gpioConfigs[pin]);
    }
    adapterManager.addAdapter(this);
  }
}

function loadGpioAdapter(adapterManager, gpioConfig) {
  /* jshint -W031 */
  new GpioAdapter(adapterManager, gpioConfigs);
}

module.exports = loadGpioAdapter;