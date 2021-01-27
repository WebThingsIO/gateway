/**
 * DeviceProxy - Gateway side representation of a device when using
 *               an adapter plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Constants from '../constants';
import {
  Constants as AddonConstants,
  Device,
  Property,
} from 'gateway-addon';
import {
  ActionDescription,
  Device as DeviceSchema,
  EventDescription1,
  Input,
  Link,
  PropertyValue,
} from 'gateway-addon/lib/schema';
import Deferred from '../deferred';
import Actions from '../models/actions';
import AdapterProxy from './adapter-proxy';
import Event from '../models/event';
import Events from '../models/events';
import PropertyProxy from './property-proxy';
const MessageType = AddonConstants.MessageType;

export default class DeviceProxy extends Device {
  private deviceDict: Record<string, unknown>;

  constructor(adapter: AdapterProxy, deviceDict: DeviceSchema) {
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
      const propertyProxy = new PropertyProxy(this, propertyName, propertyDict);
      this.addProperty(<Property<PropertyValue>><unknown>propertyProxy);
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

  getAdapter(): AdapterProxy {
    return <AdapterProxy>(super.getAdapter());
  }

  asDict(): DeviceSchema {
    return Object.assign({}, this.deviceDict, super.asDict());
  }

  /**
   * @method requestAction
   */
  requestAction(actionId: string, actionName: string, input: Input): Promise<void> {
    return new Promise((resolve, reject) => {
      // TODO: fix after updating gateway-addon
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(this as any).actions.has(actionName)) {
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

      this.getAdapter().sendMsg(
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
      // TODO: fix after updating gateway-addon
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(this as any).actions.has(actionName)) {
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

      this.getAdapter().sendMsg(
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
    this.getAdapter().getManager().emit(Constants.PROPERTY_CHANGED, property);
  }

  actionNotify(action: unknown): void {
    const a = <ActionDescription>action;
    const internalAction = Actions.get(a.id);
    if (internalAction) {
      internalAction.update(a);
    }
    this.getAdapter().getManager().emit(Constants.ACTION_STATUS, a);
  }

  eventNotify(event: unknown): void {
    const e = <EventDescription1>event;
    Events.add(new Event(e.name, e.data, this.getId(), e.timestamp));
    this.getAdapter().getManager().emit(Constants.EVENT, e);
  }

  connectedNotify(connected: boolean): void {
    this.getAdapter().getManager().emit(Constants.CONNECTED, {device: this, connected});
  }
}
