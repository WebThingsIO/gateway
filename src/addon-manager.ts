/**
 * Manages all of the add-ons used in the system.
 *
 * @module AddonManager
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as AddonUtils from './addon-utils';
import config from 'config';
import * as Constants from './constants';
import Deferred from './deferred';
import {EventEmitter} from 'events';
import * as Platform from './platform';
import * as Settings from './models/settings';
import UserProfile from './user-profile';
import * as Utils from './utils';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import semver from 'semver';
import tar from 'tar';
import os from 'os';
import promisePipe from 'promisepipe';
import fetch from 'node-fetch';
import find from 'find';
import {URLSearchParams} from 'url';
import {ncp} from 'ncp';

import pkg from './package.json';
import {Level, PropertyValue, Device as DeviceSchema} from 'gateway-addon/lib/schema';
import PluginServer from './plugin/plugin-server';
import Plugin from './plugin/plugin';
import {Adapter, APIHandler, Device, Notifier, Outlet} from 'gateway-addon';

/**
 * @class AddonManager
 * @classdesc The AddonManager will load any add-ons from the 'addons'
 * directory. See loadAddons() for details.
 */
export class AddonManager extends EventEmitter {
  private adapters = new Map<string, Adapter>();

  private notifiers = new Map<string, Notifier>();

  private apiHandlers = new Map<string, APIHandler>();

  private devices: Record<string, Device> = {};

  private outlets: Record<string, Outlet> = {};

  private extensions: Record<string, any> = {};

  private deferredAdd: Deferred<void, unknown> | null = null;

  private deferredRemovals =
  new Map<string, Deferred<string, unknown> & {adapter?: Adapter} >();

  private removalTimeouts = new Map<string, NodeJS.Timeout>();

  private addonsLoaded = false;

  private installedAddons = new Map<string, any>();

  private deferredWaitForAdapter = new Map<string, Deferred<Adapter, unknown>>();

  private pluginServer: any | null = null;

  private updateTimeout: NodeJS.Timeout | null = null;

  private updateInterval: number | null = null;

  private pairingTimeout: NodeJS.Timeout | null = null;

  // These stubs are needed because the gateway shares classes like
  // Addon, Device, ... with the addon.
  // Although the values aren't used, the getters need to be present
  // because they are called as part of the initialization process.
  getGatewayVersion(): string {
    return '';
  }

  getUserProfile(): any {
    return {};
  }

  getPreferences(): any {
    return {};
  }

  /**
   * Adds an adapter to the collection of adapters managed by AddonManager.
   * This function is typically called when loading add-ons.
   */
  addAdapter(adapter: Adapter): void {
    if (!adapter.getName()) {
      (adapter as any).name = adapter.constructor.name;
    }
    this.adapters.set(adapter.getId(), adapter);

    /**
     * Adapter added event.
     *
     * This is event is emitted whenever a new adapter is loaded.
     *
     * @event adapterAdded
     * @type  {Adapter}
     */
    this.emit(Constants.ADAPTER_ADDED, adapter);

    const deferredWait = this.deferredWaitForAdapter.get(adapter.getId());
    if (deferredWait) {
      this.deferredWaitForAdapter.delete(adapter.getId());
      deferredWait.resolve(adapter);
    }
  }

  addNotifier(notifier: Notifier): void {
    if (!notifier.getName()) {
      (notifier as any).name = notifier.constructor.name;
    }

    this.notifiers.set(notifier.getId(), notifier);

    /**
     * Notifier added event.
     *
     * This is event is emitted whenever a new notifier is loaded.
     *
     * @event notifierAdded
     * @type {Notifier}
     */
    this.emit(Constants.NOTIFIER_ADDED, notifier);
  }

  addAPIHandler(handler: APIHandler): void {
    this.apiHandlers.set(handler.getPackageName(), handler);

    /**
     * API Handler added event.
     *
     * This is event is emitted whenever a new API handler is loaded.
     *
     * @event apiHandlerAdded
     * @type {APIHandler}
     */
    this.emit(Constants.API_HANDLER_ADDED, handler);
  }

