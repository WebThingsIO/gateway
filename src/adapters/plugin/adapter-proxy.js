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
            property.doPropertyChange(msg.data.propertyValue);
            device.notifyPropertyChanged(property);
          }
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
}

module.exports = AdapterProxy;
