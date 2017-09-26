/**
 * @module PluginServer
 *
 * Takes care of the gateway side of adapter plugins. There is
 * only a single instance of the PluginServer for the entire gateway.
 * There will be an AdapterProxy instance for each adapter plugin.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Constants = require('./../../constants');
const AdapterProxy = require('./adapter-proxy');
const fs = require('fs');
const IpcSocket = require('./ipc');

class PluginServer {

  constructor(adapterManager, {verbose}={}) {
    this.adapterManager = adapterManager;

    this.verbose = verbose;
    this.adapters = {};

    this.ipcFile = '/tmp/gateway.adapterManager';
    this.ipcAddr = 'ipc://' + this.ipcFile;

    // In the event that we crashed before, then go ahead and remove
    // the named pipe, otherwise bind will complain if it already exists.
    if (fs.existsSync(this.ipcFile)) {
      fs.unlinkSync(this.ipcFile);
    }
    this.ipcSocket = new IpcSocket('PluginServer', 'rep',
                                   this.onMsg.bind(this));
    this.ipcSocket.bind(this.ipcAddr);
    this.verbose &&
      console.log('Server bound to', this.ipcAddr);
  }

  onMsg(msg) {
    this.verbose &&
      console.log('AdapterManagerServer rcvd:', msg);

    switch (msg.messageType) {

      case Constants.REGISTER_ADAPTER:
        var adapter = this.registerAdapter(msg.data.adapterId);
        this.ipcSocket.sendJson({
          messageType: Constants.REGISTER_ADAPTER_REPLY,
          data: {
            ipcAddr: adapter.ipcAddr,
          },
          id: msg.id,
        });
        break;

    }
  }

  registerAdapter(adapterId) {
    if (this.adapters.hasOwnProperty(adapterId)) {
      // This is an adapter that we already know about.
    } else {
      // We haven't seen this adapter before.
      this.adapters[adapterId] =
        new AdapterProxy(this.adapterManager, adapterId, this);
    }
    return this.adapters[adapterId];
  }
}

function loadPluginServer(adapterManager) {
  // This function just loads the plugin server. It
  // doesn't actually load any plugins.

  new PluginServer(adapterManager);
}

module.exports = loadPluginServer;