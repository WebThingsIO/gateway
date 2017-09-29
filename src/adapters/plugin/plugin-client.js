/**
 * @module PluginClient
 *
 * Takes care of connecting to the gateway for an adapter plugin
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const AdapterManagerProxy = require('./adapter-manager-proxy');
const Constants = require('../../constants');
const Deferred = require('../deferred');
const IpcSocket = require('./ipc');

class PluginClient {

  constructor(adapterId, {verbose}={}) {
    this.adapterId = adapterId;
    this.verbose = verbose;
    this.deferredReply = null;
  }

  onManagerMsg(msg) {
    this.verbose &&
      console.log('PluginClient: rcvd ManagerMsg:', msg);

    if (!this.deferredReply) {
      console.error('No deferredReply setup');
      return;
    }

    if (msg.messageType === Constants.REGISTER_ADAPTER_REPLY) {
      this.verbose &&
        console.log('Registered with PluginServer: ', msg);
      this.adapterIpcAddr = msg.data.ipcAddr;

      this.adapterManager = new AdapterManagerProxy(this);

      // Now that we're registered with the server, open the adapter
      // specific IPC channel with the server.
      this.adapterIpcSocket =
        new IpcSocket('PluginClientAdapter', 'pair',
                      this.adapterManager.onMsg.bind(this.adapterManager));
      this.adapterIpcSocket.connect(this.adapterIpcAddr);
      var deferredReply = this.deferredReply;
      this.deferredReply = null;
      deferredReply.resolve(this.adapterManager);
    } else {
      console.error('Unexpected registration reply for gateway');
      console.error(msg);
    }
  }

  register() {
    if (this.deferredReply) {
      console.error('Already waiting for registration reply');
      return;
    }
    this.deferredReply = new Deferred();

    this.managerIpcFile = '/tmp/gateway.adapterManager';
    this.managerIpcAddr = 'ipc://' + this.managerIpcFile;

    this.verbose &&
      console.log('ManagerIpcAddr =', this.managerIpcAddr);
    this.managerIpcSocket = new IpcSocket('PluginClientServer', 'req',
                                          this.onManagerMsg.bind(this));
    this.managerIpcSocket.connect(this.managerIpcAddr);

    // Register ourselves with the server
    this.verbose &&
      console.log('Registering with server');
    
    this.managerIpcSocket.sendJson({
      messageType: 'registerAdapter',
      data: {
        adapterId: this.adapterId
      },
    });

    return this.deferredReply.promise;
  }

  sendNotification(methodType, data) {
    this.adapterIpcSocket.sendJson({
      messageType: methodType,
      data: data,
    });
  }

  unload() {
    this.adapterIpcSocket.close();
    this.managerIpcSocket.close();
  }
}

module.exports = PluginClient;