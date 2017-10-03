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

var config = require('config');
const Constants = require('./constants');
var EventEmitter = require('events').EventEmitter;
var Deferred = require('./adapters/deferred');
const PluginClient = require('./adapters/plugin/plugin-client');
const PluginServer = require('./adapters/plugin/plugin-server');

// Use webpack provided require for dynamic includes from the bundle  .
const dynamicRequire = (() => {
  if (typeof __non_webpack_require__ !== 'undefined') {
    // eslint-disable-next-line no-undef
    return __non_webpack_require__;
  }
  return require;
})();


/**
 * @class AdapterManager
 * @classdesc The AdapterManager will load any adapters from the 'adapters'
 * directory. See loadAdapters() for details.
 */
class AdapterManager extends EventEmitter {

  constructor() {
    super();
    this.adapters = new Map();
    this.devices = {};
    this.deferredAdd = null;
    this.deferredRemove = null;
    this.adaptersLoaded = false;
    this.deferredWaitForAdapter = new Map();
    this.pluginServer = null;
  }

  /**
   * Adds an adapter to the collection of adapters managed by AdapterManager.
   * This function is typically called when loading adapters.
   */
  addAdapter(adapter) {
    if (!adapter.name) {
      adapter.name = adapter.constructor.name;
    }
    this.adapters.set(adapter.id, adapter);

    /**
     * Adapter added event.
     *
     * This is event is emitted whenever a new adapter is loaded.
     *
     * @event adapterAdded
     * @type  {Adapter}
     */
    this.emit(Constants.ADAPTER_ADDED, adapter);

    var deferredWait = this.deferredWaitForAdapter.get(adapter.id);
    if (deferredWait) {
      this.deferredWaitForAdapter.delete(adapter.id);
      deferredWait.resolve(adapter);
    }
  }

  /**
   * @method addNewThing
   * Initiates pairing on all of the adapters that support it.
   * The user then presses the "button" on the device to be added.
   * @returns A promise that resolves to the newly added device.
   */
  addNewThing() {
    var deferredAdd = new Deferred();

    if (this.deferredAdd) {
      deferredAdd.reject('Add already in progress');
    } else if (this.deferredRemove) {
      deferredAdd.reject('Remove already in progress');
    } else {
      this.deferredAdd = deferredAdd;
      var pairingTimeout = config.get('adapterManager.pairingTimeout');
      this.adapters.forEach(adapter => {
        console.log('About to call startPairing on', adapter.name);
        adapter.startPairing(pairingTimeout);
      });
      this.pairingTimeout = setTimeout(() => {
        console.log('Pairing timeout');
        this.emit(Constants.PAIRING_TIMEOUT);
        this.cancelAddNewThing();
      }, pairingTimeout * 1000);
    }

    return deferredAdd.promise;
  }

  /**
   * @method cancelAddNewThing
   *
   * Cancels a previous addNewThing request.
   */
  cancelAddNewThing() {
    var deferredAdd = this.deferredAdd;

    if (this.pairingTimeout) {
      clearTimeout(this.pairingTimeout);
      this.pairingTimeout = null;
    }

    if (deferredAdd) {
      this.adapters.forEach(adapter => {
        adapter.cancelPairing();
      });
      this.deferredAdd = null;
      deferredAdd.reject('addNewThing cancelled');
    }
  }

  /**
   * @method cancelRemoveThing
   *
   * Cancels a previous removeThing request.
   */
  cancelRemoveThing(thingId) {
    var deferredRemove = this.deferredRemove;
    if (deferredRemove) {
      var device = this.getDevice(thingId);
      if (device) {
        var adapter = device.adapter;
        if (adapter) {
          adapter.cancelRemoveThing(device);
        }
      }
      this.deferredRemove = null;
      deferredRemove.reject('removeThing cancelled');
    }
  }

  /**
   * @method getAdapter
   * @returns Returns the adapter with the indicated id.
   */
  getAdapter(adapterId) {
    return this.adapters.get(adapterId);
  }

