/**
 * Event Model.
 *
 * Manages Event data model
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Utils} from 'gateway-addon';
import {Any} from 'gateway-addon/lib/schema';

export interface EventDescription {
  data: Any;
  timestamp: string;
}

export default class Event {
  private name: string;

  private data: Any;

  private thingId: string;

  private timestamp: string;

  /**
   * Create a new Event
   * @param {String} name
   * @param {*} data
   * @param {String} thingId
   * @param {String?} timestamp
   */
  constructor(name: string, data: Any | undefined, thingId: string, timestamp?: string) {
    this.name = name;
    this.data = typeof data === 'undefined' ? null : data;
    this.thingId = thingId;
    this.timestamp = timestamp || Utils.timestamp();
  }

  getDescription(): EventDescription {
    return {
      data: this.data,
      timestamp: this.timestamp,
    };
  }

  getName(): string {
    return this.name;
  }

  getThingId(): string {
    return this.thingId;
  }

  setThingId(thingId: string): void {
    this.thingId = thingId;
  }

  getData(): Any {
    return this.data;
  }
}
