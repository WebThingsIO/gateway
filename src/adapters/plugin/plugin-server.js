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

const Constants = require('../adapter-constants');
const IpcSocket = require('./ipc');
const Plugin = require('./plugin');

class PluginServer {

  constructor(adapterManager, {verbose}={}) {
    this.manager = adapterManager;

    this.verbose = verbose;
    this.plugins = new Map();

    this.ipcSocket = new IpcSocket('PluginServer', 'rep',
                                   'gateway.adapterManager',
                                   this.onMsg.bind(this));
    this.ipcSocket.bind();
    this.verbose &&
      console.log('Server bound to', this.ipcSocket.ipcAddr);
  }

  addAdapter(adapter) {
    this.manager.addAdapter(adapter);
  }

  onMsg(msg) {
    this.verbose &&
      console.log('PluginServer: Rcvd:', msg);

    switch (msg.messageType) {

      case Constants.REGISTER_PLUGIN:
        var plugin = this.registerPlugin(msg.data.pluginId);
        this.ipcSocket.sendJson({
          messageType: Constants.REGISTER_PLUGIN_REPLY,
          data: {
            pluginId: msg.data.pluginId,
            ipcBaseAddr: plugin.ipcBaseAddr,
          },
        });
        break;

    }
  }

  registerPlugin(pluginId) {
    var plugin = this.plugins.get(pluginId);
    if (plugin) {
      // This is a plugin that we already know about.
    } else {
      // We haven't seen this plugin before.
      plugin = new Plugin(pluginId, this);
      this.plugins.set(pluginId, plugin);
    }
    return plugin;
  }

  unregisterPlugin(pluginId) {
    this.plugins.delete(pluginId);
    if (this.plugins.size == 0) {
      this.ipcSocket.close();
    }
  }
}

module.exports = PluginServer;