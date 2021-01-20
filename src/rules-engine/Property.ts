/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import assert from 'assert';
import AddonManager from '../addon-manager';
import * as Constants from '../constants';
import Things from '../models/things';
import {EventEmitter} from 'events';
import * as Events from './Events';
import {Property as AddonProperty} from 'gateway-addon';
import {PropertyValue} from 'gateway-addon/lib/schema';

export interface PropertyDescription {
  id: string;
  type: string;
  thing: string;
  unit?: string;
  description?: string;
  href?: string;
}

/**
 * Utility to support operations on Thing's properties
 */
export default class Property extends EventEmitter {
  private type: string;

  private thing: string;

  private id: string;

  private unit?: string;

  private description?: string;

  /**
   * Create a Property from a descriptor returned by the WoT API
   * @param {PropertyDescription} desc
   */
  constructor(desc: PropertyDescription) {
    super();

    assert(desc.type);
    assert(desc.thing);
    assert(desc.id);

    this.type = desc.type;
    this.thing = desc.thing;
    this.id = desc.id;

    if (desc.unit) {
      this.unit = desc.unit;
    }
    if (desc.description) {
      this.description = desc.description;
    }

    this.onPropertyChanged = this.onPropertyChanged.bind(this);
    this.onThingAdded = this.onThingAdded.bind(this);
  }

  getType(): string {
    return this.type;
  }

  /**
   * @return {PropertyDescription}
   */
  toDescription(): PropertyDescription {
    const desc: PropertyDescription = {
      type: this.type,
      thing: this.thing,
      id: this.id,
    };
    if (this.unit) {
      desc.unit = this.unit;
    }
    if (this.description) {
      desc.description = this.description;
    }
    return desc;
  }

  /**
   * @return {Promise} resolves to property's value or undefined if not found
   */
  async get(): Promise<any> {
    try {
      return await Things.getThingProperty(this.thing, this.id);
    } catch (e) {
      console.warn('Rule get failed', e);
    }
  }

  /**
   * @param {any} value
   * @return {Promise} resolves when set is done
   */
  set(value: PropertyValue): Promise<any> {
    return Things.setThingProperty(this.thing, this.id, value).catch((e: any) => {
      console.warn('Rule set failed, retrying once', e);
      return Things.setThingProperty(this.thing, this.id, value);
    }).catch((e: any) => {
      console.warn('Rule set failed completely', e);
    });
  }

  async start(): Promise<any> {
    AddonManager.on(Constants.PROPERTY_CHANGED, this.onPropertyChanged);

    try {
      await this.getInitialValue();
    } catch (_e) {
      AddonManager.on(Constants.THING_ADDED, this.onThingAdded);
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
  onThingAdded(thing: any): void {
    if (thing.id !== this.thing) {
      return;
    }
    this.getInitialValue().catch((e) => {
      console.warn('Rule property unable to get initial value:', e.message);
    });
  }

  onPropertyChanged(property: AddonProperty<PropertyValue>): void {
    if (property.getDevice().getId() !== this.thing) {
      return;
    }
    if (property.getName() !== this.id) {
      return;
    }
    this.emit(Events.VALUE_CHANGED, (property as any).value);
  }

  stop(): void {
    AddonManager.removeListener(Constants.PROPERTY_CHANGED,
                                this.onPropertyChanged);
    AddonManager.removeListener(Constants.THING_ADDED,
                                this.onThingAdded);
  }
}