  /**
   * @method addNewThing
   *
   * Initiates pairing on all of the adapters that support it.
   *
   * @returns A promise when the pairing process is complete.
   */
  addNewThing(pairingTimeout: number): Promise<void> {
    const deferredAdd = new Deferred<void, unknown>();

    if (this.deferredAdd) {
      deferredAdd.reject('Add already in progress');
    } else {
      this.deferredAdd = deferredAdd;
      this.adapters.forEach((adapter) => {
        console.log('About to call startPairing on', adapter.getName());
        adapter.startPairing(pairingTimeout);
      });
      this.pairingTimeout = setTimeout(() => {
        console.log('Pairing timeout');
        this.emit(Constants.PAIRING_TIMEOUT);
        this.cancelAddNewThing();
      }, pairingTimeout * 1000);
    }

    return deferredAdd.getPromise();
  }

  /**
   * @method cancelAddNewThing
   *
   * Cancels a previous addNewThing request.
   */
  cancelAddNewThing(): void {
    const deferredAdd = this.deferredAdd;

    if (this.pairingTimeout) {
      clearTimeout(this.pairingTimeout);
      this.pairingTimeout = null;
    }

    if (deferredAdd) {
      this.adapters.forEach((adapter) => {
        adapter.cancelPairing();
      });
      this.deferredAdd = null;
      deferredAdd.resolve();
    }
  }

  /**
   * @method cancelRemoveThing
   *
   * Cancels a previous removeThing request.
   */
  cancelRemoveThing(thingId: string): void {
    const timeout = this.removalTimeouts.get(thingId);
    if (timeout) {
      clearTimeout(timeout);
      this.removalTimeouts.delete(thingId);
    }

    const deferredRemove = this.deferredRemovals.get(thingId);
    if (deferredRemove) {
      const device = this.getDevice(thingId);
      if (device) {
        const adapter = device.getAdapter();
        if (adapter) {
          adapter.cancelRemoveThing(device);
        }
      }
      this.deferredRemovals.delete(thingId);
      deferredRemove.reject('removeThing cancelled');
    }
  }

  /**
   * @method getAdapter
   * @returns Returns the adapter with the indicated id.
   */
  getAdapter(adapterId: string): Adapter | undefined {
    return this.adapters.get(adapterId);
  }

  /**
   * @method getAdapters
   * @returns Returns a Map of the loaded adapters. The dictionary
   *          key corresponds to the adapter id.
   */
  getAdapters(): Map<string, Adapter> {
    return this.adapters;
  }

  /**
   * @method getNotifiers
   * @returns Returns a Map of the loaded notifiers. The dictionary
   *          key corresponds to the notifier id.
   */
  getNotifiers(): Map<string, Notifier> {
    return this.notifiers;
  }

  /**
   * @method getNotifier
   * @returns Returns the notifier with the indicated id.
   */
  getNotifier(notifierId: string): Notifier | undefined {
    return this.notifiers.get(notifierId);
  }

  /**
   * @method getAPIHandlers
   * @returns Returns a Map of the loaded API handlers. The dictionary
   *          key corresponds to the package ID.
   */
  getAPIHandlers(): Map<string, APIHandler> {
    return this.apiHandlers;
  }

  /**
   * @method getAPIHandler
   * @returns Returns the API handler with the given package ID.
   */
  getAPIHandler(packageId: string): APIHandler | undefined {
    return this.apiHandlers.get(packageId);
  }

  /**
   * @method getExtensions
   * @returns Returns a Map of the loaded extensions. The dictionary
   *          key corresponds to the extension ID.
   */
  getExtensions(): Record<string, any> {
    return this.extensions;
  }

  /**
   * @method getDevice
   * @returns Returns the device with the indicated id.
   */
  getDevice(id: string): Device {
    return this.devices[id];
  }

  /**
   * @method getDevices
   * @returns Returns an dictionary of all of the known devices.
   *          The dictionary key corresponds to the device id.
   */
  getDevices(): Record<string, Device> {
    return this.devices;
  }

  /**
   * @method getOutlet
   * @returns Returns the outlet with the indicated id.
   */
  getOutlet(id: string): Outlet {
    return this.outlets[id];
  }

  /**
   * @method getOutlets
   * @returns Returns an dictionary of all of the known outlets.
   *          The dictionary key corresponds to the outlet id.
   */
  getOutlets(): Record<string, Outlet> {
    return this.outlets;
  }

  /**
   * @method getPlugin
   *
   * Returns a previously registered plugin.
   */
  getPlugin(pluginId: string): Plugin | undefined {
    if (this.pluginServer) {
      return this.pluginServer.getPlugin(pluginId);
    }

    // eslint-disable-next-line no-useless-return
    return;
  }

  /**
   * @method getThings
   * @returns Returns a dictionary of all of the known things.
   *          The dictionary key corresponds to the device id.
   */
  getThings(): DeviceSchema[] {
    const things = [];
    for (const thingId in this.devices) {
      const thing = this.getThing(thingId);
      if (thing) {
        things.push(thing);
      }
    }
    return things;
  }