  /**
   * @method getAdapters
   * @returns Returns a Map of the loaded adapters. The dictionary
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
   * @method getThings
   * @returns Returns an dictionary of all of the known things.
   *          The dictionary key corresponds to the device id.
   */
  getThings() {
    var things = [];
    for (var thingId in this.devices) {
      things.push(this.getThing(thingId));
    }
    return things;
  }

  /**
   * @method getThing
   * @returns Returns the thing with the indicated id.
   */
  getThing(thingId) {
    var device = this.getDevice(thingId);
    if (device) {
      return device.asThing();
    }
  }

  /**
   * @method getPropertyDescriptions
   * @returns Retrieves all of the properties associated with the thing
   *          identified by `thingId`.
   */
  getPropertyDescriptions(thingId) {
    var device = this.getDevice(thingId);
    if (device) {
      return device.getPropertyDescriptions();
    }
  }

  /**
   * @method getPropertyDescription
   * @returns Retrieves the property named `propertyName` from the thing
   *          identified by `thingId`.
   */
  getPropertyDescription(thingId, propertyName) {
    var device = this.getDevice(thingId);
    if (device) {
      return device.getPropertyDescription(propertyName);
    }
  }

  /**
   * @method getProperty
   * @returns a promise which resolves to the retrieved value of `propertyName`
   *          from the thing identified by `thingId`.
   */
  getProperty(thingId, propertyName) {
    var device = this.getDevice(thingId);
    if (device) {
      return device.getProperty(propertyName);
    }
    return new Promise((resolve, reject) => {
      reject('getProperty: device: ' + thingId + ' not found.');
    });
  }

  /**
   * @method setProperty
   * @returns a promise which resolves to the updated value of `propertyName`
   *          for the thing identified by `thingId`.
   */
  setProperty(thingId, propertyName, value) {
    var device = this.getDevice(thingId);
    if (device) {
      return device.setProperty(propertyName, value);
    }
    return new Promise((resolve, reject) => {
      reject('setProperty: device: ' + thingId + ' not found.');
    });
  }

  /**
   * @method handleDeviceAdded
   *
   * Called when the indicated device has been added to an adapter.
   */
  handleDeviceAdded(device) {
    this.devices[device.id] = device;
    var thing = device.asThing();

    /**
     * Thing added event.
     *
     * This event is emitted whenever a new thing is added.
     *
     * @event thingAdded
     * @type  {Thing}
     */
    this.emit(Constants.THING_ADDED, thing);

    // If this device was added in response to addNewThing, then
    // We need to cancel pairing mode on all of the "other" adapters.

    var deferredAdd = this.deferredAdd;
    if (deferredAdd) {
      this.deferredAdd = null;
      this.adapters.forEach(adapter => {
        if (adapter !== device.adapter) {
          adapter.cancelPairing();
        }
      });
      if (this.pairingTimeout) {
        clearTimeout(this.pairingTimeout);
        this.pairingTimeout = null;
      }
      deferredAdd.resolve(thing);
    }
  }

  /**
   * @method handleDeviceRemoved
   * Called when the indicated device has been removed an adapter.
   */
  handleDeviceRemoved(device) {
    delete this.devices[device.id];
    var thing = device.asThing();

    /**
     * Thing removed event.
     *
     * This event is emitted whenever a new thing is removed.
     *
     * @event thingRemoved
     * @type  {Thing}
     */
    this.emit(Constants.THING_REMOVED, thing);

    var deferredRemove = this.deferredRemove;
    if (deferredRemove && deferredRemove.adapter == device.adapter) {
      this.deferredRemove = null;
      deferredRemove.resolve(device.id);
    }
  }

  /**
   * @method loadAdapter
   *
   * Loads a single adapter.
   */

   loadAdapter(adapterManager, adapterId, adapterConfig) {
    if (adapterConfig.enabled) {
      console.log('Loading adapters for', adapterId,
                  'from', adapterConfig.path);
      let adapterLoader = dynamicRequire(adapterConfig.path);
      adapterLoader(adapterManager, adapterId, adapterConfig);
    } else {
      console.log('Not loading adapters for', adapterId,
                  '- disabled');
    }
   }

