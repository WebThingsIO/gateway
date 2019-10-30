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

const AdapterProxy = require('./adapter-proxy');
const APIHandlerProxy = require('./api-handler-proxy');
const appInstance = require('../app-instance');
const config = require('config');
const Constants = require('../constants');
const db = require('../db');
const Deferred = require('../deferred');
const DeviceProxy = require('./device-proxy');
const format = require('string-format');
const {IpcSocket} = require('gateway-addon');
const {LogSeverity} = require('../constants');
const NotifierProxy = require('./notifier-proxy');
const OutletProxy = require('./outlet-proxy');
const path = require('path');
const readline = require('readline');
const Settings = require('../models/settings');
const spawn = require('child_process').spawn;
const Things = require('../models/things');
const UserProfile = require('../user-profile');
const {
  DONT_RESTART_EXIT_CODE,
  MessageType,
} = require('gateway-addon').Constants;

const DEBUG = false;

db.open();

class Plugin {

  constructor(pluginId, pluginServer, forceEnable = false) {
    this.pluginId = pluginId;
    this.pluginServer = pluginServer;
    this.logPrefix = pluginId.replace('-adapter', '');

    this.adapters = new Map();
    this.notifiers = new Map();
    this.apiHandlers = new Map();
    this.ipcBaseAddr = `gateway.plugin.${this.pluginId}`;

    this.ipcSocket = new IpcSocket('AdapterProxy', 'pair',
                                   config.get('ipc.protocol'),
                                   this.ipcBaseAddr,
                                   this.onMsg.bind(this),
                                   appInstance.get());
    this.ipcSocket.bind();
    this.exec = '';
    this.execPath = '.';
    this.forceEnable = forceEnable;
    this.startPromise = null;

    // Make this a nested object such that if the Plugin object is reused,
    // i.e. the plugin is disabled and quickly re-enabled, the gateway process
    // can maintain a proper reference to the process object.
    this.process = {p: null};

    this.restart = true;
    this.restartDelay = 0;
    this.lastRestart = 0;
    this.pendingRestart = null;
    this.unloadCompletedPromise = null;
    this.unloadedRcvdPromise = null;

    this.nextId = 0;
    this.requestActionPromises = new Map();
    this.removeActionPromises = new Map();
    this.setPinPromises = new Map();
    this.setCredentialsPromises = new Map();
    this.notifyPromises = new Map();
    this.apiRequestPromises = new Map();
  }

  asDict() {
    let pid = 'not running';
    if (this.process.p) {
      pid = this.process.p.pid;
    }
    return {
      pluginId: this.pluginId,
      ipcBaseAddr: this.ipcBaseAddr,
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

  onMsg(msg) {
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
        const messageId = msg.data.messageId;
        const deferred = this.setPinPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }

        if (msg.data.success) {
          const adapter = this.adapters.get(msg.data.adapterId);
          const deviceId = msg.data.device.id;
          const device = new DeviceProxy(adapter, msg.data.device);
          adapter.devices[deviceId] = device;
          adapter.manager.devices[deviceId] = device;
          deferred.resolve(msg.data.device);
        } else {
          deferred.reject();
        }

        this.setPinPromises.delete(messageId);
        return;
      }
      case MessageType.DEVICE_SET_CREDENTIALS_RESPONSE: {
        const messageId = msg.data.messageId;
        const deferred = this.setCredentialsPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }

        if (msg.data.success) {
          const adapter = this.adapters.get(msg.data.adapterId);
          const deviceId = msg.data.device.id;
          const device = new DeviceProxy(adapter, msg.data.device);
          adapter.devices[deviceId] = device;
          adapter.manager.devices[deviceId] = device;
          deferred.resolve(msg.data.device);
        } else {
          deferred.reject();
        }

        this.setCredentialsPromises.delete(messageId);
        return;
      }
      case MessageType.API_HANDLER_API_RESPONSE: {
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

    const adapterId = msg.data.adapterId;
    const notifierId = msg.data.notifierId;
    let adapter, notifier, apiHandler;

    // The second switch manages plugin level messages.
    switch (msg.messageType) {
      case MessageType.ADAPTER_ADDED_NOTIFICATION: {
        adapter = new AdapterProxy(this.pluginServer.manager,
                                   adapterId,
                                   msg.data.name,
                                   msg.data.packageName,
                                   this);
        this.adapters.set(adapterId, adapter);
        this.pluginServer.addAdapter(adapter);

        // Tell the adapter about all saved things
        const send = (thing) => {
          adapter.sendMsg(
            MessageType.DEVICE_SAVED_NOTIFICATION,
            {
              deviceId: thing.id,
              device: thing.getDescription(),
            }
          );
        };

        Things.getThings().then((things) => {
          things.forEach(send);
        });
        Things.on(Constants.THING_ADDED, send);
        return;
      }
      case MessageType.NOTIFIER_ADDED_NOTIFICATION:
        notifier = new NotifierProxy(this.pluginServer.manager,
                                     notifierId,
                                     msg.data.name,
                                     msg.data.packageName,
                                     this);
        this.notifiers.set(notifierId, notifier);
        this.pluginServer.addNotifier(notifier);
        return;

      case MessageType.API_HANDLER_ADDED_NOTIFICATION:
        apiHandler = new APIHandlerProxy(this.pluginServer.manager,
                                         msg.data.packageName,
                                         this);
        this.apiHandlers.set(msg.data.packageName, apiHandler);
        this.pluginServer.addAPIHandler(apiHandler);
        return;

      case MessageType.API_HANDLER_UNLOAD_RESPONSE: {
        const packageName = msg.data.packageName;
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
          const socketsClosedPromise = new Deferred();
          if (config.get('ipc.protocol') === 'inproc') {
            // In test mode we want to wait until the sockets are actually
            // closed before we resolve the unloadCompletedPromise.
            this.unloadedRcvdPromise.resolve(socketsClosedPromise);
            this.unloadedRcvdPromise = null;
          } else {
            // For non-test mode, the plugin is out-of-process so there is no
            // way for us to know when then sockets are closed. We won't try
            // try to restart the plugin until it exits, so there isn't any
            // problem with resolving the unloadCompletedPromise right away.
            socketsClosedPromise.resolve();
          }
          socketsClosedPromise.promise.then(() => {
            if (this.unloadCompletedPromise) {
              this.unloadCompletedPromise.resolve();
              this.unloadCompletedPromise = null;
            }
          });
        }
        return;

      case MessageType.PLUGIN_ERROR_NOTIFICATION:
        this.pluginServer.emit('log', {
          severity: LogSeverity.ERROR,
          message: msg.data.message,
        });
        return;
    }

    // The next switch deals with adapter level messages

    adapter = this.adapters.get(adapterId);
    if (adapterId && !adapter) {
      console.error('Plugin:', this.pluginId,
                    'Unrecognized adapter:', adapterId,
                    'Ignoring msg:', msg);
      return;
    }

    notifier = this.notifiers.get(notifierId);
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

      case MessageType.ADAPTER_UNLOAD_RESPONSE:
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

      case MessageType.DEVICE_ADDED_NOTIFICATION:
        device = new DeviceProxy(adapter, msg.data.device);
        adapter.handleDeviceAdded(device);
        break;

      case MessageType.ADAPTER_REMOVE_DEVICE_RESPONSE:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          adapter.handleDeviceRemoved(device);
        }
        break;