  /**
   * @method getThing
   * @returns Returns the thing with the indicated id.
   */
  getThing(thingId: string): DeviceSchema | undefined {
    return this.getDevice(thingId)?.asThing();
  }

  /**
   * @method getPropertyDescriptions
   * @returns Retrieves all of the properties associated with the thing
   *          identified by `thingId`.
   */
  getPropertyDescriptions(thingId: string): Record<string, unknown> | undefined {
    return this.getDevice(thingId)?.getPropertyDescriptions();
  }

  /**
   * @method getProperty
   * @returns a promise which resolves to the retrieved value of `propertyName`
   *          from the thing identified by `thingId`.
   */
  getProperty(thingId: string, propertyName: string): Promise<unknown> {
    const device = this.getDevice(thingId);
    if (device) {
      return device.getProperty(propertyName);
    }

    return Promise.reject(`getProperty: device: ${thingId} not found.`);
  }

  /**
   * @method setProperty
   * @returns a promise which resolves to the updated value of `propertyName`
   *          for the thing identified by `thingId`.
   */
  setProperty(thingId: string, propertyName: string, value: PropertyValue): Promise<PropertyValue> {
    const device = this.getDevice(thingId);
    if (device) {
      return device.setProperty(propertyName, value);
    }

    return Promise.reject(`setProperty: device: ${thingId} not found.`);
  }

  /**
   * @method notify
   * @returns a promise which resolves when the outlet has been notified.
   */
  notify(outletId: string, title: string, message: string, level: Level): Promise<void> {
    const outlet = this.getOutlet(outletId);
    if (outlet) {
      return outlet.notify(title, message, level);
    }

    return Promise.reject(`notify: outlet: ${outletId} not found.`);
  }

  /**
   * @method setPin
   * @returns a promise which resolves when the PIN has been set.
   */
  setPin(thingId: string, pin: string): Promise<void> {
    const device = this.getDevice(thingId);
    if (device) {
      return device.getAdapter().setPin(thingId, pin);
    }

    return Promise.reject(`setPin: device ${thingId} not found.`);
  }

  /**
   * @method setCredentials
   * @returns a promise which resolves when the credentials have been set.
   */
  setCredentials(thingId: string, username: string, password: string): Promise<void> {
    const device = this.getDevice(thingId);
    if (device) {
      return device.getAdapter().setCredentials(thingId, username, password);
    }

    return Promise.reject(`setCredentials: device ${thingId} not found.`);
  }

  /**
   * @method requestAction
   * @returns a promise which resolves when the action has been requested.
   */
  requestAction(thingId: string, actionId: string, actionName: string, input: any): Promise<void> {
    const device = this.getDevice(thingId);
    if (device) {
      return device.requestAction(actionId, actionName, input);
    }

    return Promise.reject(`requestAction: device: ${thingId} not found.`);
  }

  /**
   * @method removeAction
   * @returns a promise which resolves when the action has been removed.
   */
  removeAction(thingId: string, actionId: string, actionName: string): Promise<void> {
    const device = this.getDevice(thingId);
    if (device) {
      return device.removeAction(actionId, actionName);
    }

    return Promise.reject(`removeAction: device: ${thingId} not found.`);
  }

  /**
   * @method handleDeviceAdded
   *
   * Called when the indicated device has been added to an adapter.
   */
  handleDeviceAdded(device: Device): void {
    this.devices[device.getId()] = device;
    const thing = device.asThing();

    /**
     * Thing added event.
     *
     * This event is emitted whenever a new thing is added.
     *
     * @event thingAdded
     * @type  {Thing}
     */
    this.emit(Constants.THING_ADDED, thing);
  }

  /**
   * @method handleDeviceRemoved
   * Called when the indicated device has been removed by an adapter.
   */
  handleDeviceRemoved(device: Device): void {
    delete this.devices[device.getId()];
    const thing = device.asThing();

    /**
     * Thing removed event.
     *
     * This event is emitted whenever a thing is removed.
     *
     * @event thingRemoved
     * @type  {Thing}
     */
    this.emit(Constants.THING_REMOVED, thing);

    const timeout = this.removalTimeouts.get(device.getId());
    if (timeout) {
      clearTimeout(timeout);
      this.removalTimeouts.delete(device.getId());
    }

    const deferredRemove = this.deferredRemovals.get(device.getId());
    if (deferredRemove && deferredRemove.adapter == device.getAdapter()) {
      this.deferredRemovals.delete(device.getId());
      deferredRemove.resolve(device.getId());
    }
  }

