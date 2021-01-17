/**
 * @module Plugin
 *
 * Object created for each plugin that the gateway talks to.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import AdapterProxy from './adapter-proxy';
import APIHandlerProxy from './api-handler-proxy';
import * as Constants from '../constants';
import Database from '../db';
import Deferred from '../deferred';
import DeviceProxy from './device-proxy';
import format from 'string-format';
import NotifierProxy from './notifier-proxy';
import OutletProxy from './outlet-proxy';
import path from 'path';
import readline from 'readline';
import * as Settings from '../models/settings';
import {ChildProcessWithoutNullStreams, spawn} from 'child_process';
const Things = require('../models/things');
import PluginServer from './plugin-server';
import UserProfile from '../user-profile';
import {Constants as AddonConstants} from 'gateway-addon';
import {AdapterAddedNotificationMessageData,
  AdapterPairingPromptNotificationMessageData,
  AdapterRemoveDeviceResponseMessageData,
  AdapterUnpairingPromptNotificationMessageData,
  APIHandlerAddedNotificationMessageData,
  APIHandlerAPIResponseMessageData,
  APIHandlerUnloadResponseMessageData,
  DeviceActionStatusNotificationMessageData,
  DeviceAddedNotificationMessageData,
  DeviceConnectedStateNotificationMessageData,
  DeviceEventNotificationMessageData,
  DevicePropertyChangedNotificationMessageData,
  DeviceSetCredentialsResponseMessageData,
  DeviceSetPINResponseMessageData,
  Message,
  NotifierAddedNotificationMessageData,
  OutletRemovedNotificationMessageData} from 'gateway-addon/lib/schema';
import PropertyProxy from './property-proxy';

const MessageType = AddonConstants.MessageType;

const DEBUG = false;

type AddonManager = any;
type Thing = any;

Database.open();

export default class Plugin {
  private logPrefix: string;

  private adapters = new Map<string, AdapterProxy>();

  private notifiers = new Map<string, NotifierProxy>();

  private apiHandlers = new Map<string, APIHandlerProxy>();

  private exec = '';

  private execPath = '.';

  private startPromise?: Promise<void>;

  // Make this a nested object such that if the Plugin object is reused,
  // i.e. the plugin is disabled and quickly re-enabled, the gateway process
  // can maintain a proper reference to the process object.
  private process: {p: ChildProcessWithoutNullStreams | null} = {p: null};

  private restart = true;

  private restartDelay = 0;

  private lastRestart = 0;

  private pendingRestart: NodeJS.Timeout | null = null;

  private unloadCompletedPromise: any = null;

  private unloadedRcvdPromise?: Deferred<void, void>;

  private nextId = 0;

  private requestActionPromises = new Map();

  private removeActionPromises = new Map();

  private setPinPromises = new Map();

  private setCredentialsPromises = new Map();

  private notifyPromises = new Map();

  private apiRequestPromises = new Map();

  private ws?: WebSocket;

  private stdoutReadline?: readline.Interface;

  private stderrReadline?: readline.Interface;

  constructor(
    private pluginId: string,
    private pluginServer: PluginServer,
    private forceEnable = false) {
    this.logPrefix = pluginId;
  }

  asDict(): Record<string, unknown> {
    let pid: string | number = 'not running';
    if (this.process.p) {
      pid = this.process.p.pid;
    }
    return {
      pluginId: this.pluginId,
      adapters: Array.from(this.adapters.values()).map((adapter) => {
        return adapter.asDict();
      }),
      notifiers: Array.from(this.notifiers.values()).map((notifier) => {
        return notifier.asDict();
      }),
      exec: this.exec,
      pid,
    };
  }

  onMsg(msg: Message): void {
    DEBUG && console.log('Plugin: Rcvd Msg', msg);

    // The first switch manages action method resolved or rejected messages.
    switch (msg.messageType) {
      case MessageType.DEVICE_REQUEST_ACTION_RESPONSE: {
        const actionId = msg.data.actionId;
        const deferred = this.requestActionPromises.get(actionId);
        if (typeof actionId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized action id:', actionId,
                        'Ignoring msg:', msg);
          return;
        }

        if (msg.data.success) {
          deferred.resolve();
        } else {
          deferred.reject();
        }

        this.requestActionPromises.delete(actionId);
        return;
      }
      case MessageType.DEVICE_REMOVE_ACTION_RESPONSE: {
        const messageId = msg.data.messageId;
        const deferred = this.removeActionPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }

        if (msg.data.success) {
          deferred.resolve();
        } else {
          deferred.reject();
        }

        this.removeActionPromises.delete(messageId);
        return;
      }
      case MessageType.OUTLET_NOTIFY_RESPONSE: {
        const messageId = msg.data.messageId;
        const deferred = this.notifyPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }

        if (msg.data.success) {
          deferred.resolve();
        } else {
          deferred.reject();
        }

        this.notifyPromises.delete(messageId);
        return;
      }
      case MessageType.DEVICE_SET_PIN_RESPONSE: {
        const data = msg as unknown as DeviceSetPINResponseMessageData;
        const messageId = data.messageId;
        const deferred = this.setPinPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }

        const adapter = this.adapters.get(data.adapterId);

        if (adapter && data.success && data.device) {
          const deviceId = data.device.id;
          const device = new DeviceProxy(adapter, data.device);
          adapter.getDevices()[deviceId] = device;
          (adapter.getManager() as AddonManager).devices[deviceId] = device;
          deferred.resolve(msg.data.device);
        } else {
          deferred.reject();
        }

        this.setPinPromises.delete(messageId);
        return;
      }
      case MessageType.DEVICE_SET_CREDENTIALS_RESPONSE: {
        const data = msg as unknown as DeviceSetCredentialsResponseMessageData;
        const messageId = data.messageId;
        const deferred = this.setCredentialsPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }

        const adapter = this.adapters.get(data.adapterId);

        if (adapter && data.device && data.success) {
          const deviceId = data.device.id;
          const device = new DeviceProxy(adapter, data.device);
          adapter.getDevices()[deviceId] = device;
          (adapter.getManager() as AddonManager).devices[deviceId] = device;
          deferred.resolve(msg.data.device);
        } else {
          deferred.reject();
        }

        this.setCredentialsPromises.delete(messageId);
        return;
      }
      case MessageType.API_HANDLER_API_RESPONSE: {
        const data = msg as unknown as APIHandlerAPIResponseMessageData;
        const messageId = data.messageId;
        const deferred = this.apiRequestPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }
        deferred.resolve(data.response);
        this.apiRequestPromises.delete(messageId);
        return;
      }
    }

    // The second switch manages plugin level messages.
    switch (msg.messageType) {
      case MessageType.ADAPTER_ADDED_NOTIFICATION: {
        const data = msg as unknown as AdapterAddedNotificationMessageData;
        const adapter = new AdapterProxy(this.pluginServer.getAddonManager(),
                                         data.adapterId,
                                         data.name,
                                         data.packageName,
                                         this);
        this.adapters.set(data.adapterId, adapter);
        this.pluginServer.addAdapter(adapter);

        // Tell the adapter about all saved things
        const send = (thing: Thing) => {
          adapter.sendMsg(
            MessageType.DEVICE_SAVED_NOTIFICATION,
            {
              deviceId: thing.id,
              device: thing.getDescription(),
            }
          );
        };

        adapter.getEventHandlers()[Constants.THING_ADDED] = send;

        Things.getThings().then((things: Thing[]) => {
          things.forEach(send);
        });
        Things.on(Constants.THING_ADDED, send);
        return;
      }
      case MessageType.NOTIFIER_ADDED_NOTIFICATION: {
        const data = msg as unknown as NotifierAddedNotificationMessageData;
        const notifier = new NotifierProxy(this.pluginServer.getAddonManager(),
                                           data.notifierId,
                                           data.name,
                                           data.packageName,
                                           this);
        this.notifiers.set(data.notifierId, notifier);
        this.pluginServer.addNotifier(notifier);
        return;
      }

      case MessageType.API_HANDLER_ADDED_NOTIFICATION: {
        const data = msg as unknown as APIHandlerAddedNotificationMessageData;
        const apiHandler = new APIHandlerProxy(this.pluginServer.getAddonManager(),
                                               data.packageName,
                                               this);
        this.apiHandlers.set(data.packageName, apiHandler);
        this.pluginServer.addAPIHandler(apiHandler);
        return;
      }

      case MessageType.API_HANDLER_UNLOAD_RESPONSE: {
        const data = msg as unknown as APIHandlerUnloadResponseMessageData;
        const packageName = data.packageName;
        const handler = this.apiHandlers.get(packageName);

        if (!handler) {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized API handler:', packageName,
                        'Ignoring msg:', msg);
          return;
        }

        this.apiHandlers.delete(packageName);
        if (this.adapters.size === 0 &&
            this.notifiers.size === 0 &&
            this.apiHandlers.size === 0) {
          // We've unloaded everything for the plugin, now unload the plugin.
          this.unload();
          this.unloadCompletedPromise = handler.unloadCompletedPromise;
          handler.unloadCompletedPromise = null;
        } else if (handler.unloadCompletedPromise) {
          handler.unloadCompletedPromise.resolve();
          handler.unloadCompletedPromise = null;
        }

        return;
      }
      case MessageType.PLUGIN_UNLOAD_RESPONSE:
        this.shutdown();
        this.pluginServer.unregisterPlugin(msg.data.pluginId);
        if (this.unloadedRcvdPromise) {
          if (this.unloadCompletedPromise) {
            this.unloadCompletedPromise.resolve();
            this.unloadCompletedPromise = null;
          }
        }
        return;

      case MessageType.PLUGIN_ERROR_NOTIFICATION:
        this.pluginServer.emit('log', {
          severity: Constants.LogSeverity.ERROR,
          message: msg.data.message,
        });
        return;
    }

    // The next switch deals with adapter level messages

    const adapterId = msg.data.adapterId as string;
    const adapter = this.adapters.get(adapterId) as AdapterProxy;
    if (adapterId && !adapter) {
      console.error('Plugin:', this.pluginId,
                    'Unrecognized adapter:', adapterId,
                    'Ignoring msg:', msg);
      return;
    }

    const notifierId = msg.data.notifierId as string;
    const notifier = this.notifiers.get(notifierId) as NotifierProxy;
    if (notifierId && !notifier) {
      console.error('Plugin:', this.pluginId,
                    'Unrecognized notifier:', notifierId,
                    'Ignoring msg:', msg);
      return;
    }

    let device;
    let outlet;
    let property;
    let deferredMock;

    switch (msg.messageType) {

      case MessageType.ADAPTER_UNLOAD_RESPONSE: {
        const handler = adapter.getEventHandlers()[Constants.THING_ADDED];
        if (handler) {
          Things.removeListener(Constants.THING_ADDED, handler);
        }

        this.adapters.delete(adapterId);
        if (this.adapters.size === 0 &&
            this.notifiers.size === 0 &&
            this.apiHandlers.size === 0) {
          // We've unloaded everything for the plugin, now unload the plugin.

          // We may need to reevaluate this, and only auto-unload
          // the plugin for the MockAdapter. For plugins which
          // support hot-swappable dongles (like zwave/zigbee) it makes
          // sense to have a plugin loaded with no adapters present.
          this.unload();
          this.unloadCompletedPromise = adapter.unloadCompletedPromise;
          adapter.unloadCompletedPromise = null;
        } else if (adapter.unloadCompletedPromise) {
          adapter.unloadCompletedPromise.resolve();
          adapter.unloadCompletedPromise = null;
        }
        break;
      }
      case MessageType.NOTIFIER_UNLOAD_RESPONSE:
        this.notifiers.delete(notifierId);
        if (this.adapters.size === 0 &&
            this.notifiers.size === 0 &&
            this.apiHandlers.size === 0) {
          // We've unloaded everything for the plugin, now unload the plugin.
          this.unload();
          this.unloadCompletedPromise = notifier.unloadCompletedPromise;
          notifier.unloadCompletedPromise = null;
        } else if (notifier.unloadCompletedPromise) {
          notifier.unloadCompletedPromise.resolve();
          notifier.unloadCompletedPromise = null;
        }
        break;

      case MessageType.DEVICE_ADDED_NOTIFICATION: {
        const data = msg as unknown as DeviceAddedNotificationMessageData;
        device = new DeviceProxy(adapter, data.device);
        adapter.handleDeviceAdded(device);
        break;
      }

      case MessageType.ADAPTER_REMOVE_DEVICE_RESPONSE: {
        const data = msg as unknown as AdapterRemoveDeviceResponseMessageData;
        device = adapter.getDevice(data.deviceId);
        if (device) {
          adapter.handleDeviceRemoved(device);
        }
        break;
      }

      case MessageType.OUTLET_ADDED_NOTIFICATION:
        outlet = new OutletProxy(notifier, msg.data.outlet);
        notifier.handleOutletAdded(outlet);
        break;

      case MessageType.OUTLET_REMOVED_NOTIFICATION: {
        const data = msg as unknown as OutletRemovedNotificationMessageData;
        outlet = notifier.getOutlet(data.outletId);
        if (outlet) {
          notifier.handleOutletRemoved(outlet);
        }
        break;
      }

      case MessageType.DEVICE_PROPERTY_CHANGED_NOTIFICATION: {
        const data = msg as unknown as DevicePropertyChangedNotificationMessageData;
        device = adapter.getDevice(data.deviceId);
        if (device && data.property.name) {
          property = device.findProperty(data.property.name) as PropertyProxy;
          if (property) {
            property.doPropertyChanged(data.property);
            device.notifyPropertyChanged(property);
          }
        }
        break;
      }

      case MessageType.DEVICE_ACTION_STATUS_NOTIFICATION: {
        const data = msg as unknown as DeviceActionStatusNotificationMessageData;
        device = adapter.getDevice(data.deviceId);
        if (device) {
          device.actionNotify(data.action as any);
        }
        break;
      }

      case MessageType.DEVICE_EVENT_NOTIFICATION: {
        const data = msg as unknown as DeviceEventNotificationMessageData;
        device = adapter.getDevice(data.deviceId);
        if (device) {
          device.eventNotify(data.event as any);
        }
        break;
      }

      case MessageType.DEVICE_CONNECTED_STATE_NOTIFICATION: {
        const data = msg as unknown as DeviceConnectedStateNotificationMessageData;
        device = adapter.getDevice(data.deviceId);
        if (device) {
          device.connectedNotify(data.connected);
        }
        break;
      }

      case MessageType.ADAPTER_PAIRING_PROMPT_NOTIFICATION: {
        const data = msg as unknown as AdapterPairingPromptNotificationMessageData;
        let message = `${adapter.getName()}: `;
        if (data.deviceId) {
          device = adapter.getDevice(data.deviceId);
          message += `(${device.getTitle()}): `;
        }

        message += msg.data.prompt;

        const log: any = {
          severity: Constants.LogSeverity.PROMPT,
          message,
        };

        if (msg.data.hasOwnProperty('url')) {
          log.url = msg.data.url;
        }

        this.pluginServer.emit('log', log);
        return;
      }
      case MessageType.ADAPTER_UNPAIRING_PROMPT_NOTIFICATION: {
        const data = msg as unknown as AdapterUnpairingPromptNotificationMessageData;
        let message = `${adapter.getName()}`;
        if (data.deviceId) {
          device = adapter.getDevice(data.deviceId);
          message += ` (${device.getTitle()})`;
        }

        message += `: ${msg.data.prompt}`;

        const log: any = {
          severity: Constants.LogSeverity.PROMPT,
          message,
        };

        if (msg.data.hasOwnProperty('url')) {
          log.url = msg.data.url;
        }

        this.pluginServer.emit('log', log);
        return;
      }
      case MessageType.MOCK_ADAPTER_CLEAR_STATE_RESPONSE:
        deferredMock = adapter.deferredMock;
        if (!deferredMock) {
          console.error('mockAdapterStateCleared: No deferredMock');
        } else {
          adapter.deferredMock = null;
          deferredMock.resolve();
        }
        break;

      case MessageType.MOCK_ADAPTER_ADD_DEVICE_RESPONSE:
      case MessageType.MOCK_ADAPTER_REMOVE_DEVICE_RESPONSE:
        deferredMock = adapter.deferredMock;
        if (!deferredMock) {
          console.error('mockDeviceAddedRemoved: No deferredMock');
        } else if (msg.data.success) {
          device = deferredMock.device;
          adapter.deferredMock = null;
          deferredMock.device = null;
          deferredMock.resolve(device);
        } else {
          adapter.deferredMock = null;
          deferredMock.reject(msg.data.error);
        }
        break;

      default:
        console.error('Plugin: unrecognized msg:', msg);
        break;
    }
  }

  /**
   * Generate an ID for a message.
   *
   * @returns {integer} An id.
   */
  generateMsgId(): number {
    return ++this.nextId;
  }

  sendMsg(methodType: number, data: any, deferred?: Deferred<unknown, unknown>): void {
    data.pluginId = this.pluginId;

    // Methods which could fail should await result.
    if (typeof deferred !== 'undefined') {
      switch (methodType) {
        case MessageType.DEVICE_REQUEST_ACTION_REQUEST: {
          this.requestActionPromises.set(data.actionId, deferred);
          break;
        }
        case MessageType.DEVICE_REMOVE_ACTION_REQUEST: {
          // removeAction needs ID which is per message, because it
          // can be called while waiting rejected or resolved.
          data.messageId = this.generateMsgId();
          this.removeActionPromises.set(data.messageId, deferred);
          break;
        }
        case MessageType.OUTLET_NOTIFY_REQUEST: {
          data.messageId = this.generateMsgId();
          this.notifyPromises.set(data.messageId, deferred);
          break;
        }
        case MessageType.DEVICE_SET_PIN_REQUEST: {
          // removeAction needs ID which is per message, because it
          // can be called while waiting rejected or resolved.
          data.messageId = this.generateMsgId();
          this.setPinPromises.set(data.messageId, deferred);
          break;
        }
        case MessageType.DEVICE_SET_CREDENTIALS_REQUEST: {
          // removeAction needs ID which is per message, because it
          // can be called while waiting rejected or resolved.
          data.messageId = this.generateMsgId();
          this.setCredentialsPromises.set(data.messageId, deferred);
          break;
        }
        case MessageType.API_HANDLER_API_REQUEST: {
          data.messageId = this.generateMsgId();
          this.apiRequestPromises.set(data.messageId, deferred);
          break;
        }
        default:
          break;
      }
    }

    const msg = {
      messageType: methodType,
      data: data,
    };
    DEBUG && console.log('Plugin: sendMsg:', msg);

    return this.ws?.send(JSON.stringify(msg));
  }

  /**
   * Does cleanup required to allow the test suite to complete cleanly.
   */
  shutdown(): void {
    if (this.pendingRestart) {
      clearTimeout(this.pendingRestart);
    }
    this.restart = false;
    this.requestActionPromises.forEach((promise, key) => {
      promise.reject();
      this.requestActionPromises.delete(key);
    });
    this.removeActionPromises.forEach((promise, key) => {
      promise.reject();
      this.removeActionPromises.delete(key);
    });
    this.setPinPromises.forEach((promise, key) => {
      promise.reject();
      this.setPinPromises.delete(key);
    });
    this.setCredentialsPromises.forEach((promise, key) => {
      promise.reject();
      this.setCredentialsPromises.delete(key);
    });
    this.notifyPromises.forEach((promise, key) => {
      promise.reject();
      this.notifyPromises.delete(key);
    });
    this.apiRequestPromises.forEach((promise, key) => {
      promise.reject();
      this.apiRequestPromises.delete(key);
    });
  }

  start(): Promise<void> {
    const key = `addons.${this.pluginId}`;

    this.startPromise = Settings.getSetting(key).then((savedSettings) => {
      if (!this.forceEnable &&
          (!savedSettings || !savedSettings.enabled)) {
        console.error(`Plugin ${this.pluginId} not enabled, so not starting.`);
        this.restart = false;
        this.process.p = null;
        return;
      }

      const execArgs = {
        nodeLoader: `node ${path.join(UserProfile.gatewayDir,
                                      'build',
                                      'addon-loader.js')}`,
        name: this.pluginId,
        path: this.execPath,
      };
      const execCmd = format(this.exec, execArgs);

      DEBUG && console.log('  Launching:', execCmd);

      // If we need embedded spaces, then consider changing to use the npm
      // module called splitargs
      this.restart = true;
      const args = execCmd.split(' ');
      this.process.p = spawn(
        args[0],
        args.slice(1),
        {
          env: Object.assign(process.env,
                             {
                               WEBTHINGS_HOME: UserProfile.baseDir,
                               NODE_PATH: path.join(UserProfile.gatewayDir,
                                                    'node_modules'),
                             }),
        }
      );

      this.process.p.on('error', (err) => {
        // We failed to spawn the process. This most likely means that the
        // exec string is malformed somehow. Report the error but don't try
        // restarting.
        this.restart = false;
        console.error('Failed to start plugin', this.pluginId);
        console.error('Command:', this.exec);
        console.error(err);
      });

      this.stdoutReadline = readline.createInterface({
        input: this.process.p.stdout,
      });
      this.stdoutReadline.on('line', (line) => {
        console.log(`${this.logPrefix}: ${line}`);
      });

      this.stderrReadline = readline.createInterface({
        input: this.process.p.stderr,
      });
      this.stderrReadline.on('line', (line) => {
        console.error(`${this.logPrefix}: ${line}`);
      });

      this.process.p.on('exit', (code) => {
        if (this.restart) {
          if (code == AddonConstants.DONT_RESTART_EXIT_CODE) {
            console.log('Plugin:', this.pluginId, 'died, code =', code,
                        'NOT restarting...');
            this.restart = false;
            this.process.p = null;
          } else {
            if (this.pendingRestart) {
              return;
            }
            if (this.restartDelay < 30 * 1000) {
              this.restartDelay += 1000;
            }
            if (this.lastRestart + 60 * 1000 < Date.now()) {
              this.restartDelay = 0;
            }
            if (this.restartDelay > 30000) {
              // If we've restarted 30 times in a row, this is probably just
              // not going to work, so bail out.
              console.log(`Giving up on restarting plugin ${this.pluginId}`);
              this.restart = false;
              this.process.p = null;
              return;
            }
            console.log('Plugin:', this.pluginId, 'died, code =', code,
                        'restarting after', this.restartDelay);
            const doRestart = () => {
              if (this.restart) {
                this.lastRestart = Date.now();
                this.pendingRestart = null;
                this.start();
              } else {
                this.process.p = null;
              }
            };
            if (this.restartDelay > 0) {
              this.pendingRestart = setTimeout(doRestart, this.restartDelay);
            } else {
              // Restart immediately so that test code can access
              // process.p
              doRestart();
            }
          }
        } else {
          this.process.p = null;
        }
      });
    });

    return this.startPromise;
  }

  unload(): void {
    this.restart = false;
    this.unloadedRcvdPromise = new Deferred();
    this.sendMsg(MessageType.PLUGIN_UNLOAD_REQUEST, {});
  }
}
