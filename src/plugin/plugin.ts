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
import Database from '../db';
import Deferred from '../deferred';
import DeviceProxy from './device-proxy';
import format from 'string-format';
import {LogSeverity, THING_ADDED} from '../constants';
import NotifierProxy from './notifier-proxy';
import OutletProxy from './outlet-proxy';
import path from 'path';
import readline from 'readline';
import {getSetting} from '../models/settings';
import {ChildProcessWithoutNullStreams, spawn} from 'child_process';
import PluginServer from './plugin-server';
import {
  AdapterAddedNotificationMessageData,
  APIHandlerAddedNotificationMessageData,
  APIHandlerUnloadResponseMessageData,
  DeviceAddedNotificationMessageData,
  DevicePropertyChangedNotificationMessageData,
  DeviceSetCredentialsResponseMessageData,
  DeviceSetPINResponseMessageData,
  Message,
  NotifierAddedNotificationMessageData,
  OutletAddedNotificationMessageData,
} from 'gateway-addon/lib/schema';
import Thing from '../models/thing';
import UserProfile from '../user-profile';
import {AddonManagerProxy, Constants as AddonConstants} from 'gateway-addon';
import {AddonManager} from '../addon-manager';
import WebSocket from 'ws';

const DEBUG = false;

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
  private process: {p?: ChildProcessWithoutNullStreams} = {};

  private restart = true;

  private restartDelay = 0;

  private lastRestart = 0;

  private pendingRestart?: NodeJS.Timeout;

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
    private addonManager: AddonManager,
    private pluginId: string,
    private pluginServer: PluginServer,
    private forceEnable = false) {
    this.logPrefix = pluginId;
  }

  public getProcess(): ChildProcessWithoutNullStreams | undefined {
    return this.process.p;
  }

  public getWebsocket(): WebSocket | undefined {
    return this.ws;
  }

  public setWebSocket(ws: WebSocket): void {
    this.ws = ws;
  }

  public getExec(): string | undefined {
    return this.exec;
  }

  public setExec(exec: string): void {
    this.exec = exec;
  }

  public getExecPath(): string | undefined {
    return this.execPath;
  }

  public setExecPath(execPath: string): void {
    this.execPath = execPath;
  }

  asDict(): Record<string, unknown> {
    let pid: string | number = 'not running';
    if (this.process.p) {
      pid = this.process.p?.pid;
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
      case AddonConstants.MessageType.DEVICE_REQUEST_ACTION_RESPONSE: {
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
      case AddonConstants.MessageType.DEVICE_REMOVE_ACTION_RESPONSE: {
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
      case AddonConstants.MessageType.OUTLET_NOTIFY_RESPONSE: {
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
      case AddonConstants.MessageType.DEVICE_SET_PIN_RESPONSE: {
        const data: DeviceSetPINResponseMessageData = <DeviceSetPINResponseMessageData>msg.data;
        const messageId = data.messageId;
        const deferred = this.setPinPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }

        if (data.success && data.device) {
          const adapter = this.adapters.get(data.adapterId);
          if (adapter) {
            const deviceId = data.device.id;
            const device = new DeviceProxy(this.addonManager, adapter, data.device);
            adapter.getDevices()[deviceId] = device;
            (<any>adapter.getManager()).devices[deviceId] = device;
            deferred.resolve(data.device);
          }
        } else {
          deferred.reject();
        }

        this.setPinPromises.delete(messageId);
        return;
      }
      case AddonConstants.MessageType.DEVICE_SET_CREDENTIALS_RESPONSE: {
        const data: DeviceSetCredentialsResponseMessageData =
        <DeviceSetCredentialsResponseMessageData><unknown>msg.data;
        const messageId = msg.data.messageId;
        const deferred = this.setCredentialsPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }

        if (msg.data.success && data.device) {
          const adapter = this.adapters.get(data.adapterId);
          if (adapter) {
            const deviceId = data.device.id;
            const device = new DeviceProxy(this.addonManager, adapter, data.device);
            adapter.getDevices()[deviceId] = device;
            (<AddonManager><unknown>adapter.getManager()).getDevices()[deviceId] = device;
            deferred.resolve(msg.data.device);
          } else {
            deferred.reject();
          }
        } else {
          deferred.reject();
        }

        this.setCredentialsPromises.delete(messageId);
        return;
      }
      case AddonConstants.MessageType.API_HANDLER_API_RESPONSE: {
        const messageId = msg.data.messageId;
        const deferred = this.apiRequestPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }
        deferred.resolve(msg.data.response);
        this.apiRequestPromises.delete(messageId);
        return;
      }
    }

    // The second switch manages plugin level messages.
    switch (msg.messageType) {
      case AddonConstants.MessageType.ADAPTER_ADDED_NOTIFICATION: {
        const data: AdapterAddedNotificationMessageData =
        <AdapterAddedNotificationMessageData>msg.data;
        const adapter = new AdapterProxy(this.addonManager,
                                         data.adapterId,
                                         data.name,
                                         data.packageName,
                                         this);
        this.adapters.set(data.adapterId, adapter);
        this.pluginServer.addAdapter(adapter);

        // Tell the adapter about all saved things
        const send = (thing: Thing) => {
          adapter.sendMsg(
            AddonConstants.MessageType.DEVICE_SAVED_NOTIFICATION,
            {
              deviceId: thing.getId(),
              device: (<any>thing).getDescription(),
            }
          );
        };

        adapter.getEventHandlers()[THING_ADDED] = send;

        this.addonManager.getThingsCollection().getThings().then((things) => {
          things.forEach(send);
        });
        this.addonManager.getThingsCollection().on(THING_ADDED, send);
        return;
      }
      case AddonConstants.MessageType.NOTIFIER_ADDED_NOTIFICATION: {
        const data: NotifierAddedNotificationMessageData =
        <NotifierAddedNotificationMessageData>msg.data;
        const notifier = new NotifierProxy(
          <AddonManagerProxy><unknown> this.pluginServer.getAddonManager(),
          data.notifierId,
          data.name,
          data.packageName,
          this);
        this.notifiers.set(data.notifierId, notifier);
        this.pluginServer.addNotifier(notifier);
        return;
      }

      case AddonConstants.MessageType.API_HANDLER_ADDED_NOTIFICATION: {
        const data: APIHandlerAddedNotificationMessageData =
        <APIHandlerAddedNotificationMessageData>msg.data;
        const apiHandler = new APIHandlerProxy(
          <AddonManagerProxy><unknown> this.pluginServer.getAddonManager(),
          data.packageName,
          this);
        this.apiHandlers.set(data.packageName, apiHandler);
        this.pluginServer.addAPIHandler(apiHandler);
        return;
      }

      case AddonConstants.MessageType.API_HANDLER_UNLOAD_RESPONSE: {
        const data: APIHandlerUnloadResponseMessageData =
        <APIHandlerUnloadResponseMessageData>msg.data;
        const packageName = data.packageName;
        const handler: any = this.apiHandlers.get(packageName);

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
      case AddonConstants.MessageType.PLUGIN_UNLOAD_RESPONSE:
        this.shutdown();
        this.pluginServer.unregisterPlugin(msg.data.pluginId);
        if (this.unloadedRcvdPromise) {
          if (this.unloadCompletedPromise) {
            this.unloadCompletedPromise.resolve();
            this.unloadCompletedPromise = null;
          }
        }
        return;

      case AddonConstants.MessageType.PLUGIN_ERROR_NOTIFICATION:
        this.pluginServer.emit('log', {
          severity: LogSeverity.ERROR,
          message: msg.data.message,
        });
        return;
    }

    // The next switch deals with adapter level messages

    const adapterId = <string>msg.data.adapterId;
    const adapter: any = this.adapters.get(<string>adapterId);
    if (adapterId && !adapter) {
      console.error('Plugin:', this.pluginId,
                    'Unrecognized adapter:', adapterId,
                    'Ignoring msg:', msg);
      return;
    }

    const notifierId = <string>msg.data.notifierId;
    const notifier: any = <NotifierProxy> this.notifiers.get(<string>notifierId);
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

      case AddonConstants.MessageType.ADAPTER_UNLOAD_RESPONSE: {
        const handler = adapter.getEventHandlers()[THING_ADDED];
        if (handler) {
          this.addonManager.getThingsCollection().removeListener(THING_ADDED, handler);
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
      case AddonConstants.MessageType.NOTIFIER_UNLOAD_RESPONSE:
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

      case AddonConstants.MessageType.DEVICE_ADDED_NOTIFICATION: {
        const data: DeviceAddedNotificationMessageData =
        <DeviceAddedNotificationMessageData>msg.data;
        device = new DeviceProxy(this.addonManager, adapter, data.device);
        adapter.handleDeviceAdded(device);
        break;
      }

      case AddonConstants.MessageType.ADAPTER_REMOVE_DEVICE_RESPONSE:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          adapter.handleDeviceRemoved(device);
        }
        break;

      case AddonConstants.MessageType.OUTLET_ADDED_NOTIFICATION: {
        const data: OutletAddedNotificationMessageData =
        <OutletAddedNotificationMessageData>msg.data;
        outlet = new OutletProxy(notifier, data.outlet);
        notifier.handleOutletAdded(outlet);
        break;
      }

      case AddonConstants.MessageType.OUTLET_REMOVED_NOTIFICATION:
        outlet = notifier.getOutlet(msg.data.outletId);
        if (outlet) {
          notifier.handleOutletRemoved(outlet);
        }
        break;

      case AddonConstants.MessageType.DEVICE_PROPERTY_CHANGED_NOTIFICATION: {
        const data: DevicePropertyChangedNotificationMessageData =
        <DevicePropertyChangedNotificationMessageData>msg.data;
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          property = device.findProperty(data.property.name);
          if (property) {
            property.doPropertyChanged(msg.data.property);
            device.notifyPropertyChanged(property);
          }
        }
        break;
      }
      case AddonConstants.MessageType.DEVICE_ACTION_STATUS_NOTIFICATION:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          device.actionNotify(msg.data.action);
        }
        break;

      case AddonConstants.MessageType.DEVICE_EVENT_NOTIFICATION:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          device.eventNotify(msg.data.event);
        }
        break;

      case AddonConstants.MessageType.DEVICE_CONNECTED_STATE_NOTIFICATION:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          device.connectedNotify(msg.data.connected);
        }
        break;

      case AddonConstants.MessageType.ADAPTER_PAIRING_PROMPT_NOTIFICATION: {
        let message = `${adapter.name}: `;
        if (msg.data.hasOwnProperty('deviceId')) {
          device = adapter.getDevice(msg.data.deviceId);
          message += `(${device.title}): `;
        }

        message += msg.data.prompt;

        const data: Record<string, unknown> = {
          severity: LogSeverity.PROMPT,
          message,
        };

        if (msg.data.hasOwnProperty('url')) {
          data.url = msg.data.url;
        }

        this.pluginServer.emit('log', data);
        return;
      }
      case AddonConstants.MessageType.ADAPTER_UNPAIRING_PROMPT_NOTIFICATION: {
        let message = `${adapter.name}`;
        if (msg.data.hasOwnProperty('deviceId')) {
          device = adapter.getDevice(msg.data.deviceId);
          message += ` (${device.title})`;
        }

        message += `: ${msg.data.prompt}`;

        const data: Record<string, unknown> = {
          severity: LogSeverity.PROMPT,
          message,
        };

        if (msg.data.hasOwnProperty('url')) {
          data.url = msg.data.url;
        }

        this.pluginServer.emit('log', data);
        return;
      }
      case AddonConstants.MessageType.MOCK_ADAPTER_CLEAR_STATE_RESPONSE:
        deferredMock = adapter.deferredMock;
        if (!deferredMock) {
          console.error('mockAdapterStateCleared: No deferredMock');
        } else {
          adapter.deferredMock = null;
          deferredMock.resolve();
        }
        break;

      case AddonConstants.MessageType.MOCK_ADAPTER_ADD_DEVICE_RESPONSE:
      case AddonConstants.MessageType.MOCK_ADAPTER_REMOVE_DEVICE_RESPONSE:
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

  sendMsg<T extends unknown>(
    methodType: number, data: Record<string, unknown>,
    deferred?: Deferred<T, unknown>): void {
    data.pluginId = this.pluginId;

    // Methods which could fail should await result.
    if (typeof deferred !== 'undefined') {
      switch (methodType) {
        case AddonConstants.MessageType.DEVICE_REQUEST_ACTION_REQUEST: {
          this.requestActionPromises.set(data.actionId, deferred);
          break;
        }
        case AddonConstants.MessageType.DEVICE_REMOVE_ACTION_REQUEST: {
          // removeAction needs ID which is per message, because it
          // can be called while waiting rejected or resolved.
          data.messageId = this.generateMsgId();
          this.removeActionPromises.set(data.messageId, deferred);
          break;
        }
        case AddonConstants.MessageType.OUTLET_NOTIFY_REQUEST: {
          data.messageId = this.generateMsgId();
          this.notifyPromises.set(data.messageId, deferred);
          break;
        }
        case AddonConstants.MessageType.DEVICE_SET_PIN_REQUEST: {
          // removeAction needs ID which is per message, because it
          // can be called while waiting rejected or resolved.
          data.messageId = this.generateMsgId();
          this.setPinPromises.set(data.messageId, deferred);
          break;
        }
        case AddonConstants.MessageType.DEVICE_SET_CREDENTIALS_REQUEST: {
          // removeAction needs ID which is per message, because it
          // can be called while waiting rejected or resolved.
          data.messageId = this.generateMsgId();
          this.setCredentialsPromises.set(data.messageId, deferred);
          break;
        }
        case AddonConstants.MessageType.API_HANDLER_API_REQUEST: {
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

    this?.ws?.send(JSON.stringify(msg));
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

    this.startPromise = getSetting(key).then((savedSettings) => {
      if (!this.forceEnable &&
          (!savedSettings || !savedSettings.enabled)) {
        console.error(`Plugin ${this.pluginId} not enabled, so not starting.`);
        this.restart = false;
        delete this.process.p;
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

      this?.process.p?.on('exit', (code) => {
        if (this.restart) {
          if (code == AddonConstants.DONT_RESTART_EXIT_CODE) {
            console.log('Plugin:', this.pluginId, 'died, code =', code,
                        'NOT restarting...');
            this.restart = false;
            delete this.process.p;
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
              delete this.process.p;
              return;
            }
            console.log('Plugin:', this.pluginId, 'died, code =', code,
                        'restarting after', this.restartDelay);
            const doRestart = () => {
              if (this.restart) {
                this.lastRestart = Date.now();
                delete this.pendingRestart;
                this.start();
              } else {
                delete this.process.p;
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
          delete this.process.p;
        }
      });
    });

    return this.startPromise;
  }

  unload(): void {
    this.restart = false;
    this.unloadedRcvdPromise = new Deferred();
    this.sendMsg(AddonConstants.MessageType.PLUGIN_UNLOAD_REQUEST, {});
  }
}