  /**
   * @method handleOutletAdded
   *
   * Called when the indicated outlet has been added to a notifier.
   */
  handleOutletAdded(outlet: Outlet): void {
    this.outlets[outlet.getId()] = outlet;

    /**
     * Outlet added event.
     *
     * This event is emitted whenever a new outlet is added.
     *
     * @event outletAdded
     * @type {Outlet}
     */
    this.emit(Constants.OUTLET_ADDED, outlet.asDict());
  }

  /**
   * @method handleOutletRemoved
   * Called when the indicated outlet has been removed by a notifier.
   */
  handleOutletRemoved(outlet: Outlet): void {
    delete this.outlets[outlet.getId()];

    /**
     * Outlet removed event.
     *
     * This event is emitted whenever an outlet is removed.
     *
     * @event outletRemoved
     * @type {Outlet}
     */
    this.emit(Constants.OUTLET_REMOVED, outlet.asDict());
  }

  /**
   * @method addonEnabled
   *
   * Determine whether the add-on with the given package name is enabled.
   *
   * @param {string} packageId The package ID of the add-on
   * @returns {boolean} Boolean indicating enabled status.
   */
  async addonEnabled(packageId: string): Promise<boolean> {
    if (this.installedAddons.has(packageId)) {
      return this.installedAddons.get(packageId).enabled;
    }

    return false;
  }

  async enableAddon(packageId: string): Promise<void> {
    if (!this.installedAddons.has(packageId)) {
      throw new Error('Package not installed.');
    }

    const obj = this.installedAddons.get(packageId);
    obj.enabled = true;
    await Settings.setSetting(`addons.${packageId}`, obj);
    await this.loadAddon(packageId);
  }

  async disableAddon(packageId: string, wait = false): Promise<void> {
    if (!this.installedAddons.has(packageId)) {
      throw new Error('Package not installed.');
    }

    const obj = this.installedAddons.get(packageId);
    obj.enabled = false;
    await Settings.setSetting(`addons.${packageId}`, obj);
    await this.unloadAddon(packageId, wait);
  }

