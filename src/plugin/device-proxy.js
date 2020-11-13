/**
 * DeviceProxy - Gateway side representation of a device when using
 *               an adapter plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Actions = require('../models/actions');
const Constants = require('../constants');
const {Device, Deferred} = require('gateway-addon');
const Event = require('../models/event');
const Events = require('../models/events');
const {MessageType} = require('gateway-addon').Constants;
const PropertyProxy = require('./property-proxy');

class DeviceProxy extends Device {

  constructor(adapter, deviceDict) {
    super(adapter, deviceDict.id);

    this.title = deviceDict.title;
    this['@context'] =
      deviceDict['@context'] || 'https://webthings.io/schemas';
    this['@type'] = deviceDict['@type'] || [];
    this.description = deviceDict.description || '';
    this.links = deviceDict.links || [];
    this.baseHref = deviceDict.baseHref || null;

    if (deviceDict.hasOwnProperty('pin')) {
      this.pinRequired = deviceDict.pin.required;
      this.pinPattern = deviceDict.pin.pattern;
    } else {
      this.pinRequired = false;
      this.pinPattern = null;
    }

    this.credentialsRequired = !!deviceDict.credentialsRequired;

    for (const propertyName in deviceDict.properties) {
      const propertyDict = deviceDict.properties[propertyName];
      const propertyProxy =
        new PropertyProxy(this, propertyName, propertyDict);
      this.properties.set(propertyName, propertyProxy);
    }

    // Copy over any extra device fields which might be useful for debugging.
    this.deviceDict = {};
    for (const field in deviceDict) {
      if (['id', 'title', 'description', 'properties', 'actions',
           'events', '@type', '@context', 'links'].includes(field)) {
        continue;
      }
      this.deviceDict[field] = deviceDict[field];
    }

    if (deviceDict.actions) {
      for (const actionName in deviceDict.actions) {
        const dict = deviceDict.actions[actionName];
        this.actions.set(actionName, dict);
      }
    }

    if (deviceDict.events) {
      for (const eventName in deviceDict.events) {
        const dict = deviceDict.events[eventName];
        this.events.set(eventName, dict);
      }
    }
  }

  asDict() {
    return Object.assign({}, this.deviceDict, super.asDict());
  }

  debugCmd(cmd, params) {
    this.adapter.sendMsg(
      MessageType.DEVICE_DEBUG_COMMAND,
      {
        deviceId: this.id,
        cmd: cmd,
        params: params,
      }
    );
  }

  /**
   * @method requestAction
   */
  requestAction(actionId, actionName, input) {
    return new Promise((resolve, reject) => {
      if (!this.actions.has(actionName)) {
        reject(`Action "${actionName}" not found`);
        return;
      }

      console.log('DeviceProxy: requestAction:', actionName,
                  'for:', this.id);

      const deferredSet = new Deferred();

      deferredSet.promise.then(() => {
        resolve();
      }).catch(() => {
        reject();
      });

      this.adapter.sendMsg(
        MessageType.DEVICE_REQUEST_ACTION_REQUEST,
        {
          deviceId: this.id,
          actionName,
          actionId,
          input,
        },
        deferredSet
      );
    });
  }

  /**
   * @method removeAction
   */
  removeAction(actionId, actionName) {
    return new Promise((resolve, reject) => {
      if (!this.actions.has(actionName)) {
        reject(`Action "${actionName}" not found`);
        return;
      }

      console.log('DeviceProxy: removeAction:', actionName,
                  'for:', this.id);

      const deferredSet = new Deferred();

      deferredSet.promise.then(() => {
        resolve();
      }).catch(() => {
        reject();
      });

      this.adapter.sendMsg(
        MessageType.DEVICE_REMOVE_ACTION_REQUEST,
        {
          deviceId: this.id,
          actionName,
          actionId,
        },
        deferredSet
      );
    });
  }

  notifyPropertyChanged(property) {
    this.adapter.manager.emit(Constants.PROPERTY_CHANGED, property);
  }

  actionNotify(action) {
    const a = Actions.get(action.id);
    if (a) {
      a.update(action);
    }
    this.adapter.manager.emit(Constants.ACTION_STATUS, action);
  }

  eventNotify(event) {
    Events.add(new Event(event.name, event.data, this.id, event.timestamp));
    this.adapter.manager.emit(Constants.EVENT, event);
  }

  connectedNotify(connected) {
    this.adapter.manager.emit(Constants.CONNECTED, {device: this, connected});
  }
}

module.exports = DeviceProxy;
