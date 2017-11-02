/**
 * example-plugin-adapter.js - Example adapter implemented as a plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Adapter = require('../adapter');
var Device = require('../device');
var Property = require('../property');

class ExampleProperty extends Property {
  constructor(device, name, propertyDescription) {
    super(device, name, propertyDescription.type);
    this.unit = propertyDescription.unit;
    this.description = propertyDescription.description;
    this.setCachedValue(propertyDescription.value);
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
      super.setValue(value).then((updatedValue) => {
        resolve(updatedValue);
        this.device.notifyPropertyChanged(this);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

class ExampleDevice extends Device {
  constructor(adapter, id, deviceDescription) {
    super(adapter, id);
    this.name = deviceDescription.name;
    this.type = deviceDescription.type;
    this.description = deviceDescription.description;
    for (var propertyName in deviceDescription.properties) {
      var propertyDescription = deviceDescription.properties[propertyName];
      var property = new ExampleProperty(this, propertyName,
                                         propertyDescription);
      this.properties.set(propertyName, property);
    }
  }
}

class ExamplePluginAdapter extends Adapter {
  constructor(adapterManager, packageName) {
    super(adapterManager, 'ExamplePlugin', packageName);
    adapterManager.addAdapter(this);
  }

  /**
   * For cleanup between tests.
   */
  clearState() {
    this.actions = {};

    for (let deviceId in this.devices) {
      this.removeDevice(deviceId);
    }
  }

  /**
   * Add a ExampleDevice to the ExamplePluginAdapter
   *
   * @param {String} deviceId ID of the device to add.
   * @return {Promise} which resolves to the device added.
   */
  addDevice(deviceId, deviceDescription) {
    return new Promise((resolve, reject) => {
      if (deviceId in this.devices) {
        reject('Device: ' + deviceId + ' already exists.');
      } else {
        var device = new ExampleDevice(this, deviceId, deviceDescription);
        this.handleDeviceAdded(device);
        resolve(device);
      }
    });
  }

  /**
   * Remove a ExampleDevice from the ExamplePluginAdapter.
   *
   * @param {String} deviceId ID of the device to remove.
   * @return {Promise} which resolves to the device removed.
   */
  removeDevice(deviceId) {
    return new Promise((resolve, reject) => {
      var device = this.devices[deviceId];
      if (device) {
        this.handleDeviceRemoved(device);
        resolve(device);
      } else {
        reject('Device: ' + deviceId + ' not found.');
      }
    });
  }

  pairDevice(deviceId, deviceDescription) {
    this.pairDeviceId = deviceId;
    this.pairDeviceDescription = deviceDescription;
  }

  unpairDevice(deviceId) {
    this.unpairDeviceId = deviceId;
  }

  // eslint-disable-next-line no-unused-vars
  startPairing(timeoutSeconds) {
    console.log('ExamplePluginAdapter:', this.name,
                'id', this.id, 'pairing started');
    if (this.pairDeviceId) {
      var deviceId = this.pairDeviceId;
      var deviceDescription = this.pairDeviceDescription;
      this.pairDeviceId = null;
      this.pairDeviceDescription = null;
      this.addDevice(deviceId, deviceDescription).then(() => {
        console.log('ExamplePluginAdapter: device:', deviceId, 'was paired.');
      }).catch((err) => {
        console.error('ExamplePluginAdapter: unpairing', deviceId, 'failed');
        console.error(err);
      });
    }
  }

  cancelPairing() {
    console.log('ExamplePluginAdapter:', this.name, 'id', this.id,
                'pairing cancelled');
  }

  removeThing(device) {
    console.log('ExamplePluginAdapter:', this.name, 'id', this.id,
                'removeThing(', device.id, ') started');
    if (this.unpairDeviceId) {
      var deviceId = this.unpairDeviceId;
      this.unpairDeviceId = null;
      this.removeDevice(deviceId).then(() => {
        console.log('ExamplePluginAdapter: device:', deviceId, 'was unpaired.');
      }).catch((err) => {
        console.error('ExamplePluginAdapter: unpairing', deviceId, 'failed');
        console.error(err);
      });
    }
  }

  cancelRemoveThing(device) {
    console.log('ExamplePluginAdapter:', this.name, 'id', this.id,
                'cancelRemoveThing(', device.id, ')');
  }
}

function loadExamplePluginAdapter(adapterManager, manifest, _errorCallback) {
  var adapter = new ExamplePluginAdapter(adapterManager, manifest.name);
  var device = new ExampleDevice(adapter, 'example-plug-2', {
    name: 'example-plug-2',
    type: 'onOffSwitch',
    description: 'Example Plugin Device',
    properties: {
      on: {
        name: 'on',
        type: 'boolean',
        value: false,
      },
    },
  });
  adapter.handleDeviceAdded(device);
}

module.exports = loadExamplePluginAdapter;