  /**
   * @method loadAddon
   *
   * Loads add-on with the given package ID.
   *
   * @param {String} packageId The package ID of the add-on to load.
   * @returns A promise which is resolved when the add-on is loaded.
   */
  async loadAddon(packageId: string): Promise<void> {
    const addonPath = path.join(UserProfile.addonsDir, packageId);

    // Let errors from loading the manifest bubble up.
    const [manifest, cfg] = AddonUtils.loadManifest(packageId);

    // Get any saved settings for this add-on.
    const key = `addons.${packageId}`;
    const configKey = `addons.config.${packageId}`;
    try {
      const savedSettings = await Settings.getSetting(key);

      // If the old-style data is stored in the database, we need to transition
      // to the new format.
      if (savedSettings.hasOwnProperty('moziot') &&
          savedSettings.moziot.hasOwnProperty('enabled')) {
        manifest.enabled = savedSettings.moziot.enabled;
      } else if (savedSettings.hasOwnProperty('enabled')) {
        manifest.enabled = savedSettings.enabled;
      }

      if (savedSettings.hasOwnProperty('moziot') &&
          savedSettings.moziot.hasOwnProperty('config')) {
        await Settings.setSetting(configKey, savedSettings.moziot.config);
      }
    } catch (_e) {
      // pass
    }

    await Settings.setSetting(key, manifest);
    this.installedAddons.set(packageId, manifest);

    // Get the saved config. If there is none, populate the database with the
    // defaults.
    let savedConfig = await Settings.getSetting(configKey);
    if (!savedConfig) {
      await Settings.setSetting(configKey, cfg);
      savedConfig = cfg;
    }

    // If this add-on is not explicitly enabled, move on.
    if (!manifest.enabled) {
      throw new Error(`Add-on not enabled: ${manifest.id}`);
    }

    if (manifest.content_scripts && manifest.web_accessible_resources) {
      this.extensions[manifest.id] = {
        extensions: manifest.content_scripts,
        resources: manifest.web_accessible_resources,
      };
    }

    if (!manifest.exec) {
      return;
    }

    const dataPath = path.join(UserProfile.dataDir, manifest.id);
    try {
      // Create the add-on data directory, if necessary
      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath);
      }
    } catch (e) {
      console.error(`Failed to create add-on data directory ${dataPath}:`, e);
    }

    // Load the add-on
    console.log(`Loading add-on: ${manifest.id}`);
    this.pluginServer.loadPlugin(addonPath, manifest.id, manifest.exec);
  }

  /**
   * @method loadAddons
   * Loads all of the configured add-ons from the addons directory.
   */
  loadAddons(): void {
    if (this.addonsLoaded) {
      // This is kind of a hack, but it allows the gateway to restart properly
      // when switching between http and https modes.
      return;
    }
    this.addonsLoaded = true;

    // Load the Plugin Server
    this.pluginServer = new PluginServer(this, {verbose: false});

    // Load the add-ons

    const addonPath = UserProfile.addonsDir;

    // Search add-ons directory
    fs.readdir(addonPath, async (err, files) => {
      if (err) {
        // This should probably never happen.
        console.error('Failed to search add-ons directory');
        console.error(err);
        return;
      }

      for (const addonId of files) {
        // Skip if not a directory. Use stat rather than lstat such that we
        // also load through symlinks.
        if (!fs.statSync(path.join(addonPath, addonId)).isDirectory()) {
          continue;
        }

        this.loadAddon(addonId).catch((err) => {
          console.error(`Failed to load add-on ${addonId}:`, err);
        });
      }
    });

    if (process.env.NODE_ENV !== 'test') {
      // Check for add-ons in 10 seconds (allow add-ons to load first).
      this.updateTimeout = setTimeout(() => {
        this.updateAddons();
        this.updateTimeout = null;

        // Check every day.
        const delay = 24 * 60 * 60 * 1000;
        this.updateInterval = setInterval(this.updateAddons.bind(this), delay);
      }, 10000);
    }
  }

  /**
   * @method removeThing
   *
   * Initiates removing a particular device.
   *
   * @returns A promise that resolves to the device which was actually removed.
   */
  removeThing(thingId: string): Promise<string> {
    const deferredRemove: Deferred<string, unknown>& {adapter?: Adapter} =
    new Deferred<string, unknown>();

    if (this.deferredRemovals.has(thingId)) {
      deferredRemove.reject('Remove already in progress');
    } else {
      const device = this.getDevice(thingId);
      if (device) {
        deferredRemove.adapter = device.getAdapter();
        this.deferredRemovals.set(thingId, deferredRemove);
        this.removalTimeouts.set(thingId, setTimeout(() => {
          this.cancelRemoveThing(thingId);
        }, Constants.DEVICE_REMOVAL_TIMEOUT));
        device.getAdapter().removeThing(device);
      } else {
        deferredRemove.resolve(thingId);
      }
    }

    return deferredRemove.getPromise();
  }

  removeAdapter(id: string): void {
    this.adapters.delete(id);
  }

  removeNotifier(id: string): void {
    this.notifiers.delete(id);
  }

  removeApiHandler(id: string): void {
    this.apiHandlers.delete(id);
  }

  /**
   * @method unloadAddons
   * Unloads all of the loaded add-ons.
   *
   * @returns a promise which is resolved when all of the add-ons
   *          are unloaded.
   */
  unloadAddons(): Promise<void> {
    if (!this.addonsLoaded) {
      // The add-ons are not currently loaded, no need to unload.
      return Promise.resolve();
    }

    const unloadPromises = [];

    // unload the adapters in the reverse of the order that they were loaded.
    for (const adapterId of Array.from(this.adapters.keys()).reverse()) {
      unloadPromises.push(this.unloadAdapter(adapterId));
    }

    // unload the notifiers in the reverse of the order that they were loaded.
    for (const notifierId of Array.from(this.notifiers.keys()).reverse()) {
      unloadPromises.push(this.unloadNotifier(notifierId));
    }

    // unload the API handlers in the reverse of the order that they were
    // loaded.
    for (const packageName of Array.from(this.apiHandlers.keys()).reverse()) {
      unloadPromises.push(this.unloadAPIHandler(packageName));
    }

    this.addonsLoaded = false;

    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    return Promise.all(unloadPromises).then(() => {
      if (this.pluginServer) {
        this.pluginServer.shutdown();
      }
    });
  }

  /**
   * @method unloadAdapter
   * Unload the given adapter.
   *
   * @param {String} id The ID of the adapter to unload.
   * @returns A promise which is resolved when the adapter is unloaded.
   */
  unloadAdapter(id: string): Promise<void> {
    if (!this.addonsLoaded) {
      // The add-ons are not currently loaded, no need to unload.
      return Promise.resolve();
    }

    const adapter = this.getAdapter(id);
    if (typeof adapter === 'undefined') {
      // This adapter wasn't loaded.
      return Promise.resolve();
    }

    console.log('Unloading', adapter.getName());
    this.adapters.delete(adapter.getId());
    return adapter.unload();
  }

  /**
   * @method unloadNotifier
   * Unload the given notifier.
   *
   * @param {String} id The ID of the notifier to unload.
   * @returns A promise which is resolved when the notifier is unloaded.
   */
  unloadNotifier(id: string): Promise<void> {
    if (!this.addonsLoaded) {
      // The add-ons are not currently loaded, no need to unload.
      return Promise.resolve();
    }

    const notifier = this.getNotifier(id);
    if (typeof notifier === 'undefined') {
      // This notifier wasn't loaded.
      return Promise.resolve();
    }

    console.log('Unloading', notifier.getName());
    this.notifiers.delete(notifier.getId());
    return notifier.unload();
  }

  /**
   * @method unloadAPIHandler
   * Unload the given API handler.
   *
   * @param {string} packageId The ID of the package the handler belongs to.
   * @returns A promise which is resolved when the handler is unloaded.
   */
  unloadAPIHandler(packageId: string): Promise<void> {
    if (!this.addonsLoaded) {
      // The add-ons are not currently loaded, no need to unload.
      return Promise.resolve();
    }

    const handler = this.getAPIHandler(packageId);
    if (typeof handler === 'undefined') {
      // This handler wasn't loaded.
      return Promise.resolve();
    }

    console.log('Unloading', handler.getPackageName());
    this.apiHandlers.delete(packageId);
    return handler.unload();
  }

  /**
   * @method unloadAddon
   * Unload add-on with the given package ID.
   *
   * @param {String} packageId The package ID of the add-on to unload.
   * @param {Boolean} wait Whether or not to wait for unloading to finish
   * @returns A promise which is resolved when the add-on is unloaded.
   */
  unloadAddon(packageId: string, wait: boolean): Promise<void> {
    if (!this.addonsLoaded) {
      // The add-ons are not currently loaded, no need to unload.
      return Promise.resolve();
    }

    if (this.extensions.hasOwnProperty(packageId)) {
      delete this.extensions[packageId];
    }

    const plugin = this.getPlugin(packageId);
    const unloadPromise = plugin?.unloadComponents() ?? Promise.resolve();

    // Give the process 3 seconds to exit before killing it.
    const cleanup = (): void => {
      setTimeout(() => {
        plugin?.kill();

        if (this.extensions.hasOwnProperty(packageId)) {
          delete this.extensions[packageId];
        }
      }, Constants.UNLOAD_PLUGIN_KILL_DELAY);
    };

    const all = unloadPromise.then(() => cleanup(), () => cleanup());

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
   * @param {String} packageId The package ID to check
   * @returns Boolean indicating whether or not the package is installed
   *          on the system.
   */
  isAddonInstalled(packageId: string): boolean {
    return this.installedAddons.has(packageId);
  }

  /**
   * Install an add-on.
   *
   * @param {String} id The package ID
   * @param {String} url The package URL
   * @param {String} checksum SHA-256 checksum of the package
   * @param {Boolean} enable Whether or not to enable the add-on after install
   * @param {object} options Set of options, primarily used by external scripts
   * @returns A Promise that resolves when the add-on is installed.
   */
  async installAddonFromUrl(
    id: string, url: string, checksum: string, enable: boolean, options = {}): Promise<void> {
    const tempPath = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
    const destPath = path.join(tempPath, `${id}.tar.gz`);

    console.log(`Fetching add-on ${url} as ${destPath}`);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error status: ${res.status}`);
      }

      const dest = fs.createWriteStream(destPath);
      await promisePipe(res.body, dest);
    } catch (e) {
      rimraf(tempPath, {glob: false}, (e) => {
        if (e) {
          console.error(`Error removing temp directory: ${tempPath}\n${e}`);
        }
      });
      throw new Error(`Failed to download add-on: ${id}\n${e}`);
    }

    if (Utils.hashFile(destPath) !== checksum.toLowerCase()) {
      rimraf(tempPath, {glob: false}, (e) => {
        if (e) {
          console.error(`Error removing temp directory: ${tempPath}\n${e}`);
        }
      });
      throw new Error(`Checksum did not match for add-on: ${id}`);
    }

    let success = false, err;
    try {
      await this.installAddon(id, destPath, enable, options);
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
      throw err;
    }
  }

  /**
   * @method installAddon
   *
   * @param {String} packageId The package ID to install
   * @param {String} packagePath Path to the package tarball
   * @param {Boolean} enable Whether or not to enable the add-on after install
   * @param {object} options Set of options, primarily used by external scripts
   * @returns A promise that resolves when the package is installed.
   */
  async installAddon(
    packageId: string, packagePath: string, enable: boolean,
    options: {skipLoad?: boolean} = {}): Promise<void> {
    if (!this.addonsLoaded && !options.skipLoad) {
      throw new Error(
        'Cannot install add-on before other add-ons have been loaded.'
      );
    }

    if (!fs.lstatSync(packagePath).isFile()) {
      throw new Error(`Cannot extract invalid path: ${packagePath}`);
    }

    console.log(`Expanding add-on ${packagePath}`);

    try {
      // Try to extract the tarball
      await tar.x({
        file: packagePath,
        cwd: path.dirname(packagePath),
      }, ['package']);
    } catch (e) {
      throw new Error(`Failed to extract package: ${e}`);
    }

    // In case we're updating, go ahead and uninstall the existing add-on now
    await this.uninstallAddon(packageId, true, false);

    const addonPath = path.join(UserProfile.addonsDir, packageId);

    // Copy the package into the proper place
    await new Promise<void>((resolve, reject) => {
      ncp(
        path.join(path.dirname(packagePath), 'package'),
        addonPath,
        {stopOnErr: true},
        (err) => {
          if (err) {
            reject(`Failed to move package: ${err}`);
          } else {
            resolve();
          }
        }
      );
    });

    // Update the saved settings (if any) and enable the add-on
    const key = `addons.${packageId}`;
    let obj = await Settings.getSetting(key);
    if (obj) {
      // Only enable if we're supposed to. Otherwise, keep whatever the current
      // setting is.
      if (enable) {
        obj.enabled = true;
      }
    } else {
      // If this add-on is brand new, use the passed-in enable flag.
      obj = {
        enabled: enable,
      };
    }
    await Settings.setSetting(key, obj);

    // If the add-on was previously enabled, load the add-on
    if (obj.enabled && !options.skipLoad) {
      // Now, load the add-on
      try {
        await this.loadAddon(packageId);
      } catch (e) {
        throw new Error(`Failed to load add-on ${packageId}: ${e}`);
      }
    }
  }

  /**
   * @method uninstallAddon
   *
   * @param {String} packageId The package ID to uninstall
   * @param {Boolean} wait Whether or not to wait for unloading to finish
   * @param {Boolean} disable Whether or not to disable the add-on
   * @returns A promise that resolves when the package is uninstalled.
   */
  async uninstallAddon(packageId: string, wait: boolean, disable: boolean): Promise<void> {
    try {
      // Try to gracefully unload
      await this.unloadAddon(packageId, wait);
    } catch (e) {
      console.error(`Failed to unload ${packageId} properly: ${e}`);
      // keep going
    }

    const addonPath = path.join(UserProfile.addonsDir, packageId);

    // Unload this module from the require cache
    Object.keys(require.cache).map((x) => {
      if (x.startsWith(addonPath)) {
        delete require.cache[x];
      }
    });

    // Remove the package from the file system
    if (fs.existsSync(addonPath) && fs.lstatSync(addonPath).isDirectory()) {
      await new Promise<void>((resolve, reject) => {
        rimraf(addonPath, {glob: false}, (e) => {
          if (e) {
            reject(`Error removing ${packageId}: ${e}`);
          } else {
            resolve();
          }
        });
      });
    }

    // Update the saved settings and disable the add-on
    if (disable) {
      const key = `addons.${packageId}`;
      const obj = await Settings.getSetting(key);
      if (obj) {
        obj.enabled = false;
        await Settings.setSetting(key, obj);
      }
    }

    // Remove from our list of installed add-ons
    this.installedAddons.delete(packageId);
  }

  /**
   * @method waitForAdapter
   *
   * Returns a promise which resolves to the adapter with the indicated id.
   * This function is really only used to support testing and
   * ensure that tests don't proceed until
   */
  waitForAdapter(adapterId: string): Promise<Adapter> {
    const adapter = this.getAdapter(adapterId);
    if (adapter) {
      // The adapter already exists, just create a Promise
      // that resolves to that.
      return Promise.resolve(adapter);
    }

    let deferredWait = this.deferredWaitForAdapter.get(adapterId);
    if (!deferredWait) {
      // No deferred wait currently setup. Set a new one up.
      deferredWait = new Deferred();
      this.deferredWaitForAdapter.set(adapterId, deferredWait);
    }

    return deferredWait.getPromise();
  }

  /**
   * @method updateAddons
   *
   * Attempt to update all installed add-ons.
   *
   * @param {object} options Set of options, primarily used by external scripts
   * @returns A promise which is resolved when updating is complete.
   */
  async updateAddons(options: {forceUpdateBinary?: boolean} = {}): Promise<void> {
    const urls: string[] = config.get('addonManager.listUrls');
    const architecture = Platform.getArchitecture();
    const version = pkg.version;
    const nodeVersion = Platform.getNodeVersion();
    const pythonVersions = Platform.getPythonVersions();
    const addonPath = UserProfile.addonsDir;
    const available: Record<string, {
      version: string;
      url: string;
      checksum: string;
    }> = {};

    console.log('Checking for add-on updates...');

    try {
      const params = new URLSearchParams();
      params.set('arch', architecture);
      params.set('version', version);
      params.set('node', `${nodeVersion}`);

      if (pythonVersions && pythonVersions.length > 0) {
        params.set('python', pythonVersions.join(','));
      }

      const map = new Map();

      for (const url of urls) {
        const response = await fetch(`${url}?${params.toString()}`, {
          headers: {
            Accept: 'application/json',
            'User-Agent': Utils.getGatewayUserAgent(),
          },
        });

        const addons: Record<string, unknown>[] = await response.json();
        for (const addon of addons) {
          // Check for duplicates, keep newest.
          if (map.has(addon.id) &&
              semver.gte(map.get(addon.id).version, `${addon.version}`)) {
            continue;
          }

          map.set(addon.id, addon);
        }
      }

      for (const addon of map.values()) {
        available[`${addon.id}`] = {
          version: addon.version,
          url: addon.url,
          checksum: addon.checksum,
        };
      }
    } catch (e) {
      console.error('Failed to parse add-on list:', e);
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

      for (const addonId of files) {
        // Skip if not a directory. Use stat rather than lstat such that we
        // also load through symlinks.
        if (!fs.statSync(path.join(addonPath, addonId)).isDirectory()) {
          continue;
        }

        // Skip if .git directory is present.
        if (fs.existsSync(path.join(addonPath, addonId, '.git'))) {
          console.log(
            `Not updating ${addonId} since a .git directory was detected`);
          continue;
        }

        if (options.forceUpdateBinary) {
          // If the add-on has binary node extensions, it needs to be updated.
          const addonIdPath = path.join(addonPath, addonId);
          const binFiles = find.fileSync(/\.node$/, addonIdPath);
          if (binFiles.length > 0 && available.hasOwnProperty(addonId)) {
            try {
              await this.installAddonFromUrl(
                addonId,
                available[addonId].url,
                available[addonId].checksum,
                false,
                options
              );
            } catch (e) {
              console.error(`Failed to update ${addonId}: ${e}`);
            }

            continue;
          }
        }

        // Try to load package.json.
        const packageJson = path.join(addonPath, addonId, 'package.json');
        const manifestJson = path.join(addonPath, addonId, 'manifest.json');
        let manifest;
        if (fs.existsSync(packageJson)) {
          try {
            const data = fs.readFileSync(packageJson);
            manifest = JSON.parse(data.toString());
          } catch (e) {
            console.error(`Failed to read package.json: ${packageJson}\n${e}`);
            continue;
          }
        } else if (fs.existsSync(manifestJson)) {
          try {
            const data = fs.readFileSync(manifestJson);
            manifest = JSON.parse(data.toString());
          } catch (e) {
            console.error(
              `Failed to read manifest.json: ${manifestJson}\n${e}`
            );
            continue;
          }
        } else {
          continue;
        }

        // Check if an update is available.
        if (available.hasOwnProperty(addonId) &&
            semver.lt(manifest.version, available[addonId].version)) {
          try {
            await this.installAddonFromUrl(
              addonId,
              available[addonId].url,
              available[addonId].checksum,
              false,
              options
            );
          } catch (e) {
            console.error(`Failed to update ${addonId}: ${e}`);
          }
        }
      }

      console.log('Finished updating add-ons');
    });
  }

  getInstalledAddons(): Map<string, any> {
    return this.installedAddons;
  }

  getPluginServer(): any | null {
    return this.pluginServer;
  }
}

export default new AddonManager();
