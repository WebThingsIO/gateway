/**
 * PropertyProxy - Gateway side representation of a property
 *                 when using an adapter plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Any, Property as PropertySchema } from 'gateway-addon/lib/schema';
import Deferred from '../deferred';
import { Property, Constants } from 'gateway-addon';
import DeviceProxy from './device-proxy';
const MessageType = Constants.MessageType;

export default class PropertyProxy extends Property<Any> {
  private propertyChangedPromises: Deferred<Any, unknown>[];

  private propertyDict: PropertySchema;

  constructor(device: DeviceProxy, propertyName: string, propertyDict: PropertySchema) {
    super(device, propertyName, propertyDict);

    this.setCachedValue(propertyDict.value!);

    this.propertyChangedPromises = [];
    this.propertyDict = Object.assign({}, propertyDict);
  }

  getDevice(): DeviceProxy {
    return <DeviceProxy>super.getDevice();
  }

  asDict(): PropertySchema {
    return Object.assign({}, this.propertyDict, super.asDict());
  }

  /**
   * @method onPropertyChanged
   * @returns a promise which is resoved when the next
   * propertyChanged notification is received.
   */
  onPropertyChanged(): Promise<Any> {
    const deferredChange = new Deferred<Any, unknown>();
    this.propertyChangedPromises.push(deferredChange);
    return deferredChange.getPromise();
  }

  /**
   * @method doPropertyChanged
   * Called whenever a property changed notification is received
   * from the adapter.
   */
  doPropertyChanged(propertyDict: PropertySchema): void {
    this.propertyDict = Object.assign({}, propertyDict);
    this.setCachedValue(propertyDict.value!);
    if (typeof propertyDict.title === 'string') {
      this.setTitle(propertyDict.title);
    }
    if (typeof propertyDict.type === 'string') {
      this.setType(propertyDict.type);
    }
    if (typeof propertyDict['@type'] === 'string') {
      this.setAtType(propertyDict['@type']);
    }
    if (typeof propertyDict.unit === 'string') {
      this.setUnit(propertyDict.unit);
    }
    if (typeof propertyDict.description === 'string') {
      this.setDescription(propertyDict.description);
    }
    if (typeof propertyDict.minimum === 'number') {
      this.setMinimum(propertyDict.minimum);
    }
    if (typeof propertyDict.maximum === 'number') {
      this.setMaximum(propertyDict.maximum);
    }
    if (typeof propertyDict.multipleOf === 'number') {
      this.setMultipleOf(propertyDict.multipleOf);
    }
    if (Array.isArray(propertyDict.enum)) {
      this.setEnum(propertyDict.enum);
    }
    if (Array.isArray(propertyDict.links)) {
      this.setLinks(propertyDict.links);
    }

    while (this.propertyChangedPromises.length > 0) {
      const deferredChange = this.propertyChangedPromises.pop();
      deferredChange?.resolve(propertyDict.value!);
    }
  }

  /**
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(value: Any): Promise<Any> {
    return new Promise((resolve, reject) => {
      this.getDevice().getAdapter().sendMsg(MessageType.DEVICE_SET_PROPERTY_COMMAND, {
        deviceId: this.getDevice().getId(),
        propertyName: this.getName(),
        propertyValue: value,
      });

      // TODO: Add a timeout

      this.onPropertyChanged()
        .then((updatedValue) => {
          resolve(updatedValue);
        })
        .catch((error) => {
          console.error(
            'PropertyProxy: Failed to setProperty',
            this.getName(),
            'to',
            value,
            'for device:',
            this.getDevice().getId()
          );
          console.error(error);
          reject(error);
        });
    });
  }
}
