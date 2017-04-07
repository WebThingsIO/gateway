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

  constructor(adapterManager, id) {
    this.manager = adapterManager;
    this.id = id;
    this.name = this.constructor.name;
    this.devices = {};

    // We assume that the adapter is ready right away. If, for some reason
    // a particular adapter (like ZWave) needs some time, then it should
    // set ready to false in its constructor.
    this.ready = true;
    console.log('Adapter:', this.name, 'id', id, 'created');
  }

  /**
   * @method getId
   * @returns the id of this adapter.
   */
  getId() {
    return this.id;
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
      'id': this.id,
      'name': this.name,
      'ready': this.ready,
    };
  }

  /**
   * @method deviceAdded
   *
   * Called to indicated that a device is now being managed by this adapter.
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

  startPairing() {
    console.log('Adapter:', this.name, 'id', this.id, 'pairing started');
  }

  cancelPairing() {
    console.log('Adapter:', this.name, 'id', this.id, 'pairing cancelled');
  }

  startUnpairing() {
    console.log('Adapter:', this.name, 'id', this.id, 'unpairing started');
  }

  cancelUnpairing() {
    console.log('Adapter:', this.name, 'id', this.id, 'unpairing cancelled');
  }

  unload() {
    console.log('Adapter:', this.name, 'unloaded');
  }
}

exports.Adapter = Adapter;
