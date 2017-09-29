/**
 * @module AdapterProxy base class.
 *
 * Manages Adapter data model and business logic.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Adapter = require('../adapter');
const Constants = require('../adapter-constants');
const Deferred = require('../deferred');
const DeviceProxy = require('./device-proxy');
const fs = require('fs');
const IpcSocket = require('./ipc');

const DEBUG = false;

/**
 * Class used to describe an adapter from the perspective
 * of the gateway.
 */
class AdapterProxy extends Adapter {

  constructor(adapterManager, adapterId, pluginServer) {
    super(adapterManager, adapterId);
    this.pluginServer = pluginServer;

    this.ipcFile = '/tmp/gateway.adapter.' + this.id;
    this.ipcAddr = 'ipc://' + this.ipcFile;

    if (fs.existsSync(this.ipcFile)) {
      fs.unlinkSync(this.ipcFile);
    }
    this.ipcSocket = new IpcSocket('AdapterProxy', 'pair',
                                   this.onMsg.bind(this));
    this.ipcSocket.bind(this.ipcAddr);
    this.deferredMock = null;
  }

  startPairing(timeoutSeconds) {
    DEBUG && console.log('AdapterProxy: startPairing',
                         this.name, 'id', this.id);
    this.sendMsg(Constants.START_PAIRING, {timeout: timeoutSeconds});
  }

  cancelPairing() {
    DEBUG && console.log('AdapterProxy: cancelPairing',
                         this.name, 'id', this.id);
    this.sendMsg(Constants.CANCEL_PAIRING, {});
  }

  removeThing(device) {
    DEBUG && console.log('AdapterProxy:', this.name, 'id', this.id,
                         'removeThing:', device.id);
    this.sendMsg(Constants.REMOVE_THING, {deviceId: device.id});
  }

  cancelRemoveThing(device) {
    DEBUG && console.log('AdapterProxy:', this.name, 'id', this.id,
                         'cancelRemoveThing:', device.id);
    this.sendMsg(Constants.CANCEL_REMOVE_THING, {deviceId: device.id});
  }

  onMsg(msg) {
    var device;
    var property;
    var deferredMock;
    DEBUG && console.log('AdapterProxy: Rcvd Msg', msg);

    switch (msg.messageType) {

      case Constants.ADD_ADAPTER:
        this.id = msg.data.adapterId;
        this.name = msg.data.name;
        this.manager.addAdapter(this);
        break;

      case Constants.HANDLE_DEVICE_ADDED:
        device = new DeviceProxy(this, msg.data);
        super.handleDeviceAdded(device);
        break;

      case Constants.HANDLE_DEVICE_REMOVED:
        device = this.devices[msg.data.id];
        if (device) {
          super.handleDeviceRemoved(device);
        }
        break;

      case Constants.PROPERTY_CHANGED:
        device = this.devices[msg.data.deviceId];
        if (device) {
          property = device.findProperty(msg.data.propertyName);
          if (property) {
            property.doPropertyChanged(msg.data.propertyValue);
            device.notifyPropertyChanged(property);
          }
        }
        break;

      case Constants.MOCK_ADAPTER_STATE_CLEARED:
        deferredMock = this.deferredMock;
        if (!deferredMock) {
          console.error('mockAdapterStateCleared: No deferredMock');
        } else {
          this.deferredMock = null;
          deferredMock.resolve();
        }
        break;

      case Constants.MOCK_DEVICE_ADDED_REMOVED:
        deferredMock = this.deferredMock;
        if (!deferredMock) {
          console.error('mockDeviceAddedRemoved: No deferredMock');
        } else {
          this.deferredMock = null;
          device = this.devices[msg.data.deviceId];
          if (device) {
            deferredMock.resolve(device);
          } else {
            // For the removal case, the device will have already
            // been removed, so we create a fake device.
            deferredMock.resolve({id: msg.data.deviceId});
          }
        }
        break;

      case Constants.MOCK_DEVICE_ADD_REMOVE_FAILED:
        deferredMock = this.deferredMock;
        if (!deferredMock) {
          console.error('No deferredMock');
        } else {
          this.deferredMock = null;
          deferredMock.reject(msg.data.error);
        }
        break;

      default:
        console.error('AdapterProxy: unrecognized msg:', msg);
        break;
    }
  }

  sendMsg(methodType, data) {
    var msg = {
      messageType: methodType,
      data: data,
    };
    DEBUG && console.log('AdapterProxy: sendMsg:', msg);
    return this.ipcSocket.sendJson(msg);
  }

  // The following methods are added to support using the
  // MockAdapter as a plugin.

  clearState() {
    if (this.deferredMock) {
      const err = 'clearState: deferredMock already in progress';
      console.error(err);
      return Promise.reject(err);
    }
    this.deferredMock = new Deferred();
    this.sendMsg(Constants.CLEAR_MOCK_ADAPTER_STATE, {
      adapterId: this.id,
    });
    return this.deferredMock.promise;
  }

  addDevice(deviceId, deviceDescription) {
    if (this.deferredMock) {
      const err = 'addDevice: deferredMock already in progress';
      console.error(err);
      return Promise.reject(err);
    }

    // For the MockDevice we create the device now, so that we can
    // deliver the propertyChanged notifications that show up before
    // the handleDeviceAdded notification comes in. The device we
    // create now will be replaced when the handleDeviceAdded
    // notification shows up.

    this.devices[deviceId] = new DeviceProxy(this, deviceDescription);

    this.deferredMock = new Deferred();
    this.sendMsg(Constants.ADD_MOCK_DEVICE, {
      deviceId: deviceId,
      deviceDescr: deviceDescription,
    });
    return this.deferredMock.promise;
  }

  removeDevice(deviceId) {
    if (this.deferredMock) {
      const err = 'removeDevice: deferredMock already in progress';
      console.error(err);
      return Promise.reject(err);
    }
    this.deferredMock = new Deferred();
    this.sendMsg(Constants.REMOVE_MOCK_DEVICE, {
      deviceId: deviceId,
    });
    return this.deferredMock.promise;
  }

  pairDevice(deviceId, deviceDescription) {
    this.sendMsg(Constants.PAIR_MOCK_DEVICE, {
      deviceId: deviceId,
      deviceDescr: deviceDescription,
    });
  }

  unpairDevice(deviceId) {
    this.sendMsg(Constants.UNPAIR_MOCK_DEVICE, {
      deviceId: deviceId,
    });
  }

  unload() {
    this.sendMsg(Constants.UNLOAD_ADAPTER, {
      adapterId: this.getId(),
    });
    // Sleep a small amount to allow the message to actually be sent
    // before closing the socket.
    setTimeout(() => {
      this.ipcSocket.close();
    }, 200);
  }

}

module.exports = AdapterProxy;
