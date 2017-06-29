/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Adapter = require('../adapter');
var Device = require('../device');
var Property = require('../property');

const HID = require('node-hid');

class DiscoveredDevice extends Device {
  constructor(adapter, deviceInfo) {
    const { vendorId, productId } = deviceInfo;
    console.log('new DiscoveredDevice')
    super(adapter, `${vendorId}-${productId}`);
    this.info = deviceInfo;
    this.info.isDiscovery = true;
  }
}

class HIDAdapter extends Adapter {
  // eslint-disable-next-line no-unused-vars
  constructor(adapterManager, testConfigs) {
    super(adapterManager, 'HID');
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
   * Add a MockDevice to the HIDAdapter
   *
   * @param {String} deviceId ID of the device to add.
   * @return {Promise} which resolves to the device added.
   */
  addDevice(deviceId, deviceDescription) {
    return new Promise((resolve, reject) => {
      // if (deviceId in this.devices) {
      //   reject('Device: ' + deviceId + ' already exists.');
      // } else {
      //   var device = new MockDevice(this, deviceId, deviceDescription);
      //   this.handleDeviceAdded(device);
      //   resolve(device);
      // }
    });
  }

  /**
   * Remove a MockDevice from the HIDAdapter.
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
    console.log('HIDAdapter:', this.name, 'id', this.id, 'pairing started');

    // Super setTimeout hack to get around WS not being ready.
    setTimeout(() => {
      const devices = HID.devices()
      devices.forEach(device => {
        const discoveredDevice = new DiscoveredDevice(this, device);
        this.handleDeviceDiscovered(discoveredDevice);
      });
    }, 2000);


    if (this.pairDeviceId) {
      var deviceId = this.pairDeviceId;
      var deviceDescription = this.pairDeviceDescription;
      this.pairDeviceId = null;
      this.pairDeviceDescription = null;
      this.addDevice(deviceId, deviceDescription).then(() => {
        console.log('HIDAdapter: device:', deviceId, 'was paired.');
      }).catch((err) => {
        console.error('HIDAdapter: unpairing', deviceId, 'failed');
        console.error(err);
      });
    }
  }

  cancelPairing() {
    console.log('HIDAdapter:', this.name, 'id', this.id,
                'pairing cancelled');
  }

  removeThing(device) {
    console.log('HIDAdapter:', this.name, 'id', this.id,
                'removeThing(', device.id, ') started');
    if (this.unpairDeviceId) {
      var deviceId = this.unpairDeviceId;
      this.unpairDeviceId = null;
      this.removeDevice(deviceId).then(() => {
        console.log('HIDAdapter: device:', deviceId, 'was unpaired.');
      }).catch((err) => {
        console.error('HIDAdapter: unpairing', deviceId, 'failed');
        console.error(err);
      });
    }
  }

  cancelRemoveThing(device) {
    console.log('HIDAdapter:', this.name, 'id', this.id,
                'cancelRemoveThing(', device.id, ')');
  }
}

function loadHIDAdapter(adapterManager, testConfigs) {
  new HIDAdapter(adapterManager, testConfigs);
}

module.exports = loadHIDAdapter;
