/**
 * mock-adapter.js - Mock Adapter.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Adapter = require('../../adapters/adapter');
var Device = require('../../adapters/device');
var Property = require('../../adapters/property');

class MockProperty extends Property {
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

class MockDevice extends Device {
  constructor(adapter, id, deviceDescription) {
    super(adapter, id);
    this.name = deviceDescription.name;
    this.type = deviceDescription.type;
    this.description = deviceDescription.description;
    for (var propertyName in deviceDescription.properties) {
      var propertyDescription = deviceDescription.properties[propertyName];
      var property = new MockProperty(this, propertyName, propertyDescription);
      this.properties.set(propertyName, property);
    }
  }
}

class MockAdapter extends Adapter {
  constructor(adapterManager, packageName) {
    super(adapterManager, packageName, packageName);
    adapterManager.addAdapter(this);
  }

  /**
   * For cleanup between tests. Returns a promise which resolves
   * when all of the state has been cleared.
   */
  clearState() {
    this.actions = {};

    return Promise.all(
      Object.keys(this.devices).map(deviceId => {
        return this.removeDevice(deviceId);
      })
    );
  }

  /**
   * Add a MockDevice to the MockAdapter
   *
   * @param {String} deviceId ID of the device to add.
   * @return {Promise} which resolves to the device added.
   */
  addDevice(deviceId, deviceDescription) {
    return new Promise((resolve, reject) => {
      if (deviceId in this.devices) {
        reject('Device: ' + deviceId + ' already exists.');
      } else {
        var device = new MockDevice(this, deviceId, deviceDescription);
        this.handleDeviceAdded(device);
        resolve(device);
      }
    });
  }

  /**
   * Remove a MockDevice from the MockAdapter.
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
    console.log('MockAdapter:', this.name, 'id', this.id, 'pairing started');
    if (this.pairDeviceId) {
      var deviceId = this.pairDeviceId;
      var deviceDescription = this.pairDeviceDescription;
      this.pairDeviceId = null;
      this.pairDeviceDescription = null;
      this.addDevice(deviceId, deviceDescription).then(() => {
        console.log('MockAdapter: device:', deviceId, 'was paired.');
      }).catch((err) => {
        console.error('MockAdapter: unpairing', deviceId, 'failed');
        console.error(err);
      });
    }
  }

  cancelPairing() {
    console.log('MockAdapter:', this.name, 'id', this.id,
                'pairing cancelled');
  }

  removeThing(device) {
    console.log('MockAdapter:', this.name, 'id', this.id,
                'removeThing(', device.id, ') started');
    if (this.unpairDeviceId) {
      var deviceId = this.unpairDeviceId;
      this.unpairDeviceId = null;
      this.removeDevice(deviceId).then(() => {
        console.log('MockAdapter: device:', deviceId, 'was unpaired.');
      }).catch((err) => {
        console.error('MockAdapter: unpairing', deviceId, 'failed');
        console.error(err);
      });
    }
  }

  cancelRemoveThing(device) {
    console.log('MockAdapter:', this.name, 'id', this.id,
                'cancelRemoveThing(', device.id, ')');
  }
}

function loadMockAdapter(adapterManager, manifest, _errorCallback) {
  new MockAdapter(adapterManager, manifest.name);
}

module.exports = loadMockAdapter;
