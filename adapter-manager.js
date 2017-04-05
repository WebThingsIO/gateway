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
var Deferred = require('./deferred');

/**
 * @class AdapterManager
 * @classdesc The AdapterManager will load any adapters from the 'adapters'
 * directory. See loadAdapters() for details.
 */
class AdapterManager extends EventEmitter {

  constructor() {
    super();
    this.adapters = {};
    this.devices = {};
    this.deferredAdd = null;
    this.deferredRemove = null;
  }

  /**
   * Adds an adapter to the collection of adapters managed by AdapterManager.
   * This function is typically called when loading adapters.
   */
  addAdapter(adapter) {
    adapter.name = adapter.constructor.name;
    this.adapters[adapter.id] = adapter;

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

  /**
   * @method addNewDevice
   * Initiates pairing on all of the adapters that support it.
   * The user then presses the "button" on the device to be added.
   * @returns A promise that resolves to the newly added device.
   */
  addNewDevice() {
    var deferredAdd = new Deferred();

    if (this.deferredAdd) {
      deferredAdd.reject('Add already in progress');
    } else if (this.deferredRemove) {
      deferredAdd.reject('Remove already in progress');
    } else {
      this.deferredAdd = deferredAdd;
      for (var adapter of this.adapters) {
        console.log('About to call startPairing on', adapter.name);
        adapter.startPairing();
      }
    }

    return deferredAdd.promise;
  }

  /**
   * @method cancelAddNewDevice
   *
   * Cancels a previous addNewDevice request.
   */
  cancelAddNewDevice() {
    var deferredAdd = this.deferredAdd;

    if (deferredAdd) {
      for (var adapter of this.adapters) {
        adapter.cancelPairing();
      }
      this.deferredAdd = null;
      deferredAdd.reject('addNewDevice cancelled');
    }
  }

  /**
   * @method cancelAddSomeDevice
   *
   * Cancels a previous removeSomeDevice request.
   */
  cancelRemoveSomeDevice() {
    var deferredRemove = this.deferredRemove;
    if (deferredRemove) {
      for (var adapter of this.adapters) {
        adapter.cancelUnpairing();
      }
      this.deferredAdd = null;
      deferredRemove.reject('removeSomeDevice cancelled');
    }
  }

  /**
   * @method getAdapter
   * @returns Returns the adapter with the indicated id.
   */
  getAdapter(id) {
    return this.adapters[id];
  }

  /**
   * @method getAdapters
   * @returns Returns a dictionary of the loaded adapters. The dictionary 
   *          key corresponds to the adapter id. 
   */
  getAdapters() {
    return this.adapters;
  }

  /**
   * @method getDevice
   * @returns Returns the device with the indicated id.
   */
  getDevice(id) {
    return this.devices[id];
  }

  /**
   * @method getDevices
   * @returns Returns an dictionary of all of the known devices. 
   *          The dictionary key corresponds to the device id. 
   */
  getDevices() {
    return this.devices;
  }

  /**
   * @method handleDeviceAdded
   *
   * Called when the indicated device has been added to an adapter.
   */
  handleDeviceAdded(device) {
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

    // If this device was added in response to addNewDevice, then
    // We need to cancel pairing mode on all of the "other" adapters.

    var deferredAdd = this.deferredAdd;
    if (deferredAdd) {
      this.deferredAdd = null;
      for (var adapter of this.adapters) {
        if (adapter !== device.adapter) {
          adapter.cancelPairing();
        }
      }
      deferredAdd.resolve(device);
    }
  }

  /**
   * @method handleDeviceRemoved
   * Called when the indicated device has been removed an adapter.
   */
  handleDeviceRemoved(device) {
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

    // If this device was removed in response to removeSomeDevice, then
    // We need to cancel unpairing mode on all of the "other" adapters.

    var deferredRemove = this.deferredRemove;
    if (deferredRemove) {
      this.deferredRemove = null;
      for (var adapter of this.adapters) {
        if (adapter !== device.adapter) {
          adapter.cancelUnpairing();
        }
      }
      deferredRemove.resolve(device);
    }
  }

  /** 
   * @method loadAdapters 
   * Loads all of the adapters from the adapters directory.
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

  /**
   * @method removeSomeDevice
   * Initiates unpairing on all of the adapters that support it.
   * The user then presses the "button" on the device to be removed.
   * @returns A promise that resolves to the removed device.
   */
  removeSomeDevice() {
    var deferredRemove = new Deferred();

    if (this.deferredAdd) {
      deferredRemove.reject('Add already in progress');
    } else if (this.deferredRemove) {
      deferredRemove.reject('Remove already in progress');
    } else {
      this.deferredRemove = deferredRemove;
      for (var adapter of this.adapters) {
        adapter.startUnpairing();
      }
    }

    return deferredRemove.promise;
  }

  /**
   * @method unloadAdapters 
   * Unloads all of the loaded adapters. 
   */
  unloadAdapters() {
    for (var adapterId in this.adapters) {
      var adapter = this.adapters[adapterId];
      console.log('Unloading', adapter.name);
      adapter.unload();
    }
  }
}

module.exports = new AdapterManager();
