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

import config from 'config';
import { EventEmitter } from 'events';
import { IpcSocket, Constants } from 'gateway-addon';
import * as Settings from '../models/settings';
import UserProfile from '../user-profile';
import { Message } from 'gateway-addon/lib/schema';
import WebSocket from 'ws';
import pkg from '../package.json';
import Plugin from './plugin';
import { AddonManager } from '../addon-manager';

const MessageType = Constants.MessageType;

export default class PluginServer extends EventEmitter {
  private manager: AddonManager;

  private verbose?: boolean;

  private plugins: Map<string, Plugin>;

  private ipcSocket: IpcSocket;

  constructor(addonManager: AddonManager, { verbose }: { verbose?: boolean } = {}) {
    super();
    this.manager = addonManager;

    this.verbose = verbose;
    this.plugins = new Map();

    this.ipcSocket = new IpcSocket(
      true,
      config.get('ports.ipc'),
      this.onMsg.bind(this),
      'IpcSocket(plugin-server)',
      { verbose: this.verbose }
    );
  }

  public getAddonManager(): AddonManager {
    return this.manager;
  }

  /**
   * @method onMsg
   *
   * Called when the plugin server receives an adapter manager IPC message
   * from a plugin. This particular IPC channel is only used to register
   * plugins. Each plugin will get its own IPC channel once its registered.
   */
  onMsg(msg: Message, ws: WebSocket): void {
    this.verbose && console.log('PluginServer: Rcvd:', msg);

    if (msg.messageType === MessageType.PLUGIN_REGISTER_REQUEST) {
      const plugin = this.registerPlugin(msg.data.pluginId);
      plugin.setWebSocket(ws);
      let language = 'en-US';
      const units = {
        temperature: 'degree celsius',
      };
      Settings.getSetting('localization.language')
        .then((lang) => {
          if (lang) {
            language = <string>lang;
          }

          return Settings.getSetting('localization.units.temperature');
        })
        .then((temp) => {
          if (temp) {
            units.temperature = <string>temp;
          }

          return Promise.resolve();
        })
        .catch(() => {
          return Promise.resolve();
        })
        .then(() => {
          ws.send(
            JSON.stringify({
              messageType: MessageType.PLUGIN_REGISTER_RESPONSE,
              data: {
                pluginId: msg.data.pluginId,
                gatewayVersion: pkg.version,
                userProfile: {
                  addonsDir: UserProfile.addonsDir,
                  baseDir: UserProfile.baseDir,
                  configDir: UserProfile.configDir,
                  dataDir: UserProfile.dataDir,
                  mediaDir: UserProfile.mediaDir,
                  logDir: UserProfile.logDir,
                  gatewayDir: UserProfile.gatewayDir,
                },
                preferences: {
                  language,
                  units,
                },
              },
            })
          );
        });
    } else if (msg.data.pluginId) {
      const plugin = this.getPlugin(msg.data.pluginId);
      if (plugin) {
        plugin.onMsg(msg);
      }
    }
  }

  /**
   * @method getPlugin
   *
   * Returns a previously loaded plugin instance.
   */
  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * @method loadPlugin
   *
   * Loads a plugin by launching a separate process.
   */
  loadPlugin(pluginPath: string, id: string, exec: string): void {
    const plugin = this.registerPlugin(id);
    plugin.setExec(exec);
    plugin.setExecPath(pluginPath);
    plugin.start();
  }

  /**
   * @method registerPlugin
   *
   * Called when the plugin server receives a register plugin message
   * via IPC.
   */
  registerPlugin(pluginId: string): Plugin {
    let plugin = this.plugins.get(pluginId);
    if (plugin) {
      // This is a plugin that we already know about.
    } else {
      // We haven't seen this plugin before.
      plugin = new Plugin(pluginId, this.manager, this);
      this.plugins.set(pluginId, plugin!);
    }
    return plugin!;
  }

  /**
   * @method unregisterPlugin
   *
   * Called when the plugin sends a plugin-unloaded message.
   */
  unregisterPlugin(pluginId: string): void {
    this.plugins.delete(pluginId);
  }

  shutdown(): void {
    this.ipcSocket.close();
  }
}