  /**
   * @method loadAdapters
   * Loads all of the configured adapters from the adapters directory.
   */
  loadAdapters() {
    if (this.adaptersLoaded) {
      // This is kind of a hack, but it allows the gateway to restart properly
      // when switching between http and https modes.
      return;
    }
    this.adaptersLoaded = true;

    // Load the Adapter Plugin Server

    this.pluginServer = new PluginServer(this, {verbose: false});

    // Load the Adapters

    var adaptersConfig = config.get(Constants.ADAPTERS_CONFIG);
    for (var adapterId in adaptersConfig) {
      var adapterConfig = adaptersConfig[adapterId];
      if (adapterConfig.plugin) {
        if (adapterConfig.plugin === 'test') {
          // This is a special case where we load the adapter
          // directly into the gateway, but we use IPC comms
          // to talk to the adapter (i.e. for testing)
          var pluginClient = new PluginClient(adapterId, {verbose: false});
          pluginClient.register().then(adapterManagerProxy => {
            console.log('Loading adapter', adapterId, 'as plugin');
            this.loadAdapter(adapterManagerProxy, adapterId, adapterConfig);
          }).catch(err => {
            console.error('Failed to register adapter with gateway');
            console.error(err);
          });
        } else {
          // This is the normal plugin adapter case, and we
          // currently don't need to do anything. We assume
          // that the adapter is started elsewhere.
        }
      } else {
        // Load this adapter directly into the gateway.
        this.loadAdapter(this, adapterId, adapterConfig);
      }
    }
  }

  /**
   * @method removeThing
   *
   * Initiates removing a particular device.
   * @returns A promise that resolves to the device which was actually removed.
   * Note that it's possible that the device actually removed might
   * not be the same as the one requested. This can occur with zwave for
   * example if the user presses the button on a device which is different
   * from the one that they requested removal of.
   */
   removeThing(thingId) {
    var deferredRemove = new Deferred();

    if (this.deferredAdd) {
      deferredRemove.reject('Add already in progress');
    } else if (this.deferredRemove) {
      deferredRemove.reject('Remove already in progress');
    } else {
      var device = this.getDevice(thingId);
      if (device) {
        deferredRemove.adapter = device.adapter;
        this.deferredRemove = deferredRemove;
        device.adapter.removeThing(device);
      } else {
        deferredRemove.reject('removeThing: thingId: ' + thingId +
                              ' not found.');
      }
    }

    return deferredRemove.promise;
   }

  /**
   * @method unloadAdapters
   * Unloads all of the loaded adapters.
   */
  unloadAdapters() {
    if (!this.adaptersLoaded) {
      // The adapters are not currently loaded, no need to unload.
      return;
    }
    // unload the adapters in the reverse of the order that they were loaded.
    for (var adapterId of Array.from(this.adapters.keys()).reverse()) {
      var adapter = this.getAdapter(adapterId);
      console.log('Unloading', adapter.name);
      adapter.unload();
    }
    this.adaptersLoaded = false;
  }

  /**
   * @method waitForAdapter
   *
   * Returns a promise which resolves to the adapter with the indicated id.
   * This function is really only used to support testing and
   * ensure that tests don't proceed until 
   */
  waitForAdapter(adapterId) {
    var adapter = this.getAdapter(adapterId);
    if (adapter) {
      // The adapter already exists, just create a Promise
      // that resolves to that.
      return Promise.resolve(adapter);
    }

    var deferredWait = this.deferredWaitForAdapter.get(adapterId);
    if (!deferredWait) {
      // No deferred wait currently setup. Set a new one up.
      deferredWait = new Deferred();
      this.deferredWaitForAdapter.set(adapterId, deferredWait);
    }
    
    return deferredWait.promise;
  }
}

module.exports = new AdapterManager();
