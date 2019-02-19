/**
 * mock-adapter.js - Mock Adapter.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const {Adapter, Device, Property} = require('gateway-addon');
const express = require('express');

class MockProperty extends Property {
  constructor(device, name, propertyDescription) {
    super(device, name, propertyDescription);
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
      if (/^rejectProperty/.test(this.name)) {
        reject('Read-only property');
        return;
      }
      super.setValue(value).then((updatedValue) => {
        resolve(updatedValue);
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
    this['@context'] = deviceDescription['@context'];
    this['@type'] = deviceDescription['@type'];
    this.description = deviceDescription.description;
    this.baseHref = `http://127.0.0.1:${adapter.port}`;
    for (const propertyName in deviceDescription.properties) {
      const propertyDescription = deviceDescription.properties[propertyName];
      const property =
        new MockProperty(this, propertyName, propertyDescription);
      this.properties.set(propertyName, property);
    }

    for (const actionName in deviceDescription.actions) {
      this.addAction(actionName, deviceDescription.actions[actionName]);
    }

    for (const eventName in deviceDescription.events) {
      this.addEvent(eventName, deviceDescription.events[eventName]);
    }
  }

  requestAction(actionId, actionName, input) {
    if (actionName === 'rejectRequest') {
      return Promise.reject();
    }
    return super.requestAction(actionId, actionName, input);
  }

  removeAction(actionId, actionName) {
    if (actionName === 'rejectRemove') {
      return Promise.reject();
    }
    return super.removeAction(actionId, actionName);
  }

  performAction(action) {
    return new Promise((resolve, _reject) => {
      action.start();
      action.finish();
      resolve();
    });
  }
}

class MockAdapter extends Adapter {
  constructor(addonManager, packageName) {
    super(addonManager, packageName, packageName);
    addonManager.addAdapter(this);

    this.port = 12345;
    this.app = express();
    this.app.all('/*', (req, rsp) => {
      rsp.send(`${req.method} ${req.path}`);
    });
    this.server = this.app.listen(this.port);
  }

  /**
   * For cleanup between tests. Returns a promise which resolves
   * when all of the state has been cleared.
   */
  clearState() {
    this.actions = {};

    return Promise.all(
      Object.keys(this.devices).map((deviceId) => {
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
        reject(`Device: ${deviceId} already exists.`);
      } else {
        const device = new MockDevice(this, deviceId, deviceDescription);
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
      const device = this.devices[deviceId];
      if (device) {
        this.handleDeviceRemoved(device);
        resolve(device);
      } else {
        reject(`Device: ${deviceId} not found.`);
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
      const deviceId = this.pairDeviceId;
      const deviceDescription = this.pairDeviceDescription;
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

    this.removeDevice(device.id).then(() => {
      console.log('MockAdapter: device:', device.id, 'was unpaired.');
    }).catch((err) => {
      console.error('MockAdapter: unpairing', device.id, 'failed');
      console.error(err);
    });
  }

  cancelRemoveThing(device) {
    console.log('MockAdapter:', this.name, 'id', this.id,
                'cancelRemoveThing(', device.id, ')');
  }

  setPin(deviceId, pin) {
    return new Promise((resolve, reject) => {
      if (pin === '1234') {
        resolve();
      } else {
        reject();
      }
    });
  }

  setCredentials(deviceId, username, password) {
    return new Promise((resolve, reject) => {
      if (username === 'test-user' && password === 'Password-1234!') {
        resolve();
      } else {
        reject();
      }
    });
  }

  unload() {
    this.server.close();
    return super.unload();
  }
}

function loadMockAdapter(addonManager, manifest, _errorCallback) {
  new MockAdapter(addonManager, manifest.name);
}

module.exports = loadMockAdapter;
