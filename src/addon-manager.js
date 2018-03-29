/**
 * Manages all of the add-ons used in the system.
 *
 * @module AddonManager
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const config = require('config');
const Constants = require('./constants');
const EventEmitter = require('events').EventEmitter;
const Deferred = require('./deferred');
const Settings = require('./models/settings');
const UserProfile = require('./user-profile');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const tar = require('tar');
const Utils = require('./utils');
const os = require('os');
const promisePipe = require('promisepipe');
const fetch = require('node-fetch');

let PluginClient, PluginServer;

// Use webpack provided require for dynamic includes from the bundle  .
const dynamicRequire = (() => {
  if (typeof __non_webpack_require__ !== 'undefined') {
    // eslint-disable-next-line no-undef
    return __non_webpack_require__;
  }
  return require;
})();

/**
 * @class AddonManager
 * @classdesc The AddonManager will load any add-ons from the 'addons'
 * directory. See loadAddons() for details.
 */
class AddonManager extends EventEmitter {

  constructor() {
    super();
    this.adapters = new Map();
    this.devices = {};
    this.deferredAdd = null;
    this.deferredRemove = null;
    this.addonsLoaded = false;
    this.installedAddons = new Set();
    this.deferredWaitForAdapter = new Map();
    this.pluginServer = null;
  }

