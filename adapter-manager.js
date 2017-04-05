/**
 * Manages all of the Adapters used in the system.
 *
 * @module AdapterManager
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

/**
 * @class AdapterManager
 * @classdesc The AdapterManager will load any adapters from the 'adapters'
 * directory. See loadAdapters() for details.
 */
class AdapterManager extends EventEmitter {

  constructor() {
    super();
    this.adapters = [];
    this.devices = {};
  }

  /**
   * Adds an adapter to the collection of adapters managed by AdapterManager.
   * This function is typically called when loading adapters.
   */
  addAdapter(adapter) {
    adapter.name = adapter.constructor.name;
    this.adapters.push(adapter);

    /**
     * Adapter added event.
     *
     * This is event is emitted whenever a new adapter is loaded.
     *
     * @event adapter-added
     * @type  {Adapter}
     */
    this.emit('adapter-added', adapter);
  }

  addDevice(device) {
    this.devices[device.id] = device;

    /**
     * Device added event.
     *
     * This event is emitted whenever a new device is added.
     *
     * @event device-added
     * @type  {Device}
     */
    this.emit('device-added', device);
  }

  removeDevice(device) {
    delete this.devices[device.id];

    /**
     * Device removed event.
     *
     * This event is emitted whenever a new device is removed.
     *
     * @event device-added
     * @type  {Device}
     */
    this.emit('device-removed', device);
  }

  /**
   * @method discoverAdapters
   * @returns A promise that resolves to an array of known adapters.
   */
  discoverAdapters() {
    var adapterManager = this;
    return new Promise(function(resolve, reject) {
      resolve(adapterManager.adapters);
    });
  }

  /**
   * @method discoverDevices
   * @returns A promise that resolves to dictionary of all known devices.
   */
  discoverDevices() {
    var adapterManager = this;
    return new Promise(function(resolve, reject) {
      resolve(adapterManager.devices);
    });
  }

  /**
   * @method getAdapter
   * @returns te adapter with the indicated 'id'.
   */
  getAdapter(id) {
    for (var adapter of this.adapters) {
      if (adapter.getId() == id) {
        return adapter;
      }
    }
    return undefined;
  }

  /**
   * @method getAdapters
   * @returns an array of known adapters.
   */
  getAdapters() {
    return this.adapters;
  }

  /**
   * @method getDevice
   * @returns the device with the indicated 'id'.
   */
  getDevice(id) {
    return this.devices[id];
  }

  /**
   * @method getDevices
   * @returns an array of known devices.
   */
  getDevices() {
    return this.devices;
  }

  /**
   * Loads all of the adapters from the adapters directory.
   * @method loadAdapters
   *
   */
  loadAdapters() {
    var adapterDir = './adapters';
    var adapterManager = this;
    fs.readdir(adapterDir, function fileList(err, filenames) {
      if (err) {
        console.error(err);
        return;
      }
      for (var filename of filenames) {
        let adapterFilename = adapterDir + '/' + filename;
        if (!fs.lstatSync(adapterFilename).isDirectory() &&
          path.extname(filename) !== '.js') {
          continue;
        }
        console.log('Loading Adapters from', adapterFilename);

        let adapterLoader = require(adapterFilename);
        adapterLoader(adapterManager);
      }
    });
  }

  unloadAdapters() {
    for (var adapter of this.adapters) {
      console.log('Unloading', adapter.name);
      adapter.unload();
    }
  }
}

module.exports = new AdapterManager();
