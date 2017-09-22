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

const EventEmitter = require('events').EventEmitter;

const DEBUG = false;

class AdapterManagerProxy extends EventEmitter {

  constructor (pluginClient) {
    super();

    this.pluginClient = pluginClient;

    this.on('property-changed', (property) => {
      DEBUG && console.log('proxy: Got "property-changed" notification for',
                           property.name, 'value:', property.value);

      this.pluginClient.sendNotification('propertyChanged', {
        deviceId: property.device.id,
        propertyName: property.name,
        propertyValue: property.value,
      });
    });
  }

  /**
   * @method addAdapter
   *
   * Adds an adapter to the collection of adapters managed by AdapterManager.
   */
  addAdapter(adapter) {
    DEBUG && console.log('AdapterManagerProxy: addAdapter');
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
    DEBUG && console.log('AdapterManagerProxy: handleDeviceAdded');
    this.pluginClient.sendNotification('handleDeviceAdded', device.asDict());
  }

  /**
   * @method handleDeviceRemoved
   * Called when the indicated device has been removed an adapter.
   */
  handleDeviceRemoved(device) {
    DEBUG && console.log('AdapterManagerProxy: handleDeviceRemoveds');
    this.pluginClient.sendNotification('handleDeviceRemoved', {
      id: device.id,
    });
  }

  onMsg(msg) {
    DEBUG && console.log('AdapterManagerProxy: Rcvd:', msg);
    var adapter = this.adapter;
    if (!adapter) {
      console.error('AdapterManagerProxy: No adapter added yet.')
      console.error('AdapterManagerProxy: Ignoring msg:', msg);
      return;
    }

    // The first switch covers adapter messages. i.e. don't have a deviceId.
    switch (msg.messageType) {

      case 'startPairing':
        adapter.startPairing(msg.data.timeout);
        return;

      case 'cancelPairing':
        adapter.cancelPairing();
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

      case 'removeThing':
        adapter.removeThing(device);
        break;

      case 'cancelRemoveThing':
        adapter.cancelRemoveThing(device);
        break;

      case 'setProperty':
        var propertyName = msg.data.propertyName;
        var propertyValue = msg.data.propertyValue;
        device.setProperty(propertyName, propertyValue)
          .then(updatedValue => {
            this.pluginClient.sendReply(msg, {
              deviceId: deviceId,
              propertyName: propertyName,
              propertyValue: updatedValue
            });
          }).catch(error => {
            console.error('AdapterManagerProxy: Failed to setProperty',
                          propertyName, 'to', propertyValue,
                          'for device:', deviceId);
            console.error(error);
          });
        break;

      default:
        console.warning('AdapterManagerProxy: unrecognized msg:', msg);
        break;
    }
  }
}

module.exports = AdapterManagerProxy;