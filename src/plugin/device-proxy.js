/**
 * DeviceProxy - Gateway side representation of a device when using
 *               an adapter plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Actions = require('../models/actions');
const Constants = require('../constants');
const Event = require('../models/event');
const Events = require('../models/events');
const PropertyProxy = require('./property-proxy');
const {Device, Deferred} = require('gateway-addon');

class DeviceProxy extends Device {

  constructor(adapter, deviceDict) {
    super(adapter, deviceDict.id);

    this.name = deviceDict.name;
    this.type = deviceDict.type;
    this['@context'] =
      deviceDict['@context'] || 'https://iot.mozilla.org/schemas';
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
      if (['id', 'name', 'type', 'description', 'properties', 'actions',
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
      Constants.DEBUG_CMD, {
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
        Constants.REQUEST_ACTION, {
          deviceId: this.id,
          actionName,
          actionId,
          input,
        }, deferredSet);
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
        Constants.REMOVE_ACTION, {
          deviceId: this.id,
          actionName,
          actionId,
        }, deferredSet);
    });
  }

  actionNotify(action) {
    const a = Actions.get(action.id);
    if (a) {
      a.update(action);
    }
  }

  eventNotify(event) {
    Events.add(new Event(event.name, event.data, this.id, event.timestamp));
  }
}

module.exports = DeviceProxy;
