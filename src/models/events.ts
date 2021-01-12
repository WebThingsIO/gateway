/**
 * Events.
 *
 * Manages a collection of Events.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {AddonManager} from '../addon-manager';
import Event, {EventDescription} from './event';

export default class Events {
  private events: Event[];

  constructor(private addonManager: AddonManager) {
    this.events = [];
  }

  /**
   * Reset events state.
   */
  clearState(): void {
    this.events = [];
  }

  /**
   * Get only the events which are not associated with a specific thing and
   * therefore belong to the root Gateway.
   */
  getGatewayEvents(eventName?: string): {[name: string]: EventDescription}[] {
    return this.events.filter((event) => {
      return !event.getThingId();
    }).filter((event) => {
      if (eventName) {
        return eventName === event.getName();
      }

      return true;
    }).map((event) => {
      return {[event.getName()]: event.getDescription()};
    });
  }


  /**
   * Get only the events which are associated with a specific thing.
   */
  getByThing(thingId: string, eventName?: string): {[name: string]: EventDescription}[] {
    return this.events.filter((event) => {
      return event.getThingId() === thingId;
    }).filter((event) => {
      if (eventName) {
        return eventName === event.getName();
      }

      return true;
    }).map((event) => {
      return {[event.getName()]: event.getDescription()};
    });
  }

  /**
   * Add a new event.
   *
   * @param {Object} event An Event object.
   * @returns {Promise} Promise which resolves when the event has been added.
   */
  add(event: Event): Promise<void> {
    this.events.push(event);

    if (event.getThingId()) {
      return this.addonManager
        .getThingsCollection()
        .getThing(event.getThingId()).then((thing: any) => {
          thing.dispatchEvent(event);
        }).catch(() => {
          console.warn('Received event for unknown thing:', event.getThingId());
        });
    }

    return Promise.resolve();
  }
}
