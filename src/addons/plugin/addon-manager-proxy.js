/**
 * Proxy version of AddonManager used by plugins.
 *
 * @module AddonManagerProxy
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const config = require('config');
const Constants = require('../../constants');
const EventEmitter = require('events').EventEmitter;

const DEBUG = false;

class AddonManagerProxy extends EventEmitter {

  constructor (pluginClient) {
    super();

    this.pluginClient = pluginClient;

    this.on(Constants.PROPERTY_CHANGED, (property) => {
      DEBUG && console.log('AddonManagerProxy: Got',
                           Constants.PROPERTY_CHANGED, 'notification for',
                           property.name, 'value:', property.value);
      this.sendPropertyChangedNotification(property);
    });
  }

  /**
   * @method addAdapter
   *
   * Adds an adapter to the collection of adapters managed by AddonManager.
   */
  addAdapter(adapter) {
    DEBUG && console.log('AddonManagerProxy: addAdapter:', adapter.id);
    this.adapter = adapter;
    this.pluginClient.sendNotification(Constants.ADD_ADAPTER, {
      adapterId: adapter.getId(),
      name: adapter.getName(),
      packageName: adapter.getPackageName(),
    });
  }

  /**
   * @method handleDeviceAdded
   *
   * Called when the indicated device has been added to an adapter.
   */
  handleDeviceAdded(device) {
    DEBUG && console.log('AddonManagerProxy: handleDeviceAdded:', device.id);
    var deviceDict = device.asDict();
    deviceDict.adapterId = device.adapter.id;
    this.pluginClient.sendNotification(
      Constants.HANDLE_DEVICE_ADDED, deviceDict);
  }

  /**
   * @method handleDeviceRemoved
   * Called when the indicated device has been removed an adapter.
   */
  handleDeviceRemoved(device) {
    DEBUG && console.log('AddonManagerProxy: handleDeviceRemoved:',
                         device.id);
    this.pluginClient.sendNotification(
      Constants.HANDLE_DEVICE_REMOVED, {
        adapterId: device.adapter.id,
        id: device.id,
      });
  }

  /**
   * @method onMsg
   * Called whenever a message is received from the gateway.
   */
  onMsg(msg) {
    DEBUG && console.log('AddonManagerProxy: Rcvd:', msg);
    var adapter = this.adapter;
    if (!adapter) {
      console.error('AddonManagerProxy: No adapter added yet.')
      console.error('AddonManagerProxy: Ignoring msg:', msg);
      return;
    }

    // The first switch covers adapter messages. i.e. don't have a deviceId.
    // or don't need a device object.
    switch (msg.messageType) {

      case Constants.START_PAIRING:
        adapter.startPairing(msg.data.timeout);
        return;

      case Constants.CANCEL_PAIRING:
        adapter.cancelPairing();
        return;

      case Constants.UNLOAD_ADAPTER:
        adapter.unload().then(() => {
          this.pluginClient.sendNotification(Constants.ADAPTER_UNLOADED, {
            adapterId: adapter.id,
          });
        });
        return;

      case Constants.UNLOAD_PLUGIN:
        this.unloadPlugin();
        return;

      case Constants.CLEAR_MOCK_ADAPTER_STATE:
        adapter.clearState().then(() => {
          this.pluginClient.sendNotification(
            Constants.MOCK_ADAPTER_STATE_CLEARED, {
              adapterId: adapter.id,
            });
        });
        return;

      case Constants.ADD_MOCK_DEVICE:
        adapter.addDevice(msg.data.deviceId, msg.data.deviceDescr)
          .then(device => {
            this.pluginClient.sendNotification(
              Constants.MOCK_DEVICE_ADDED_REMOVED, {
                adapterId: adapter.id,
                deviceId: device.id,
              });
          }).catch(err => {
            this.pluginClient.sendNotification(
              Constants.MOCK_DEVICE_ADD_REMOVE_FAILED, {
                adapterId: adapter.id,
                error: err,
              });
          });
        return;

      case Constants.REMOVE_MOCK_DEVICE:
        adapter.removeDevice(msg.data.deviceId)
        .then(device => {
          this.pluginClient.sendNotification(
            Constants.MOCK_DEVICE_ADDED_REMOVED, {
              adapterId: adapter.id,
              deviceId: device.id,
            });
        }).catch(err => {
          this.pluginClient.sendNotification(
            Constants.MOCK_DEVICE_ADD_REMOVE_FAILED, {
              adapterId: adapter.id,
              error: err,
            });
        });
        return;

      case Constants.PAIR_MOCK_DEVICE:
        adapter.pairDevice(msg.data.deviceId, msg.data.deviceDescr);
        return;

      case Constants.UNPAIR_MOCK_DEVICE:
        adapter.unpairDevice(msg.data.deviceId);
        return;

    }

    // All messages from here on are assumed to require a valid deviceId.

    var deviceId = msg.data.deviceId;
    var device = adapter.getDevice(deviceId);
    if (!device) {
      console.error('AddonManagerProxy: No such device:', deviceId);
      console.error('AddonManagerProxy: Ignoring msg:', msg);
      return;
    }

    switch (msg.messageType) {

      case Constants.REMOVE_THING:
        adapter.removeThing(device);
        break;

      case Constants.CANCEL_REMOVE_THING:
        adapter.cancelRemoveThing(device);
        break;

      case Constants.SET_PROPERTY:
        var propertyName = msg.data.propertyName;
        var propertyValue = msg.data.propertyValue;
        var property = device.findProperty(propertyName);
        if (property) {
          property.setValue(propertyValue).then(_updatedValue => {
            if (property.fireAndForget) {
              // This property doesn't send propertyChanged notifications,
              // so we fake one.
              this.sendPropertyChangedNotification(property);
            } else {
              // We should get a propertyChanged notification thru
              // the normal channels, so don't sent another one here.
              // We don't really need to do anything.
            }
          }).catch(err => {
            // Something bad happened. The gateway is still
            // expecting a reply, so we report the error
            // and just send whatever the current value is.
            console.error('AddonManagerProxy: Failed to setProperty',
                          propertyName, 'to', propertyValue,
                          'for device:', deviceId);
            console.error(err);
            this.sendPropertyChangedNotification(property);
          });
        } else {
          console.error('AddonManagerProxy: Unknown property:',
                        propertyName);
        }
        break;

      case Constants.DEBUG_CMD:
        device.debugCmd(msg.data.cmd, msg.data.params);
        break;

      default:
        console.warn('AddonManagerProxy: unrecognized msg:', msg);
        break;
    }
  }

  /**
   * @method sendPropertyChangedNotification
   * Sends a propertyChanged notification to the gateway.
   */
  sendPropertyChangedNotification(property) {
    this.pluginClient.sendNotification(Constants.PROPERTY_CHANGED, {
      adapterId: property.device.adapter.id,
      deviceId: property.device.id,
      property: property.asDict()
    });
  }

  /**
   * @method unloadPlugin
   *
   * Unloads the plugin, and tells the server about it.
   */
  unloadPlugin() {
    if (config.get('ipc.protocol') === 'inproc') {
      // When we're testing, we run in the same process and we need
      // to close the sockets before the adapter.unload promise is
      // resolved. So we hook into the plugin unloadedRcvdPromise.

      // NOTE: We need to put this require here rather than at the top
      //       of the file because at the top of the file, otherwise we
      //       have circular requires and the addonManager object won't
      //       have been created yet.
      const addonManager = require('../../addon-manager');
      // NOTE: The call to getPlugin will only succeed when doing
      //       inproc IPC, since getPlugin reaches into server-side
      //       data structures, and we're running on the client.
      const plugin = addonManager.getPlugin(this.pluginClient.pluginId);
      if (plugin && plugin.unloadedRcvdPromise) {
        plugin.unloadedRcvdPromise.promise
          .then((socketsClosedPromise) => {
            this.pluginClient.unload();
            socketsClosedPromise.resolve();
          });
      } else {
        // Wait a small amount of time to allow the pluginUnloaded
        // message to be processed by the server before closing.
        setTimeout(() => {
          this.pluginClient.unload();
        }, 500);
      }
    } else {
      // Wait a small amount of time to allow the pluginUnloaded
      // message to be processed by the server before closing.
      setTimeout(() => {
        this.pluginClient.unload();
      }, 500);
    }
    this.pluginClient.sendNotification(Constants.PLUGIN_UNLOADED, {});
  }
}

module.exports = AddonManagerProxy;
