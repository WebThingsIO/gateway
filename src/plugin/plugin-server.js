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
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const appInstance = require('../app-instance');
const config = require('config');
const EventEmitter = require('events');
const {IpcSocket} = require('gateway-addon');
const {MessageType} = require('gateway-addon').Constants;
const Plugin = require('./plugin');
const pkg = require('../../package.json');
const UserProfile = require('../user-profile');

class PluginServer extends EventEmitter {
  constructor(addonManager, {verbose} = {}) {
    super();
    this.manager = addonManager;

    this.verbose = verbose;
    this.plugins = new Map();

    this.ipcSocket = new IpcSocket('PluginServer', 'rep',
                                   config.get('ipc.protocol'),
                                   'gateway.addonManager',
                                   this.onMsg.bind(this),
                                   appInstance.get());
    this.ipcSocket.bind();
    this.verbose &&
      console.log('Server bound to', this.ipcSocket.ipcAddr);
  }

  /**
   * @method addAdapter
   *
   * Tells the add-on manager about new adapters added via a plugin.
   */
  addAdapter(adapter) {
    this.manager.addAdapter(adapter);
  }

  /**
   * @method addNotifier
   *
   * Tells the add-on manager about new notifiers added via a plugin.
   */
  addNotifier(notifier) {
    this.manager.addNotifier(notifier);
  }

  /**
   * @method addAPIHandler
   *
   * Tells the add-on manager about new API handlers added via a plugin.
   */
  addAPIHandler(handler) {
    this.manager.addAPIHandler(handler);
  }

  /**
   * @method onMsg
   *
   * Called when the plugin server receives an adapter manager IPC message
   * from a plugin. This particular IPC channel is only used to register
   * plugins. Each plugin will get its own IPC channel once its registered.
   */
  onMsg(msg) {
    this.verbose &&
      console.log('PluginServer: Rcvd:', msg);

    switch (msg.messageType) {
      case MessageType.PLUGIN_REGISTER_REQUEST: {
        const plugin = this.registerPlugin(msg.data.pluginId);
        this.ipcSocket.sendJson({
          messageType: MessageType.PLUGIN_REGISTER_RESPONSE,
          data: {
            pluginId: msg.data.pluginId,
            ipcBaseAddr: plugin.ipcBaseAddr,
            gatewayVersion: pkg.version,
            userProfile: {
              baseDir: UserProfile.baseDir,
              configDir: UserProfile.configDir,
              dataDir: UserProfile.dataDir,
              mediaDir: UserProfile.mediaDir,
              logDir: UserProfile.logDir,
              gatewayDir: UserProfile.gatewayDir,
            },
          },
        });
        break;
      }
    }
  }

  /**
   * @method getPlugin
   *
   * Returns a previously loaded plugin instance.
   */
  getPlugin(pluginId) {
    return this.plugins.get(pluginId);
  }

  /**
   * @method loadPlugin
   *
   * Loads a plugin by launching a separate process.
   */
  loadPlugin(pluginPath, manifest) {
    const plugin = this.registerPlugin(manifest.name);
    plugin.exec = manifest.moziot.exec;
    plugin.execPath = pluginPath;
    plugin.start();
  }

  /**
   * @method registerPlugin
   *
   * Called when the plugin server receives a register plugin message
   * via IPC.
   */
  registerPlugin(pluginId) {
    let plugin = this.plugins.get(pluginId);
    if (plugin) {
      // This is a plugin that we already know about.
    } else {
      // We haven't seen this plugin before.
      plugin = new Plugin(pluginId, this);
      this.plugins.set(pluginId, plugin);
    }
    return plugin;
  }

  /**
   * @method unregisterPlugin
   *
   * Called when the plugin sends a plugin-unloaded message.
   */
  unregisterPlugin(pluginId) {
    this.plugins.delete(pluginId);
  }

  shutdown() {
    this.ipcSocket.close();
  }
}

module.exports = PluginServer;
