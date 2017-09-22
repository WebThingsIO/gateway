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
const IpcSocket = require('./ipc');

class PluginClient {

  constructor(adapterId, {verbose}={}) {
    this.adapterId = adapterId;
    this.verbose = verbose;
  }

  onManagerMsg(msg) {
    this.verbose &&
      console.log('PluginClient: rcvd ManagerMsg:', msg);
  }

  register() {
    return new Promise((resolve, reject) => {
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
      this.managerIpcSocket.sendJsonGetReply({
        messageType: 'registerAdapter',
        data: {
          id: this.adapterId
        },
      }).then((reply) => {
        this.verbose &&
          console.log('Registered with PluginServer: ', reply);
        this.adapterIpcAddr = reply.data.ipcAddr;

        this.adapterManager = new AdapterManagerProxy(this);

        // Now that we're registered with the server, open the adapter
        // specific IPC channel with the server.
        this.adapterIpcSocket =
          new IpcSocket('PluginClientAdapter', 'pair',
                        this.adapterManager.onMsg.bind(this.adapterManager));
        this.adapterIpcSocket.connect(this.adapterIpcAddr);
        this.adapterIpcSocket.idBase = reply.data.idBase;
        resolve(this.adapterManager);
      }).catch(err => {
        console.error('Error registering with server');
        console.error(err);
        reject('Error registering with server');
      });
    });
  }

  sendNotification(methodType, data) {
    this.adapterIpcSocket.sendJson({
      messageType: methodType,
      data: data,
    });
  }

  sendReply(msg, data) {
    this.adapterIpcSocket.sendJson({
      messageType: msg.messageType + 'Reply',
      data: data,
      id: msg.id,
    });
  }
}

module.exports = PluginClient;