/**
 * Proxy version of AdapterManager used by plugins.
 *
 * @module AdapterManagerProxy
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Constants = require('../../constants');
const EventEmitter = require('events').EventEmitter;

const DEBUG = false;

class AdapterManagerProxy extends EventEmitter {

  constructor (pluginClient) {
    super();

    this.pluginClient = pluginClient;

    this.on(Constants.PROPERTY_CHANGED, (property) => {
      DEBUG && console.log('AdapterManagerProxy: Got',
                           Constants.PROPERTY_CHANGED, 'notification for',
                           property.name, 'value:', property.value);
      this.sendPropertyChangedNotification(property);
    });
  }

  /**
   * @method addAdapter
   *
   * Adds an adapter to the collection of adapters managed by AdapterManager.
   */
  addAdapter(adapter) {
    DEBUG && console.log('AdapterManagerProxy: addAdapter:', adapter.id);
    this.adapter = adapter;
    this.pluginClient.sendNotification('addAdapter', {
      adapterId: adapter.id,
      name: adapter.name,
    });
  }

  /**
   * @method handleDeviceAdded
   *
   * Called when the indicated device has been added to an adapter.
   */
  handleDeviceAdded(device) {
    DEBUG && console.log('AdapterManagerProxy: handleDeviceAdded:', device.id);
    this.pluginClient.sendNotification(
      Constants.HANDLE_DEVICE_ADDED, device.asDict());
  }

  /**
   * @method handleDeviceRemoved
   * Called when the indicated device has been removed an adapter.
   */
  handleDeviceRemoved(device) {
    DEBUG && console.log('AdapterManagerProxy: handleDeviceRemoved:',
                         device.id);
    this.pluginClient.sendNotification(
      Constants.HANDLE_DEVICE_REMOVED, {
        id: device.id,
      });
  }

  /**
   * @method onMsg
   * Called whenever a message is received from the gateway.
   */
  onMsg(msg) {
    DEBUG && console.log('AdapterManagerProxy: Rcvd:', msg);
    var adapter = this.adapter;
    if (!adapter) {
      console.error('AdapterManagerProxy: No adapter added yet.')
      console.error('AdapterManagerProxy: Ignoring msg:', msg);
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
        adapter.unload();
        this.pluginClient.sendNotification(Constants.ADAPTER_UNLOADED, {
          adapterId: adapter.id,
        });
        this.pluginClient.unload();
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
                deviceId: device.id,
              });
          }).catch(err => {
            this.pluginClient.sendNotification(
              Constants.MOCK_DEVICE_ADD_REMOVE_FAILED, {
                error: err,
              });
          });
        return;

      case Constants.REMOVE_NOCK_DEVICE:
        adapter.removeDevice(msg.data.deviceId)
        .then(device => {
          this.pluginClient.sendNotification(
            Constants.MOCK_DEVICE_ADDED_REMOVED, {
              deviceId: device.id,
            });
        }).catch(err => {
          this.pluginClient.sendNotification(
            Constants.MOCK_DEVICE_ADD_REMOVE_FAILED, {
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
      console.error('AdapterManagerProxy: No such device:', deviceId);
      console.error('AdapterManagerProxy: Ignoring msg:', msg);
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
            // We should get a propertyChanged notification thru
            // the normal channels, so don't sent another one here.
            // We don't really need to do anything.
          }).catch(err => {
            // Something bad happened. The gateway is still
            // expecting a reply, so we report the error
            // and just send whatever the current value is.
            console.error('AdapterManagerProxy: Failed to setProperty',
                          propertyName, 'to', propertyValue,
                          'for device:', deviceId);
            console.error(err);
            this.sendPropertyChangedNotification(property);
          });
        } else {
          console.error('AdapterManagerProxy: Unknown property:',
                        propertyName);
        }
        break;

      default:
        console.warn('AdapterManagerProxy: unrecognized msg:', msg);
        break;
    }
  }

  /**
   * @method sendPropertyChangedNotification
   * Sends a propertyChanged notification to the gateway.
   */
  sendPropertyChangedNotification(property) {
    this.pluginClient.sendNotification(Constants.PROPERTY_CHANGED, {
      deviceId: property.device.id,
      propertyName: property.name,
      propertyValue: property.value,
    });
  }
}

module.exports = AdapterManagerProxy;