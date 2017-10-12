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

  constructor(pluginId, {verbose}={}) {
    this.pluginId = pluginId;
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

    if (msg.messageType === Constants.REGISTER_PLUGIN_REPLY) {

      this.adapterManager = new AdapterManagerProxy(this);

      // Now that we're registered with the server, open the plugin
      // specific IPC channel with the server.
      this.pluginIpcBaseAddr = msg.data.ipcBaseAddr;
      this.pluginIpcSocket =
        new IpcSocket('PluginClient', 'pair',
                      this.pluginIpcBaseAddr,
                      this.adapterManager.onMsg.bind(this.adapterManager));
      this.pluginIpcSocket.connect(this.pluginIpcAddr);
      this.verbose &&
        console.log('PluginClient: registered with PluginServer:',
                    this.pluginIpcSocket.ipcAddr);

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

    this.managerIpcSocket =
      new IpcSocket('PluginClientServer', 'req',
                    'gateway.adapterManager',
                    this.onManagerMsg.bind(this));
    this.managerIpcSocket.connect();

    // Register ourselves with the server
    this.verbose &&
      console.log('Connected to server:', this.managerIpcSocket.ipcAddr,
                  'registering...');

    this.managerIpcSocket.sendJson({
      messageType: Constants.REGISTER_PLUGIN,
      data: {
        pluginId: this.pluginId
      },
    });

    return this.deferredReply.promise;
  }

  sendNotification(methodType, data) {
    data.pluginId = this.pluginId;
    this.pluginIpcSocket.sendJson({
      messageType: methodType,
      data: data,
    });
  }

  unload() {
    // Wait a small amount of time to allow the pluginUnloaded
    // message to be processed by the server before closing.
    setTimeout(() => {
      this.pluginIpcSocket.close();
      this.managerIpcSocket.close();
    }, 500);

  }
}

module.exports = PluginClient;