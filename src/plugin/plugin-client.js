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

const AddonManagerProxy = require('./addon-manager-proxy');
const Constants = require('../constants');
const Deferred = require('../deferred');
const EventEmitter = require('events');
const IpcSocket = require('./ipc');

class PluginClient extends EventEmitter {

  constructor(pluginId, {verbose} = {}) {
    super();
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
      this.addonManager = new AddonManagerProxy(this);

      // Now that we're registered with the server, open the plugin
      // specific IPC channel with the server.
      this.pluginIpcBaseAddr = msg.data.ipcBaseAddr;
      this.pluginIpcSocket =
        new IpcSocket('PluginClient', 'pair',
                      this.pluginIpcBaseAddr,
                      this.addonManager.onMsg.bind(this.addonManager));
      this.pluginIpcSocket.connect(this.pluginIpcAddr);
      this.verbose &&
        console.log('PluginClient: registered with PluginServer:',
                    this.pluginIpcSocket.ipcAddr);

      const deferredReply = this.deferredReply;
      this.deferredReply = null;
      deferredReply.resolve(this.addonManager);
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
                    'gateway.addonManager',
                    this.onManagerMsg.bind(this));
    this.managerIpcSocket.connect();

    // Register ourselves with the server
    this.verbose &&
      console.log('Connected to server:', this.managerIpcSocket.ipcAddr,
                  'registering...');

    this.managerIpcSocket.sendJson({
      messageType: Constants.REGISTER_PLUGIN,
      data: {
        pluginId: this.pluginId,
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
    this.pluginIpcSocket.close();
    this.managerIpcSocket.close();
    this.emit('unloaded', {});
  }
}

module.exports = PluginClient;
