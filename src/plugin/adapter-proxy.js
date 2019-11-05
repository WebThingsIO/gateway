/**
 * @module AdapterProxy base class.
 *
 * Manages Adapter data model and business logic.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const {Adapter} = require('gateway-addon');
const Deferred = require('../deferred');
const DeviceProxy = require('./device-proxy');
const {MessageType} = require('gateway-addon').Constants;

const DEBUG = false;

/**
 * Class used to describe an adapter from the perspective
 * of the gateway.
 */
class AdapterProxy extends Adapter {

  constructor(addonManager, adapterId, name, packageName, plugin) {
    super(addonManager, adapterId, packageName);
    this.name = name;
    this.plugin = plugin;
    this.deferredMock = null;
    this.unloadCompletedPromise = null;
    this.eventHandlers = {};
  }

  startPairing(timeoutSeconds) {
    DEBUG && console.log('AdapterProxy: startPairing',
                         this.name, 'id', this.id);
    this.sendMsg(
      MessageType.ADAPTER_START_PAIRING_COMMAND,
      {
        timeout: timeoutSeconds,
      }
    );
  }

  cancelPairing() {
    DEBUG && console.log('AdapterProxy: cancelPairing',
                         this.name, 'id', this.id);
    this.sendMsg(MessageType.ADAPTER_CANCEL_PAIRING_COMMAND, {});
  }

  removeThing(device) {
    DEBUG && console.log('AdapterProxy:', this.name, 'id', this.id,
                         'removeThing:', device.id);
    this.sendMsg(
      MessageType.ADAPTER_REMOVE_DEVICE_REQUEST,
      {
        deviceId: device.id,
      }
    );
  }

  cancelRemoveThing(device) {
    DEBUG && console.log('AdapterProxy:', this.name, 'id', this.id,
                         'cancelRemoveThing:', device.id);
    this.sendMsg(
      MessageType.ADAPTER_CANCEL_REMOVE_DEVICE_COMMAND,
      {
        deviceId: device.id,
      }
    );
  }

  sendMsg(methodType, data, deferred) {
    data.adapterId = this.id;
    return this.plugin.sendMsg(methodType, data, deferred);
  }

  /**
   * Unloads an adapter.
   *
   * @returns a promise which resolves when the adapter has
   *          finished unloading.
   */
  unload() {
    if (this.unloadCompletedPromise) {
      console.error('AdapterProxy: unload already in progress');
      return Promise.reject();
    }
    this.unloadCompletedPromise = new Deferred();
    this.sendMsg(
      MessageType.ADAPTER_UNLOAD_REQUEST,
      {
        adapterId: this.id,
      }
    );
    return this.unloadCompletedPromise.promise;
  }

  /**
   * Set the PIN for the given device.
   *
   * @param {String} deviceId ID of the device
   * @param {String} pin PIN to set
   *
   * @returns a promise which resolves when the PIN has been set.
   */
  setPin(deviceId, pin) {
    return new Promise((resolve, reject) => {
      console.log('AdapterProxy: setPin:', pin, 'for:', deviceId);

      const device = this.getDevice(deviceId);
      if (!device) {
        reject('Device not found');
        return;
      }

      const deferredSet = new Deferred();

      deferredSet.promise.then((device) => {
        resolve(device);
      }).catch(() => {
        reject();
      });

      this.sendMsg(
        MessageType.DEVICE_SET_PIN_REQUEST,
        {
          deviceId,
          pin,
        },
        deferredSet
      );
    });
  }

  /**
   * Set the credentials for the given device.
   *
   * @param {String} deviceId ID of the device
   * @param {String} username Username to set
   * @param {String} password Password to set
   *
   * @returns a promise which resolves when the credentials have been set.
   */
  setCredentials(deviceId, username, password) {
    return new Promise((resolve, reject) => {
      console.log('AdapterProxy: setCredentials:', username, password, 'for:',
                  deviceId);

      const device = this.getDevice(deviceId);
      if (!device) {
        reject('Device not found');
        return;
      }

      const deferredSet = new Deferred();

      deferredSet.promise.then((device) => {
        resolve(device);
      }).catch(() => {
        reject();
      });

      this.sendMsg(
        MessageType.DEVICE_SET_CREDENTIALS_REQUEST,
        {
          deviceId,
          username,
          password,
        },
        deferredSet
      );
    });
  }

  // The following methods are added to support using the
  // MockAdapter as a plugin.

  clearState() {
    if (this.deferredMock) {
      const err = 'clearState: deferredMock already in progress';
      console.error(err);
      return Promise.reject(err);
    }
    this.deferredMock = new Deferred();
    this.sendMsg(
      MessageType.MOCK_ADAPTER_CLEAR_STATE_REQUEST,
      {
        adapterId: this.id,
      }
    );
    return this.deferredMock.promise;
  }

  addDevice(deviceId, deviceDescription) {
    if (this.deferredMock) {
      const err = 'addDevice: deferredMock already in progress';
      console.error(err);
      return Promise.reject(err);
    }

    // For the MockDevice we create the device now, so that we can
    // deliver the propertyChanged notifications that show up before
    // the handleDeviceAdded notification comes in. The device we
    // create now will be replaced when the handleDeviceAdded
    // notification shows up.

    this.devices[deviceId] = new DeviceProxy(this, deviceDescription);

    this.deferredMock = new Deferred();
    this.sendMsg(
      MessageType.MOCK_ADAPTER_ADD_DEVICE_REQUEST,
      {
        deviceId: deviceId,
        deviceDescr: deviceDescription,
      }
    );
    return this.deferredMock.promise;
  }

  removeDevice(deviceId) {
    if (this.deferredMock) {
      const err = 'removeDevice: deferredMock already in progress';
      console.error(err);
      return Promise.reject(err);
    }
    this.deferredMock = new Deferred();

    // We need the actual device object when we resolve the promise
    // so we stash it here since it gets removed under our feet.
    this.deferredMock.device = this.getDevice(deviceId);
    this.sendMsg(
      MessageType.MOCK_ADAPTER_REMOVE_DEVICE_REQUEST,
      {
        deviceId: deviceId,
      }
    );
    return this.deferredMock.promise;
  }

  pairDevice(deviceId, deviceDescription) {
    this.sendMsg(
      MessageType.MOCK_ADAPTER_PAIR_DEVICE_COMMAND,
      {
        deviceId: deviceId,
        deviceDescr: deviceDescription,
      }
    );
  }

  unpairDevice(deviceId) {
    this.sendMsg(
      MessageType.MOCK_ADAPTER_UNPAIR_DEVICE_COMMAND,
      {
        deviceId: deviceId,
      }
    );
  }
}

module.exports = AdapterProxy;