      case MessageType.OUTLET_ADDED_NOTIFICATION:
        outlet = new OutletProxy(notifier, msg.data.outlet);
        notifier.handleOutletAdded(outlet);
        break;

      case MessageType.OUTLET_REMOVED_NOTIFICATION:
        outlet = notifier.getOutlet(msg.data.outletId);
        if (outlet) {
          notifier.handleOutletRemoved(outlet);
        }
        break;

      case MessageType.DEVICE_PROPERTY_CHANGED_NOTIFICATION:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          property = device.findProperty(msg.data.property.name);
          if (property) {
            property.doPropertyChanged(msg.data.property);
            if (property.isVisible()) {
              device.notifyPropertyChanged(property);
            }
          }
        }
        break;

      case MessageType.DEVICE_ACTION_STATUS_NOTIFICATION:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          device.actionNotify(msg.data.action);
        }
        break;

      case MessageType.DEVICE_EVENT_NOTIFICATION:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          device.eventNotify(msg.data.event);
        }
        break;

      case MessageType.DEVICE_CONNECTED_STATE_NOTIFICATION:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          device.connectedNotify(msg.data.connected);
        }
        break;

      case MessageType.ADAPTER_PAIRING_PROMPT_NOTIFICATION: {
        let message = `${adapter.name}: `;
        if (msg.data.hasOwnProperty('deviceId')) {
          device = adapter.getDevice(msg.data.deviceId);
          message += `(${device.title}): `;
        }

        message += msg.data.prompt;

        const data = {
          severity: LogSeverity.PROMPT,
          message,
        };

        if (msg.data.hasOwnProperty('url')) {
          data.url = msg.data.url;
        }

        this.pluginServer.emit('log', data);
        return;
      }
      case MessageType.ADAPTER_UNPAIRING_PROMPT_NOTIFICATION: {
        let message = `${adapter.name}`;
        if (msg.data.hasOwnProperty('deviceId')) {
          device = adapter.getDevice(msg.data.deviceId);
          message += ` (${device.title})`;
        }

        message += `: ${msg.data.prompt}`;

        const data = {
          severity: LogSeverity.PROMPT,
          message,
        };

        if (msg.data.hasOwnProperty('url')) {
          data.url = msg.data.url;
        }

        this.pluginServer.emit('log', data);
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
  generateMsgId() {
    return ++this.nextId;
  }

  sendMsg(methodType, data, deferred) {
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

    return this.ipcSocket.sendJson(msg);
  }

  /**
   * Does cleanup required to allow the test suite to complete cleanly.
   */
  shutdown() {
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
    this.ipcSocket.close();
  }

  start() {
    const key = `addons.${this.pluginId}`;

    this.startPromise = Settings.get(key).then((savedSettings) => {
      if (!this.forceEnable &&
          (!savedSettings || !savedSettings.enabled)) {
        console.error(`Plugin ${this.pluginId} not enabled, so not starting.`);
        this.restart = false;
        this.process.p = null;
        return;
      }

      const execArgs = {
        nodeLoader: `node ${path.join(UserProfile.gatewayDir,
                                      'src',
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
                               MOZIOT_HOME: UserProfile.baseDir,
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
          if (code == DONT_RESTART_EXIT_CODE) {
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

  unload() {
    this.restart = false;
    this.unloadedRcvdPromise = new Deferred();
    this.sendMsg(MessageType.PLUGIN_UNLOAD_REQUEST, {});
  }
}

module.exports = Plugin;
