/**
 *
 * GpioAdapter - an adapter for controlling GPIO pins.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Adapter = require('../adapter');
var Device = require('../device');
var Gpio = require('onoff').Gpio;
var Property = require('../property');

const THING_TYPE_ON_OFF_SWITCH = 'onOffSwitch';

class GpioProperty extends Property {
  constructor(device, name, type) {
    super(device, name, type);
    this.setCachedValue(this.device.gpio.readSync());
    this.device.notifyPropertyChanged(this);
  }

  /**
   * @method setValue
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(value) {
    return new Promise((resolve, reject) => {
      this.device.gpio.write(value ? 1 : 0, (err) => {
        if (err) {
          console.error('GPIO: write for pin:', this.device.name, 'failed');
          console.error(err);
          reject(err);
        } else {
          this.setCachedValue(value);
          console.log('GPIO:', this.name, 'set:', this.name, 'to:', this.value);
          resolve(this.value);
          this.device.notifyPropertyChanged(this);
        }
      });
    });
  }
}

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
      this.gpio = new Gpio(pin, 'out');

      // Unfortunately, the onoff library writes to the direction file
      // even if the direction is already set to out. This has a side
      // effect of setting the value to zero, so for the time being
      // we reflect that behaviour.
      if (pinConfig.value === undefined) {
        pinConfig.value = 0;
      }

      if (pinConfig.value !== undefined) {
        this.gpio.writeSync(pinConfig.value);
      }
    }
    pinConfig.pin = pin;
    this.pinConfig = pinConfig;
    this.name = pinConfig.name;

    console.log('GPIO:', this.pinConfig);

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
    this.properties.set('on',
      new GpioProperty(this, 'on', 'boolean', this.pinConfig.pin));
  }
}

class GpioAdapter extends Adapter {
  constructor(adapterManager, gpioConfig) {
    super(adapterManager, 'GPIO');

    for (var pin in gpioConfig.pins) {
      new GpioDevice(this, pin, gpioConfig.pins[pin]);
    }
    adapterManager.addAdapter(this);
  }
}

function loadGpioAdapter(adapterManager, gpioConfig) {
  new GpioAdapter(adapterManager, gpioConfig);
}

module.exports = loadGpioAdapter;
