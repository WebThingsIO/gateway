/**
 *
 * TplightAdapter - an adapter for controlling TP-Link Smart Lights
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Adapter = require('../adapter');
var Bulb = require('tplink-lightbulb');
var Device = require('../device');
var Property = require('../property');

const THING_TYPE_ON_OFF_SWITCH = 'onOffSwitch';

class TplightProperty extends Property {
  constructor(device, name, type, value) {
    super(device, name, type);
    this.setCachedValue(value);
  }

  /**
   * @method setValue
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(value) {
    this.setCachedValue(value);
    return this.device.sendProperties().then(() => {
      // Sort of incorrect because the device should already know
      this.device.notifyPropertyChanged(this);
      return value;
    });
  }
}

class TplightDevice extends Device {
  constructor(adapter, id, bulb) {
    super(adapter, id);

    this.bulb = bulb;
    this.name = bulb.name;

    this.type = THING_TYPE_ON_OFF_SWITCH;
    var state = bulb._sysinfo.light_state;
    var on = !!state.on_off;
    if (state.dft_on_state) {
      state = state.dft_on_state;
    }
    var hue = state.hue;
    var saturation = state.saturation;
    var brightness = state.brightness;
    var colorTemp = state.color_temp;
    this.properties.set('on', new TplightProperty(this, 'on', 'boolean', on));
    this.properties.set('hue', new TplightProperty(this, 'hue', 'number', hue));
    this.properties.set('saturation', new TplightProperty(this, 'saturation',
                        'number', saturation));
    this.properties.set('brightness', new TplightProperty(this, 'brightness',
                        'number', brightness));
    this.properties.set('colorTemp', new TplightProperty(this, 'colorTemp',
                        'number', colorTemp));

    this.requestInFlight = false;

    this.adapter.handleDeviceAdded(this);
  }

  sendProperties() {
    if (this.requestInFlight) {
      return Promise.reject('tplight: request in flight');
    }

    this.requestInFlight = true;
    return this.bulb.set(this.properties.get('on').value, 0, {
      saturation: this.properties.get('saturation').value,
      brightness: this.properties.get('brightness').value,
      hue: this.properties.get('hue').value,
      color_temp: this.properties.get('colorTemp').value
    }).then(() => {
      this.requestInFlight = false;
    }).catch(e => {
      console.error('tplight error:', e);
      this.requestInFlight = false;
    });
  }
}

class TplightAdapter extends Adapter {
  constructor(adapterManager) {
    super(adapterManager, 'tplight');
    this.lights = {};

    this.scan = Bulb.scan().on('light', light => {
      var id = 'tplight-' + light.deviceId;
      if (this.lights[id]) {
        return;
      }
      this.lights[id] = new TplightDevice(this, id, light);
    });

    adapterManager.addAdapter(this);
  }

  unload() {
    super.unload();
    if (this.scan) {
      this.scan.stop();
      this.scan = null;
    }
  }
}

function loadTplightAdapter(adapterManager) {
  /* jshint -W031 */
  new TplightAdapter(adapterManager);
}

module.exports = loadTplightAdapter;