  /**
   * Adds an adapter to the collection of adapters managed by AddonManager.
   * This function is typically called when loading add-ons.
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
  addNewThing(pairingTimeout) {
    var deferredAdd = new Deferred();

    if (this.deferredAdd) {
      deferredAdd.reject('Add already in progress');
    } else if (this.deferredRemove) {
      deferredAdd.reject('Remove already in progress');
    } else {
      this.deferredAdd = deferredAdd;
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
   * @method getAdaptersByPackageName
   * @returns Returns a list of loaded adapters with the given package name.
   */
  getAdaptersByPackageName(packageName) {
    return Array.from(this.adapters.values()).filter(
      (a) => a.getPackageName() === packageName);
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
   * @method getPlugin
   *
   * Returns a previously registered plugin.
   */
  getPlugin(pluginId) {
    if (this.pluginServer) {
      return this.pluginServer.getPlugin(pluginId);
    }
  }

  /**
   * @method getThings
   * @returns Returns a dictionary of all of the known things.
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
   * @method requestAction
   * @returns a promise which resolves when the action has been requested.
   */
  requestAction(thingId, actionId, actionName, input) {
    var device = this.getDevice(thingId);
    if (device) {
      return device.requestAction(actionId, actionName, input);
    }
    return new Promise((resolve, reject) => {
      reject('requestAction: device: ' + thingId + ' not found.');
    });
  }

  /**
   * @method removeAction
   * @returns a promise which resolves when the action has been removed.
   */
  removeAction(thingId, actionId, actionName) {
    var device = this.getDevice(thingId);
    if (device) {
      return device.removeAction(actionId, actionName);
    }
    return new Promise((resolve, reject) => {
      reject('removeAction: device: ' + thingId + ' not found.');
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
   * @method validateManifestObject
   *
   * Verifies one level of an object, and recurses as required.
   */
  validateManifestObject(prefix, object, template) {
    for (let key in template) {
      if (key in object) {
        let objectVal = object[key];
        let templateVal = template[key];
        if (typeof(objectVal) !== typeof(templateVal)) {
          return `Expecting ${prefix}${key} to have type: ` +
                 typeof(templateVal) + ', found: ' + typeof(objectVal);
        }
        if (typeof(objectVal) === 'object') {
          if (Array.isArray(objectVal)) {
            if (templateVal.length > 0) {
              const expectedType = typeof(templateVal[0]);
              for (const val of objectVal) {
                if (typeof(val) !== expectedType) {
                  return `Expecting all values in ${prefix}${key} to be of ` +
                    `type ${expectedType}`;
                }
              }
            }
          } else {
            let err = this.validateManifestObject(prefix + key + '.',
                                                  objectVal, templateVal);
            if (err) {
              return err;
            }
          }
        }
      } else {
        return `Manifest is missing: ${prefix}${key}`;
      }
    }
  }

  /**
   * @method validateManifest
   *
   * Verifies that the manifest looks valid. We only need to validate
   * fields that we actually use.
   */
  validateManifest(manifest) {
    let manifestTemplate = {
      name: '',
      version: '',
      files: [''],
      moziot: {
        api: {
          min: 0,
          max: 0,
        },
      }
    };
    if (config.get('ipc.protocol') !== 'inproc') {
      // If we're not using in-process plugins, then
      // we also need the exec keyword to exist.
      manifestTemplate.moziot.exec = '';
    }
    return this.validateManifestObject('', manifest, manifestTemplate);
  }

  /**
   * @method loadAddon
   *
   * Loads add-on with the given package name.
   *
   * @param {String} packageName The package name of the add-on to load.
   * @returns A promise which is resolved when the add-on is loaded.
   */
  async loadAddon(packageName) {
    const addonPath = path.join(UserProfile.addonsDir, packageName);

    // Skip if there's no package.json file.
    const packageJson = path.join(addonPath, 'package.json');
    if (!fs.lstatSync(packageJson).isFile()) {
      const err = `package.json not found: ${packageJson}`;
      console.error(err);
      return Promise.reject(err);
    }

    // Read the package.json file.
    let data;
    try {
      data = fs.readFileSync(packageJson);
    } catch (e) {
      const err =
        `Failed to read package.json: ${packageJson}\n${e}`;
      console.error(err);
      return Promise.reject(err);
    }

    let manifest;
    try {
      manifest = JSON.parse(data);
    } catch (e) {
      const err =
        `Failed to parse package.json: ${packageJson}\n${e}`;
      console.error(err);
      return Promise.reject(err);
    }

    // Verify that the name in the package matches the packageName
    if (manifest.name != packageName) {
      const err = `Name from package.json "${manifest.name}" doesn't ` +
                  `match the name from list.json "${packageName}"`;
      console.error(err);
      return Promise.reject(err);
    }

    // Verify the files list in the package.
    if (!manifest.hasOwnProperty('files') || manifest.files.length === 0) {
      const err = `files property missing for package ${manifest.name}`;
      console.error(err);
      return Promise.reject(err);
    }

    if (fs.existsSync(path.join(addonPath, '.git'))) {
      // This looks like a git repository, so we'll skip checking the
      // SHA256SUMS file.
      const sha256SumsIndex = manifest.files.indexOf('SHA256SUMS');
      if (sha256SumsIndex >= 0) {
        manifest.files.splice(sha256SumsIndex, 1);
        console.log(`Not checking SHA256SUMS file for ${manifest.name} ` +
        'since a .git directory was detected');
      }
    }

    for (let fname of manifest.files) {
      fname = path.join(addonPath, fname);
      if (!fs.existsSync(fname)) {
        const err = `Package ${manifest.name} missing file: ${fname}`;
        console.error(err);
        return Promise.reject(err);
      }
    }

    // If a SHA256SUMS file is present, verify it. This file is of the format:
    // <checksum> <filename>
    //
    // To generate a file of this type, you can use:
    //   `rm -f SHA256SUMS && sha256sum file1 file2 ... > SHA256SUMS`
    // To verify, use:
    //   `sha256sum --check SHA256SUMS`
    if (manifest.files.includes('SHA256SUMS')) {
      const sumsFile = path.join(addonPath, 'SHA256SUMS');
      try {
        const data = fs.readFileSync(sumsFile, 'utf8');
        const lines = data.trim().split(/\r?\n/);
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length !== 2) {
            const err = `Invalid checksum in package ${manifest.name}`;
            console.error(err);
            return Promise.reject(err);
          }

          if (Utils.hashFile(path.join(addonPath, parts[1])) !== parts[0]) {
            const err =
              `Checksum failed in package ${manifest.name}: ${parts[1]}`;
            console.error(err);
            return Promise.reject(err);
          }
        }
      } catch (e) {
        const err =
          `Failed to read SHA256SUMS for package ${manifest.name}: ${e}`;
        console.error(err);
        return Promise.reject(err);
      }
    }

    // Verify that important fields exist in the manifest
    let err = this.validateManifest(manifest);
    if (err) {
      return Promise.reject(
        `Error found in manifest for ${packageName}\n${err}`);
    }

    // Verify API version.
    const apiVersion = config.get('addonManager.api');
    if (manifest.moziot.api.min > apiVersion ||
        manifest.moziot.api.max < apiVersion) {
      const err = `API mismatch for package: ${manifest.name}\nCurrent: ${
        apiVersion} Supported: ${manifest.moziot.api.min}-${
          manifest.moziot.api.max}`;
      console.error(err);
      return Promise.reject(err);
    }

    // Get any saved settings for this add-on.
    const key = `addons.${manifest.name}`;
    let savedSettings = await Settings.get(key);
    let newSettings = Object.assign({}, manifest);
    if (savedSettings) {
      // Overwrite config and enablement values.
      newSettings.moziot.enabled = savedSettings.moziot.enabled;
      newSettings.moziot.config = Object.assign(manifest.moziot.config || {},
                                                savedSettings.moziot.config);
    } else {
      if (!manifest.moziot.hasOwnProperty('enabled')) {
        newSettings.moziot.enabled = false;
      }

      if (!newSettings.moziot.hasOwnProperty('config')) {
        newSettings.moziot.config = {};
      }
    }

    // Update the settings database.
    await Settings.set(key, newSettings);
    this.installedAddons.add(packageName);

    // If this add-on is not explicitly enabled, move on.
    if (!newSettings.moziot.enabled) {
      const err = `Package not enabled: ${manifest.name}`;
      console.log(err);
      return Promise.reject(err);
    }

    const errorCallback = function(packageName, errorStr) {
      console.error('Failed to load', packageName, '-', errorStr);
    };

    // Load the add-on
    console.log('Loading add-on:', manifest.name);
    if (config.get('ipc.protocol') === 'inproc') {
      // This is a special case where we load the adapter directly
      // into the gateway, but we use IPC comms to talk to the
      // add-on (i.e. for testing)
      const pluginClient = new PluginClient(manifest.name,
                                            {verbose: false});
      try {
        const addonManagerProxy = await pluginClient.register();
        console.log('Loading add-on', manifest.name, 'as plugin');
        const addonLoader = dynamicRequire(addonPath);
        addonLoader(addonManagerProxy, newSettings, errorCallback);
      } catch (e) {
        const err =
          `Failed to register package with gateway: ${manifest.name}\n${e}`;
        console.error(err);
        return Promise.reject(err);
      }
    } else {
      // This is the normal plugin adapter case, tell the PluginServer
      // to load the plugin.
      this.pluginServer.loadPlugin(addonPath, newSettings);
    }
  }

  /**
   * @method loadAddons
   * Loads all of the configured add-ons from the addons directory.
   */
  loadAddons() {
    if (this.addonsLoaded) {
      // This is kind of a hack, but it allows the gateway to restart properly
      // when switching between http and https modes.
      return;
    }
    this.addonsLoaded = true;

    // Load the Plugin Server
    PluginClient = require('./plugin/plugin-client');
    PluginServer = require('./plugin/plugin-server');

    this.pluginServer = new PluginServer(this, {verbose: false});

    // Load the add-ons

    const addonManager = this;
    const addonPath = UserProfile.addonsDir;

    // Search add-ons directory
    fs.readdir(addonPath, async function(err, files) {
      if (err) {
        // This should probably never happen.
        console.error('Failed to search add-ons directory');
        console.error(err);
        return;
      }

      for (const addonName of files) {
        // Skip if not a directory. Use stat rather than lstat such that we
        // also load through symlinks.
        if (!fs.statSync(path.join(addonPath, addonName)).isDirectory()) {
          continue;
        }

        addonManager.loadAddon(addonName).catch(err => {
          console.error(`Failed to load add-on: ${addonName}\n${err}`);
        });
      }
    });

    if (process.env.NODE_ENV !== 'test') {
      // Check for add-ons in 10 seconds (allow add-ons to load first).
      setTimeout(() => {
        this.updateAddons();

        // Check every day.
        const delay = 24 * 60 * 60 * 1000;
        setInterval(this.updateAddons, delay);
      }, 10000);
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
        deferredRemove.resolve(thingId);
      }
    }

    return deferredRemove.promise;
   }

  /**
   * @method unloadAddons
   * Unloads all of the loaded add-ons.
   *
   * @returns a promise which is resolved when all of the add-ons
   *          are unloaded.
   */
  unloadAddons() {
    if (!this.addonsLoaded) {
      // The add-ons are not currently loaded, no need to unload.
      return Promise.resolve();
    }

    let unloadPromises = [];
    // unload the adapters in the reverse of the order that they were loaded.
    for (const adapterId of Array.from(this.adapters.keys()).reverse()) {
      unloadPromises.push(this.unloadAdapter(adapterId));
    }

    this.addonsLoaded = false;
    return Promise.all(unloadPromises);
  }

  /**
   * @method unloadAdapter
   * Unload the given adapter.
   *
   * @param {String} id The ID of the adapter to unload.
   * @returns A promise which is resolved when the adapter is unloaded.
   */
  unloadAdapter(id) {
    if (!this.addonsLoaded) {
      // The add-ons are not currently loaded, no need to unload.
      return Promise.resolve();
    }

    let adapter = this.getAdapter(id);
    if (typeof adapter === 'undefined') {
      // This adapter wasn't loaded.
      return Promise.resolve();
    }

    console.log('Unloading', adapter.name);
    this.adapters.delete(adapter.id);
    return adapter.unload();
  }

  /**
   * @method unloadAddon
   * Unload add-on with the given package name.
   *
   * @param {String} packageName The package name of the add-on to unload.
   * @param {Boolean} wait Whether or not to wait for unloading to finish
   * @returns A promise which is resolved when the add-on is unloaded.
   */
  unloadAddon(packageName, wait) {
    if (!this.addonsLoaded) {
      // The add-ons are not currently loaded, no need to unload.
      return Promise.resolve();
    }

    const plugin = this.getPlugin(packageName);
    let pluginProcess = {};
    if (plugin) {
      pluginProcess = plugin.process;
    }

    const adapters = this.getAdaptersByPackageName(packageName);
    const adapterIds = adapters.map((a) => a.id);
    const unloadPromises = [];
    for (const a of adapters) {
      console.log('Unloading', a.name);
      unloadPromises.push(a.unload());
      this.adapters.delete(a.id);
    }

    // Give the process 3 seconds to exit before killing it.
    const cleanup = () => {
      setTimeout(() => {
        if (pluginProcess.p) {
          console.log(`Killing ${packageName} plugin.`);
          pluginProcess.p.kill();
        }

        // Remove devices owned by this add-on.
        for (const deviceId of Object.keys(this.devices)) {
          if (adapterIds.includes(this.devices[deviceId].adapter.id)) {
            this.handleDeviceRemoved(this.devices[deviceId]);
          }
        }
      }, Constants.UNLOAD_PLUGIN_KILL_DELAY);
    };

    const all =
      Promise.all(unloadPromises).then(() => cleanup(), () => cleanup());

    if (wait) {
      // If wait was set, wait 3 seconds + a little for the process to die.
      // 3 seconds, because that's what is used in unloadAddon().
      return all.then(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, Constants.UNLOAD_PLUGIN_KILL_DELAY + 500);
        });
      });
    }

    return all;
  }

  /**
   * @method isAddonInstalled
   *
   * @param {String} packageName The package name to check
   * @returns Boolean indicating whether or not the package name is installed
   *          on the system.
   */
  isAddonInstalled(packageName) {
    return this.installedAddons.has(packageName);
  }

  /**
   * Install an add-on.
   *
   * @param {String} name The package name
   * @param {String} url The package URL
   * @param {String} checksum SHA-256 checksum of the package
   * @param {Boolean} enable Whether or not to enable the add-on after install
   * @returns A Promise that resolves when the add-on is installed.
   */
  async installAddonFromUrl(name, url, checksum, enable) {
    const tempPath = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
    const destPath = path.join(tempPath, `${name}.tar.gz`);

    console.log(`Fetching add-on ${url} as ${destPath}`);

    try {
      const res = await fetch(url);
      const dest = fs.createWriteStream(destPath);
      await promisePipe(res.body, dest);
    } catch (e) {
      rimraf(tempPath, {glob: false}, (e) => {
        if (e) {
          console.error(`Error removing temp directory: ${tempPath}\n${e}`);
        }
      });
      const err = `Failed to download add-on: ${name}\n${e}`;
      console.error(err);
      return Promise.reject(err);
    }

    if (Utils.hashFile(destPath) !== checksum.toLowerCase()) {
      rimraf(tempPath, {glob: false}, (e) => {
        if (e) {
          console.error(`Error removing temp directory: ${tempPath}\n${e}`);
        }
      });
      const err = `Checksum did not match for add-on: ${name}`;
      console.error(err);
      return Promise.reject(err);
    }

    let success = false, err;
    try {
      await this.installAddon(name, destPath, enable);
      success = true;
    } catch (e) {
      err = e;
    }

    rimraf(tempPath, {glob: false}, (e) => {
      if (e) {
        console.error(`Error removing temp directory: ${tempPath}\n${e}`);
      }
    });

    if (!success) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  /**
   * @method installAddon
   *
   * @param {String} packageName The package name to install
   * @param {String} packagePath Path to the package tarball
   * @param {Boolean} enable Whether or not to enable the add-on after install
   * @returns A promise that resolves when the package is installed.
   */
  async installAddon(packageName, packagePath, enable) {
    if (!this.addonsLoaded) {
      const err =
        'Cannot install add-on before other add-ons have been loaded.';
      console.error(err);
      return Promise.reject(err);
    }

    if (!fs.lstatSync(packagePath).isFile()) {
      const err = `Cannot extract invalid path: ${packagePath}`;
      console.error(err);
      return Promise.reject(err);
    }

    const addonPath = path.join(UserProfile.addonsDir, packageName);

    try {
      // Create the add-on directory, if necessary
      if (!fs.existsSync(addonPath)) {
        fs.mkdirSync(addonPath);
      }
    } catch (e) {
      const err = `Failed to create add-on directory: ${addonPath}\n${e}`
      console.error(err);
      return Promise.reject(err);
    }

    const cleanup = () => {
      if (fs.lstatSync(addonPath).isDirectory()) {
        rimraf(addonPath, {glob: false}, (e) => {
          if (e) {
            console.error(`Error removing ${packageName}: ${e}`);
          }
        });
      }
    };

    console.log(`Expanding add-on ${packagePath} into ${addonPath}`);

    try {
      // Try to extract the tarball
      await tar.x({file: packagePath, strip: 1, cwd: addonPath}, ['package']);
    } catch (e) {
      // Clean up if extraction failed
      cleanup();

      const err = `Failed to extract package: ${packagePath}\n${e}`;
      console.error(err);
      return Promise.reject(err);
    }

    // Update the saved settings (if any) and enable the add-on
    const key = `addons.${packageName}`;
    let savedSettings = await Settings.get(key);
    if (savedSettings) {
      // Only enable if we're supposed to. Otherwise, keep whatever the current
      // setting is.
      if (enable) {
        savedSettings.moziot.enabled = true;
      }
    } else {
      // If this add-on is brand new, use the passed-in enable flag.
      savedSettings = {
        moziot: {
          enabled: enable,
        },
      };
    }
    await Settings.set(key, savedSettings);

    if (savedSettings.moziot.enabled) {
      // Now, load the add-on
      try {
        await this.loadAddon(packageName);
      } catch (e) {
        // Clean up if loading failed
        cleanup();
        return Promise.reject(`Failed to load add-on: ${packageName}\n${e}`);
      }
    }
  }

  /**
   * @method uninstallAddon
   *
   * @param {String} packageName The package name to uninstall
   * @param {Boolean} wait Whether or not to wait for unloading to finish
   * @param {Boolean} disable Whether or not to disable the add-on
   * @returns A promise that resolves when the package is uninstalled.
   */
  async uninstallAddon(packageName, wait, disable) {
    try {
      // Try to gracefully unload
      await this.unloadAddon(packageName, wait);
    } catch (e) {
      console.error(`Failed to unload ${packageName} properly: ${e}`);
      // keep going
    }

    const addonPath = path.join(UserProfile.addonsDir, packageName);

    // Unload this module from the require cache
    Object.keys(require.cache).map((x) => {
      if (x.startsWith(addonPath)) {
        delete require.cache[x];
      }
    });

    // Remove the package from the file system
    if (fs.lstatSync(addonPath).isDirectory()) {
      rimraf(addonPath, {glob: false}, (e) => {
        if (e) {
          console.error(`Error removing ${packageName}: ${e}`);
        }
      });
    }

    // Update the saved settings and disable the add-on
    if (disable) {
      const key = `addons.${packageName}`;
      let savedSettings = await Settings.get(key);
      if (savedSettings) {
        savedSettings.moziot.enabled = false;
        await Settings.set(key, savedSettings);
      }
    }

    // Remove from our list of installed add-ons
    this.installedAddons.delete(packageName);
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

  /**
   * @method updateAddons
   *
   * Attempt to update all installed add-ons.
   *
   * @returns A promise which is resolved when updating is complete.
   */
  async updateAddons() {
    const api = config.get('addonManager.api');
    const architecture = Utils.getArchitecture();
    const addonPath = UserProfile.addonsDir;
    const available = {};

    console.log('Checking for add-on updates...');

    try {
      const response = await fetch(config.get('addonManager.listUrl'));
      const list = await response.json();

      for (const addon of list) {
        // Skip incompatible add-ons.
        if (addon.api.min > api || addon.api.max < api) {
          continue;
        }

        // Only support architecture-compatible add-ons.
        for (const arch in addon.packages) {
          if (arch === 'any' || arch === architecture) {
            available[addon.name] = {
              version: addon.version,
              url: addon.packages[arch].url,
              checksum: addon.packages[arch].checksum,
            };
            break;
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse add-on list.');
      return;
    }

    // Try to update what we can. Don't use the installedAddons set because it
    // doesn't contain add-ons that failed to load properly.
    fs.readdir(addonPath, async (err, files) => {
      if (err) {
        console.error('Failed to search add-on directory');
        console.error(err);
        return;
      }

      for (const addonName of files) {
        // Skip if not a directory. Use stat rather than lstat such that we
        // also load through symlinks.
        if (!fs.statSync(path.join(addonPath, addonName)).isDirectory()) {
          continue;
        }

        // Skip if .git directory is present.
        if (fs.existsSync(path.join(addonPath, addonName, '.git'))) {
          console.log(
            `Not updating ${addonName} since a .git directory was detected`);
          continue;
        }

        // Try to load package.json.
        const packageJson = path.join(addonPath, addonName, 'package.json');
        if (!fs.existsSync(packageJson)) {
          continue;
        }

        let manifest;
        try {
          const data = fs.readFileSync(packageJson);
          manifest = JSON.parse(data);
        } catch (e) {
          console.error(`Failed to read package.json: ${packageJson}\n${e}`);
          continue;
        }

        // Check if an update is available.
        if (available.hasOwnProperty(addonName) &&
            available[addonName].version !== manifest.version) {
          try {
            await this.uninstallAddon(addonName, true, false);
            await this.installAddonFromUrl(addonName,
                                           available[addonName].url,
                                           available[addonName].checksum,
                                           false);
          } catch (e) {
            console.error(`Failed to update ${addonName}: ${e}`);
          }
        }
      }
    });
  }
}

module.exports = new AddonManager();
