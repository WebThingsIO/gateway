/**
 * @module Adapter base class.
 *
 * Manages Adapter data model and business logic.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

/**
 * Base class for adapters, which manage devices.
 * @class Adapter
 *
 */
class Adapter {

  constructor(addonManager, id, packageName) {
    this.manager = addonManager;
    this.id = id;
    this.packageName = packageName;
    this.name = this.constructor.name;
    this.devices = {};
    this.actions = {};

    // We assume that the adapter is ready right away. If, for some reason
    // a particular adapter (like ZWave) needs some time, then it should
    // set ready to false in its constructor.
    this.ready = true;
  }

  dump() {
    console.log('Adapter:', this.name, '- dump() not implemented');
  }

  /**
   * @method getId
   * @returns the id of this adapter.
   */
  getId() {
    return this.id;
  }

  getPackageName() {
    return this.packageName;
  }

  getDevice(id) {
    return this.devices[id];
  }

  getDevices() {
    return this.devices;
  }

  getName() {
    return this.name;
  }

  isReady() {
    return this.ready;
  }

  asDict() {
    return {
      'id': this.getId(),
      'name': this.getName(),
      'ready': this.isReady(),
    };
  }

  /**
   * @method deviceAdded
   *
   * Called to indicate that a device is now being managed by this adapter.
   */
  handleDeviceAdded(device) {
    this.devices[device.id] = device;
    this.manager.handleDeviceAdded(device);
  }

  /**
   * @method deviceRemoved
   *
   * Called to indicate that a device is no longer managed by this adapter.
   */
  handleDeviceRemoved(device) {
    delete this.devices[device.id];
    this.manager.handleDeviceRemoved(device);
  }

  // eslint-disable-next-line
  startPairing(timeoutSeconds) {
    console.log('Adapter:', this.name, 'id', this.id, 'pairing started');
  }

  cancelPairing() {
    console.log('Adapter:', this.name, 'id', this.id, 'pairing cancelled');
  }

  removeThing(device) {
    console.log('Adapter:', this.name, 'id', this.id,
                'removeThing(', device.id, ') started');
  }

  cancelRemoveThing(device) {
    console.log('Adapter:', this.name, 'id', this.id,
                'cancelRemoveThing(', device.id, ')');
  }

  /**
   * Unloads an adapter.
   *
   * @returns a promise which resolves when the adapter has
   *          finished unloading.
   */
  unload() {
    console.log('Adapter:', this.name, 'unloaded');
    return Promise.resolve();
  }
}

module.exports = Adapter;
