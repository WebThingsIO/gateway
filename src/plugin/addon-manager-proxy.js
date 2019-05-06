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
const Constants = require('../constants');
const EventEmitter = require('events').EventEmitter;

const DEBUG = false;

class AddonManagerProxy extends EventEmitter {
  constructor(pluginClient) {
    super();

    this.adapters = new Map();
    this.notifiers = new Map();
    this.pluginClient = pluginClient;

    this.on(Constants.PROPERTY_CHANGED, (property) => {
      DEBUG && console.log('AddonManagerProxy: Got',
                           Constants.PROPERTY_CHANGED, 'notification for',
                           property.name, 'value:', property.value);
      this.sendPropertyChangedNotification(property);
    });

    this.on(Constants.ACTION_STATUS, (action) => {
      DEBUG && console.log('AddonManagerProxy: Got',
                           Constants.ACTION_STATUS, 'notification for',
                           action.name, 'status:', action.status);
      this.sendActionStatusNotification(action);
    });

    this.on(Constants.EVENT, (event) => {
      DEBUG && console.log('AddonManagerProxy: Got',
                           Constants.EVENT, 'notification for', event.name);
      this.sendEventNotification(event);
    });

    this.on(Constants.CONNECTED, ({device, connected}) => {
      DEBUG && console.log('AddonManagerProxy: Got',
                           Constants.CONNECTED, 'notification for',
                           device.name);
      this.sendConnectedNotification(device, connected);
    });
  }

  /**
   * @method addAdapter
   *
   * Adds an adapter to the collection of adapters managed by AddonManager.
   */
  addAdapter(adapter) {
    const adapterId = adapter.id;
    DEBUG && console.log('AddonManagerProxy: addAdapter:', adapterId);

    this.adapters.set(adapterId, adapter);
    this.pluginClient.sendNotification(Constants.ADD_ADAPTER, {
      adapterId: adapter.getId(),
      name: adapter.getName(),
      packageName: adapter.getPackageName(),
    });
  }

  /**
   * @method addNotifier
   *
   * Adds a notifier to the collection of notifiers managed by AddonManager.
   */
  addNotifier(notifier) {
    const notifierId = notifier.id;
    DEBUG && console.log('AddonManagerProxy: addNotifier:', notifierId);

    this.notifiers.set(notifierId, notifier);
    this.pluginClient.sendNotification(Constants.ADD_NOTIFIER, {
      notifierId: notifier.getId(),
      name: notifier.getName(),
      packageName: notifier.getPackageName(),
    });
  }

  /**
   * @method handleDeviceAdded
   *
   * Called when the indicated device has been added to an adapter.
   */
  handleDeviceAdded(device) {
    DEBUG && console.log('AddonManagerProxy: handleDeviceAdded:', device.id);
    const deviceDict = device.asDict();
    deviceDict.adapterId = device.adapter.id;
    this.pluginClient.sendNotification(
      Constants.HANDLE_DEVICE_ADDED, deviceDict);
  }

  /**
   * @method handleDeviceRemoved
   * Called when the indicated device has been removed from an adapter.
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
   * @method handleOutletAdded
   *
   * Called when the indicated outlet has been added to a notifier.
   */
  handleOutletAdded(outlet) {
    DEBUG && console.log('AddonManagerProxy: handleOutletAdded:', outlet.id);
    const outletDict = outlet.asDict();
    outletDict.notifierId = outlet.notifier.id;
    this.pluginClient.sendNotification(
      Constants.HANDLE_OUTLET_ADDED, outletDict);
  }

  /**
   * @method handleOutletRemoved
   * Called when the indicated outlet has been removed from a notifier.
   */
  handleOutletRemoved(outlet) {
    DEBUG && console.log('AddonManagerProxy: handleOutletRemoved:',
                         outlet.id);
    this.pluginClient.sendNotification(
      Constants.HANDLE_OUTLET_REMOVED, {
        notifierId: outlet.notifier.id,
        id: outlet.id,
      });
  }

