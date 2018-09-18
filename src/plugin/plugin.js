/**
 * @module Plugin
 *
 * Object created for each plugin that the gateway talks to.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const AdapterProxy = require('./adapter-proxy');
const config = require('config');
const Constants = require('../constants');
const Deferred = require('../deferred');
const DeviceProxy = require('./device-proxy');
const format = require('string-format');
const IpcSocket = require('./ipc');
const readline = require('readline');
const spawn = require('child_process').spawn;
const path = require('path');
const UserProfile = require('../user-profile');

const DEBUG = false;

class Plugin {

  constructor(pluginId, pluginServer) {
    this.pluginId = pluginId;
    this.pluginServer = pluginServer;
    this.logPrefix = pluginId.replace('-adapter', '');

    this.adapters = new Map();
    this.ipcBaseAddr = `gateway.plugin.${this.pluginId}`;

    this.ipcSocket = new IpcSocket('AdapterProxy', 'pair',
                                   this.ipcBaseAddr,
                                   this.onMsg.bind(this));
    this.ipcSocket.bind();
    this.exec = '';
    this.execPath = '.';

    // Make this a nested object such that if the Plugin object is reused,
    // i.e. the plugin is disabled and quickly re-enabled, the gateway process
    // can maintain a proper reference to the process object.
    this.process = {p: null};

    this.restart = true;
    this.unloadCompletedPromise = null;
    this.unloadedRcvdPromise = null;

    this.nextId = 0;
    this.requestActionPromises = new Map();
    this.removeActionPromises = new Map();
    this.setPinPromises = new Map();
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
      exec: this.exec,
      pid: pid,
    };
  }

  onMsg(msg) {
    DEBUG && console.log('Plugin: Rcvd Msg', msg);

    // The first switch manages action method resolved or rejected messages.
    switch (msg.messageType) {
      case Constants.REQUEST_ACTION_RESOLVED: {
        const actionId = msg.data.actionId;
        const deferred = this.requestActionPromises.get(actionId);
        if (typeof actionId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized action id:', actionId,
                        'Ignoring msg:', msg);
          return;
        }
        deferred.resolve();
        this.requestActionPromises.delete(actionId);
        return;
      }
      case Constants.REQUEST_ACTION_REJECTED: {
        const actionId = msg.data.actionId;
        const deferred = this.requestActionPromises.get(actionId);
        if (typeof actionId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized action id:', actionId,
                        'Ignoring msg:', msg);
          return;
        }
        deferred.reject();
        this.requestActionPromises.delete(actionId);
        return;
      }
      case Constants.REMOVE_ACTION_RESOLVED: {
        const messageId = msg.data.messageId;
        const deferred = this.removeActionPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }
        deferred.resolve();
        this.removeActionPromises.delete(messageId);
        return;
      }
      case Constants.REMOVE_ACTION_REJECTED: {
        const messageId = msg.data.messageId;
        const deferred = this.removeActionPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }
        deferred.reject();
        this.removeActionPromises.delete(messageId);
        return;
      }
      case Constants.SET_PIN_RESOLVED: {
        const messageId = msg.data.messageId;
        const deferred = this.setPinPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }
        const adapter = this.adapters.get(msg.data.adapterId);
        const deviceId = msg.data.device.id;
        const device = new DeviceProxy(adapter, msg.data.device);
        adapter.devices[deviceId] = device;
        adapter.manager.devices[deviceId] = device;
        deferred.resolve(msg.data.device);
        this.setPinPromises.delete(messageId);
        return;
      }
      case Constants.SET_PIN_REJECTED: {
        const messageId = msg.data.messageId;
        const deferred = this.setPinPromises.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }
        deferred.reject();
        this.setPinPromises.delete(messageId);
        return;
      }
    }

    const adapterId = msg.data.adapterId;
    let adapter;

    // The second switch manages plugin level messages.
    switch (msg.messageType) {
      case Constants.ADD_ADAPTER:
        adapter = new AdapterProxy(this.pluginServer.manager,
                                   adapterId,
                                   msg.data.name,
                                   msg.data.packageName,
                                   this);
        this.adapters.set(adapterId, adapter);
        this.pluginServer.addAdapter(adapter);
        return;

      case Constants.PLUGIN_UNLOADED:
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

      case Constants.PLUGIN_ERROR:
        this.pluginServer.emit('log', {
          severity: Constants.LogSeverity.ERROR,
          message: msg.data.message,
        });
        return;
    }

    // The next switch deals with adapter level messages

    adapter = this.adapters.get(adapterId);
    if (!adapter) {
      console.error('Plugin:', this.pluginId,
                    'Unrecognized adapter:', adapterId,
                    'Ignoring msg:', msg);
      return;
    }

    let device;
    let property;
    let deferredMock;

    switch (msg.messageType) {

      case Constants.ADAPTER_UNLOADED:
        this.adapters.delete(adapterId);
        if (this.adapters.size == 0) {
          // We've unloaded the last adapter for the plugin, now unload
          // the plugin.

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

      case Constants.HANDLE_DEVICE_ADDED:
        device = new DeviceProxy(adapter, msg.data);
        adapter.handleDeviceAdded(device);
        break;

      case Constants.HANDLE_DEVICE_REMOVED:
        device = adapter.getDevice(msg.data.id);
        if (device) {
          adapter.handleDeviceRemoved(device);
        }
        break;

      case Constants.PROPERTY_CHANGED:
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

      case Constants.ACTION_STATUS:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          device.actionNotify(msg.data.action);
        }
        break;

      case Constants.EVENT:
        device = adapter.getDevice(msg.data.deviceId);
        if (device) {
          device.eventNotify(msg.data.event);
        }
        break;

      case Constants.MOCK_ADAPTER_STATE_CLEARED:
        deferredMock = adapter.deferredMock;
        if (!deferredMock) {
          console.error('mockAdapterStateCleared: No deferredMock');
        } else {
          adapter.deferredMock = null;
          deferredMock.resolve();
        }
        break;

      case Constants.MOCK_DEVICE_ADDED_REMOVED:
        deferredMock = adapter.deferredMock;
        if (!deferredMock) {
          console.error('mockDeviceAddedRemoved: No deferredMock');
        } else {
          device = deferredMock.device;
          adapter.deferredMock = null;
          deferredMock.device = null;
          deferredMock.resolve(device);
        }
        break;

      case Constants.MOCK_DEVICE_ADD_REMOVE_FAILED:
        deferredMock = adapter.deferredMock;
        if (!deferredMock) {
          console.error('Plugin:', this.pluginId,
                        'Adapter:', adapter.getId(),
                        'No deferredMock');
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
        case Constants.REQUEST_ACTION: {
          this.requestActionPromises.set(data.actionId, deferred);
          break;
        }
        case Constants.REMOVE_ACTION: {
          // removeAction needs ID which is per message, because it
          // can be called while waiting rejected or resolved.
          data.messageId = this.generateMsgId();
          this.removeActionPromises.set(data.messageId, deferred);
          break;
        }
        case Constants.SET_PIN: {
          // removeAction needs ID which is per message, because it
          // can be called while waiting rejected or resolved.
          data.messageId = this.generateMsgId();
          this.setPinPromises.set(data.messageId, deferred);
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
    this.ipcSocket.close();
  }

  start() {
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
        if (code == Constants.DONT_RESTART_EXIT_CODE) {
          console.log('Plugin:', this.pluginId, 'died, code =', code,
                      'NOT restarting...');
          this.restart = false;
          this.process.p = null;
        } else {
          console.log('Plugin:', this.pluginId, 'died, code =', code,
                      'restarting...');
          this.start();
        }
      } else {
        this.process.p = null;
      }
    });
  }

  unload() {
    this.restart = false;
    this.unloadedRcvdPromise = new Deferred();
    this.sendMsg(Constants.UNLOAD_PLUGIN, {});
  }
}

module.exports = Plugin;
