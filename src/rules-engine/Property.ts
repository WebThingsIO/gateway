/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import assert from 'assert';
import {AddonManager} from '../addon-manager';
import {PROPERTY_CHANGED, THING_ADDED} from '../constants';
import {EventEmitter} from 'events';
import Events from './Events';
import Thing from '../models/thing';
import {PropertyValue} from 'gateway-addon/lib/schema';

export interface PropertyDescription {
  id: string,
  type: string,
  thing: string,
  unit?: string,
  description?: string,
}

/**
 * Utility to support operations on Thing's properties
 */
export default class Property extends EventEmitter {
  /**
   * Create a Property from a descriptor returned by the WoT API
   * @param {PropertyDescription} desc
   */
  constructor(private addonManager: AddonManager, private desc: PropertyDescription) {
    super();

    assert(desc.type);
    assert(desc.thing);
    assert(desc.id);

    this.onPropertyChanged = this.onPropertyChanged.bind(this);
    this.onThingAdded = this.onThingAdded.bind(this);
  }

  getType(): string {
    return this.desc.type;
  }

  /**
   * @return {PropertyDescription}
   */
  toDescription(): PropertyDescription {
    return {...this.desc};
  }

  /**
   * @return {Promise} resolves to property's value or undefined if not found
   */
  async get(): Promise<unknown> {
    const {
      id,
      thing,
    } = this.desc;

    try {
      return await this.addonManager.getThingsCollection().getThingProperty(thing, id);
    } catch (e) {
      console.warn('Rule get failed', e);
    }

    // eslint-disable-next-line no-useless-return
    return;
  }

  /**
   * @param {any} value
   * @return {Promise} resolves when set is done
   */
  set(value: any): Promise<PropertyValue | void> {
    const {
      id,
      thing,
    } = this.desc;

    return this.addonManager
      .getThingsCollection()
      .setThingProperty(thing, id, value)
      .catch((e) => {
        console.warn('Rule set failed, retrying once', e);
        return this.addonManager.getThingsCollection().setThingProperty(thing, id, value);
      })
      .catch((e) => {
        console.warn('Rule set failed completely', e);
      });
  }

  async start(): Promise<void> {
    this.addonManager.on(PROPERTY_CHANGED, this.onPropertyChanged);

    try {
      await this.getInitialValue();
    } catch (_e) {
      this.addonManager.on(THING_ADDED, this.onThingAdded);
    }
  }

  async getInitialValue(): Promise<void> {
    const initialValue = await this.get();
    if (typeof initialValue === 'undefined') {
      throw new Error('Did not get a real value');
    }
    this.emit(Events.VALUE_CHANGED, initialValue);
  }

  /**
   * Listener for AddonManager's THING_ADDED event
   * @param {String} thing - thing id
   */
  onThingAdded(thing: Thing): void {
    if (thing.getId() !== this.desc.thing) {
      return;
    }
    this.getInitialValue().catch((e) => {
      console.warn('Rule property unable to get initial value:', e.message);
    });
  }

  onPropertyChanged(property: any): void {
    const {
      id,
      thing,
    } = this.desc;

    if (property.device.id !== thing) {
      return;
    }
    if (property.name !== id) {
      return;
    }
    this.emit(Events.VALUE_CHANGED, property.value);
  }

  stop(): void {
    this.addonManager.removeListener(PROPERTY_CHANGED,
                                     this.onPropertyChanged);
    this.addonManager.removeListener(THING_ADDED,
                                     this.onThingAdded);
  }
}