  /**
   * @method onMsg
   * Called whenever a message is received from the gateway.
   */
  onMsg(msg) {
    DEBUG && console.log('AddonManagerProxy: Rcvd:', msg);

    // The first switch covers unload plugin.
    switch (msg.messageType) {
      case Constants.UNLOAD_PLUGIN:
        this.unloadPlugin();
        return;
    }

    // Next, handle notifier messages.
    if (msg.data.hasOwnProperty('notifierId')) {
      const notifierId = msg.data.notifierId;
      const notifier = this.notifiers.get(notifierId);
      if (!notifier) {
        console.error('AddonManagerProxy: Unrecognized notifier:', notifierId);
        console.error('AddonManagerProxy: Ignoring msg:', msg);
        return;
      }

      switch (msg.messageType) {
        case Constants.UNLOAD_NOTIFIER:
          notifier.unload().then(() => {
            this.notifiers.delete(notifierId);
            this.pluginClient.sendNotification(Constants.NOTIFIER_UNLOADED, {
              notifierId: notifier.id,
            });
          });
          break;
        case Constants.NOTIFY: {
          const outletId = msg.data.outletId;
          const outlet = notifier.getOutlet(outletId);
          if (!outlet) {
            console.error('AddonManagerProxy: No such outlet:', outletId);
            console.error('AddonManagerProxy: Ignoring msg:', msg);
            return;
          }

          outlet.notify(msg.data.title, msg.data.message, msg.data.level)
            .then(() => {
              this.pluginClient.sendNotification(
                Constants.NOTIFY_RESOLVED, {
                  messageId: msg.data.messageId,
                });
            }).catch((err) => {
              console.error('AddonManagerProxy: Failed to notify outlet:', err);
              this.pluginClient.sendNotification(
                Constants.NOTIFY_REJECTED, {
                  messageId: msg.data.messageId,
                });
            });
          break;
        }
      }

      return;
    }

    // The next switch covers adapter messages. i.e. don't have a deviceId.
    // or don't need a device object.

    const adapterId = msg.data.adapterId;
    const adapter = this.adapters.get(adapterId);
    if (!adapter) {
      console.error('AddonManagerProxy: Unrecognized adapter:', adapterId);
      console.error('AddonManagerProxy: Ignoring msg:', msg);
      return;
    }

    switch (msg.messageType) {

      case Constants.START_PAIRING:
        adapter.startPairing(msg.data.timeout);
        return;

      case Constants.CANCEL_PAIRING:
        adapter.cancelPairing();
        return;

      case Constants.UNLOAD_ADAPTER:
        adapter.unload().then(() => {
          this.adapters.delete(adapterId);
          this.pluginClient.sendNotification(Constants.ADAPTER_UNLOADED, {
            adapterId: adapter.id,
          });
        });
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
          .then((device) => {
            this.pluginClient.sendNotification(
              Constants.MOCK_DEVICE_ADDED_REMOVED, {
                adapterId: adapter.id,
                deviceId: device.id,
              });
          }).catch((err) => {
            this.pluginClient.sendNotification(
              Constants.MOCK_DEVICE_ADD_REMOVE_FAILED, {
                adapterId: adapter.id,
                error: err,
              });
          });
        return;

      case Constants.REMOVE_MOCK_DEVICE:
        adapter.removeDevice(msg.data.deviceId)
          .then((device) => {
            this.pluginClient.sendNotification(
              Constants.MOCK_DEVICE_ADDED_REMOVED, {
                adapterId: adapter.id,
                deviceId: device.id,
              });
          }).catch((err) => {
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

    const deviceId = msg.data.deviceId;
    const device = adapter.getDevice(deviceId);
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

      case Constants.SET_PROPERTY: {
        const propertyName = msg.data.propertyName;
        const propertyValue = msg.data.propertyValue;
        const property = device.findProperty(propertyName);
        if (property) {
          property.setValue(propertyValue).then((_updatedValue) => {
            if (property.fireAndForget) {
              // This property doesn't send propertyChanged notifications,
              // so we fake one.
              this.sendPropertyChangedNotification(property);
            } else {
              // We should get a propertyChanged notification thru
              // the normal channels, so don't sent another one here.
              // We don't really need to do anything.
            }
          }).catch((err) => {
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
      }
      case Constants.REQUEST_ACTION: {
        const actionName = msg.data.actionName;
        const actionId = msg.data.actionId;
        const input = msg.data.input;
        device.requestAction(actionId, actionName, input)
          .then(() => {
            this.pluginClient.sendNotification(
              Constants.REQUEST_ACTION_RESOLVED, {
                actionName: actionName,
                actionId: actionId,
              });
          }).catch((err) => {
            console.error('AddonManagerProxy: Failed to request action',
                          actionName, 'for device:', deviceId);
            console.error(err);
            this.pluginClient.sendNotification(
              Constants.REQUEST_ACTION_REJECTED, {
                actionName: actionName,
                actionId: actionId,
              });
          });
        break;
      }
      case Constants.REMOVE_ACTION: {
        const actionName = msg.data.actionName;
        const actionId = msg.data.actionId;
        const messageId = msg.data.messageId;
        device.removeAction(actionId, actionName)
          .then(() => {
            this.pluginClient.sendNotification(
              Constants.REMOVE_ACTION_RESOLVED, {
                actionName: actionName,
                actionId: actionId,
                messageId: messageId,
              });
          }).catch((err) => {
            console.error('AddonManagerProxy: Failed to remove action',
                          actionName, 'for device:', deviceId);
            console.error(err);
            this.pluginClient.sendNotification(
              Constants.REMOVE_ACTION_REJECTED, {
                actionName: actionName,
                actionId: actionId,
                messageId: messageId,
              });
          });
        break;
      }
      case Constants.SET_PIN: {
        const pin = msg.data.pin;
        const messageId = msg.data.messageId;
        adapter.setPin(deviceId, pin)
          .then(() => {
            const dev = adapter.getDevice(deviceId);
            this.pluginClient.sendNotification(
              Constants.SET_PIN_RESOLVED, {
                device: dev.asDict(),
                messageId: messageId,
                adapterId: adapter.id,
              });
          }).catch((err) => {
            console.error(
              `AddonManagerProxy: Failed to set PIN for device ${deviceId}`);
            console.error(err);

            this.pluginClient.sendNotification(
              Constants.SET_PIN_REJECTED, {
                deviceId: deviceId,
                messageId: messageId,
              });
          });
        break;
      }
      case Constants.SET_CREDENTIALS: {
        const username = msg.data.username;
        const password = msg.data.password;
        const messageId = msg.data.messageId;
        adapter.setCredentials(deviceId, username, password)
          .then(() => {
            const dev = adapter.getDevice(deviceId);
            this.pluginClient.sendNotification(
              Constants.SET_CREDENTIALS_RESOLVED, {
                device: dev.asDict(),
                messageId: messageId,
                adapterId: adapter.id,
              });
          }).catch((err) => {
            console.error(
              `AddonManagerProxy: Failed to set credentials for device ${
                deviceId}`);
            console.error(err);

            this.pluginClient.sendNotification(
              Constants.SET_CREDENTIALS_REJECTED, {
                deviceId: deviceId,
                messageId: messageId,
              });
          });
        break;
      }
      case Constants.DEBUG_CMD:
        device.debugCmd(msg.data.cmd, msg.data.params);
        break;

      default:
        console.warn('AddonManagerProxy: unrecognized msg:', msg);
        break;
    }
  }

  /**
   * @method sendPairingPrompt
   * Send a prompt to the UI notifying the user to take some action.
   */
  sendPairingPrompt(adapter, prompt, url = null, device = null) {
    const data = {
      adapterId: adapter.id,
      prompt: prompt,
    };

    if (url) {
      data.url = url;
    }

    if (device) {
      data.deviceId = device.id;
    }

    this.pluginClient.sendNotification(Constants.PAIRING_PROMPT, data);
  }

  /**
   * @method sendUnpairingPrompt
   * Send a prompt to the UI notifying the user to take some action.
   */
  sendUnpairingPrompt(adapter, prompt, url = null, device = null) {
    const data = {
      adapterId: adapter.id,
      prompt: prompt,
    };

    if (url) {
      data.url = url;
    }

    if (device) {
      data.deviceId = device.id;
    }

    this.pluginClient.sendNotification(Constants.UNPAIRING_PROMPT, data);
  }

  /**
   * @method sendPropertyChangedNotification
   * Sends a propertyChanged notification to the gateway.
   */
  sendPropertyChangedNotification(property) {
    this.pluginClient.sendNotification(Constants.PROPERTY_CHANGED, {
      adapterId: property.device.adapter.id,
      deviceId: property.device.id,
      property: property.asDict(),
    });
  }

  /**
   * @method sendActionStatusNotification
   * Sends an actionStatus notification to the gateway.
   */
  sendActionStatusNotification(action) {
    this.pluginClient.sendNotification(Constants.ACTION_STATUS, {
      adapterId: action.device.adapter.id,
      deviceId: action.device.id,
      action: action.asDict(),
    });
  }

  /**
   * @method sendEventNotification
   * Sends an event notification to the gateway.
   */
  sendEventNotification(event) {
    this.pluginClient.sendNotification(Constants.EVENT, {
      adapterId: event.device.adapter.id,
      deviceId: event.device.id,
      event: event.asDict(),
    });
  }

  /**
   * @method sendConnectedNotification
   * Sends a connected notification to the gateway.
   */
  sendConnectedNotification(device, connected) {
    this.pluginClient.sendNotification(Constants.CONNECTED, {
      adapterId: device.adapter.id,
      deviceId: device.id,
      connected,
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
      const addonManager = require('../addon-manager');
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

  sendError(message) {
    this.pluginClient.sendNotification(Constants.PLUGIN_ERROR, {message});
  }
}

module.exports = AddonManagerProxy;
