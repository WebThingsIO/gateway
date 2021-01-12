/**
 * DeviceProxy - Gateway side representation of a device when using
 *               an adapter plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import {ACTION_STATUS, CONNECTED, EVENT, PROPERTY_CHANGED} from '../constants';
import {Device, Adapter, Action as AddonAction, Event as AddonEvent, Property} from 'gateway-addon';
import Event from '../models/event';
const {MessageType} = require('gateway-addon').Constants;
import PropertyProxy from './property-proxy';
import {Action as ActionSchema,
  PropertyValue,
  Device as DeviceSchema,
  Link,
  Input} from 'gateway-addon/lib/schema';
import AdapterProxy from './adapter-proxy';
import Deferred from '../deferred';
import Action from '../models/action';
import Logs from '../models/logs';
import {AddonManager} from '../addon-manager';

export default class DeviceProxy extends Device {
  private deviceDict: Record<string, unknown>;

  constructor(private addonManager: AddonManager, adapter: Adapter, deviceDict: DeviceSchema) {
    super(adapter, deviceDict.id);

    this.setTitle(deviceDict.title ?? '');
    this['@context'] =
      deviceDict['@context'] || 'https://webthings.io/schemas';
    this['@type'] = deviceDict['@type'] || [];
    this.setDescription(deviceDict.description ?? '');
    (<{links: Link[]}><unknown> this).links = deviceDict.links || [];
    (<{baseHref: string | null}><unknown> this).baseHref = deviceDict.baseHref || null;

    if (deviceDict.pin) {
      (<{pinRequired: boolean}><unknown> this).pinRequired = deviceDict.pin.required ?? false;
      (<{pinPattern: string | null}><unknown> this).pinPattern = deviceDict.pin.pattern ?? null;
    } else {
      (<{pinRequired: boolean}><unknown> this).pinRequired = false;
      (<{pinPattern: string | null}><unknown> this).pinPattern = null;
    }

    (<{credentialsRequired: boolean}><unknown> this).credentialsRequired =
    !!deviceDict.credentialsRequired;

    for (const propertyName in deviceDict.properties) {
      const propertyDict = deviceDict.properties[propertyName];
      const propertyProxy =
        new PropertyProxy(this, propertyName, propertyDict);
      this.addProperty(propertyProxy);
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
        this.addAction(actionName, dict);
      }
    }

    if (deviceDict.events) {
      for (const eventName in deviceDict.events) {
        const dict = deviceDict.events[eventName];
        this.addEvent(eventName, dict);
      }
    }
  }

  asDict(): DeviceSchema {
    return Object.assign({}, this.deviceDict, super.asDict());
  }

  debugCmd(cmd: string, params: Record<string, string>): void {
    (<AdapterProxy> this.getAdapter()).sendMsg(
      MessageType.DEVICE_DEBUG_COMMAND,
      {
        deviceId: this.getId(),
        cmd: cmd,
        params: params,
      }
    );
  }

  /**
   * @method requestAction
   */
  requestAction(actionId: string, actionName: string, input: Input): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!(<{actions: Map<string, ActionSchema>}><unknown> this).actions.has(actionName)) {
        reject(`Action "${actionName}" not found`);
        return;
      }

      console.log('DeviceProxy: requestAction:', actionName,
                  'for:', this.getId());

      const deferredSet = new Deferred<unknown, unknown>();

      deferredSet.getPromise().then(() => {
        resolve();
      }).catch(() => {
        reject();
      });

      (<AdapterProxy> this.getAdapter()).sendMsg(
        MessageType.DEVICE_REQUEST_ACTION_REQUEST,
        {
          deviceId: this.getId(),
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
  removeAction(actionId: string, actionName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!(<{actions: Map<string, ActionSchema>}><unknown> this).actions.has(actionName)) {
        reject(`Action "${actionName}" not found`);
        return;
      }

      console.log('DeviceProxy: removeAction:', actionName,
                  'for:', this.getId());

      const deferredSet = new Deferred<unknown, unknown>();

      deferredSet.getPromise().then(() => {
        resolve();
      }).catch(() => {
        reject();
      });

      (<AdapterProxy><unknown> this.getAdapter()).sendMsg(
        MessageType.DEVICE_REMOVE_ACTION_REQUEST,
        {
          deviceId: this.getId(),
          actionName,
          actionId,
        },
        deferredSet
      );
    });
  }

  notifyPropertyChanged(property: Property<PropertyValue>): void {
    Logs.onPropertyChanged(property);
    this.getAdapter().getManager().emit(PROPERTY_CHANGED, property);
  }

  actionNotify(action: AddonAction): void {
    const a = <Action><unknown> this.addonManager
      .getActionsCollection().get(action.asDict().id);
    if (a) {
      a.update(action);
    }
    this.getAdapter().getManager().emit(ACTION_STATUS, action);
  }

  eventNotify(event: AddonEvent): void {
    this.addonManager
      .getEventsCollection()
      .add(new Event(
        event.asDict().name, event.asDict().data, this.getId(), event.asDict().timestamp));
    this.getAdapter().getManager().emit(EVENT, event);
  }

  connectedNotify(connected: boolean): void {
    this.getAdapter().getManager().emit(CONNECTED, {device: this, connected});
  }
}
