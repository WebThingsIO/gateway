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
const DeviceProxy = require('./device-proxy');
const fs = require('fs');
const IpcSocket = require('./ipc');

const DEBUG = false;

// Used for message id's
var idBase = 0;

/**
 * Class used to describe an adapter from the perspective
 * of the gateway.
 */
class AdapterProxy extends Adapter {

  constructor(adapterManager, adapterId, pluginServer) {
    super(adapterManager, '???');
    this.id = adapterId;
    this.pluginServer = pluginServer;

    this.ipcFile = '/tmp/gateway.adapter.' + this.id;
    this.ipcAddr = 'ipc://' + this.ipcFile;

    if (fs.existsSync(this.ipcFile)) {
      fs.unlinkSync(this.ipcFile);
    }
    this.ipcSocket = new IpcSocket('AdapterProxy', 'pair',
                                   this.onMsg.bind(this));
    this.ipcSocket.bind(this.ipcAddr);

    idBase += 1;
    this.idBase = idBase * 1000;
    this.ipcSocket.idBase = this.idBase;
  }

  startPairing(timeoutSeconds) {
    DEBUG && console.log('AdapterProxy: startPairing',
                         this.name, 'id', this.id);
    this.sendMsg('startPairing', {timeout: timeoutSeconds});
  }

  cancelPairing() {
    DEBUG && console.log('AdapterProxy: cancelPairing',
                         this.name, 'id', this.id);
    this.sendMsg('cancelPairing', {});
  }

  removeThing(device) {
    DEBUG && console.log('AdapterProxy:', this.name, 'id', this.id,
                         'removeThing:', device.id);
    this.sendMsg('removeThing', {deviceId: device.id});
  }

  cancelRemoveThing(device) {
    DEBUG && console.log('AdapterProxy:', this.name, 'id', this.id,
                         'cancelRemoveThing:', device.id);
    this.sendMsg('cancelRemoveThing', {deviceId: device.id});
  }

  onMsg(msg) {
    var device;
    var property;
    DEBUG && console.log('AdapterProxy: Rcvd Msg', msg);

    switch (msg.messageType) {

      case 'addAdapter':
        this.id = msg.data.adapterId;
        this.name = msg.data.name;
        this.manager.addAdapter(this);
        break;

      case 'handleDeviceAdded':
        device = new DeviceProxy(this, msg.data);
        super.handleDeviceAdded(device);
        break;

      case 'handleDeviceRemoved':
        device = this.devices[msg.data.id];
        if (device) {
          super.handleDeviceRemoved(device);
        }
        break;

      case 'propertyChanged':
        device = this.devices[msg.data.deviceId];
        if (device) {
          property = device.findProperty(msg.data.propertyName);
          if (property) {
            property.setCachedValue(msg.data.propertyValue);
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

  sendMsgGetReply(methodType, data) {
    var msg = {
      messageType: methodType,
      data: data,
    };
    DEBUG && console.log('AdapterProxy: sendMsgGetReply:', msg);
    return this.ipcSocket.sendJsonGetReply(msg);
    // TODO: Need to implement a timeout in case the plugin
    //       "goes away".
  }
}

module.exports = AdapterProxy;
