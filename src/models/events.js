/**
 * Events.
 *
 * Manages a collection of Events.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Things = require('../models/things');

class Events {

  constructor() {
    this.events = [];
  }

  /**
   * Reset events state.
   */
  clearState() {
    this.events = [];
  }

  /**
   * Get only the events which are not associated with a specific thing and
   * therefore belong to the root Gateway.
   */
  getGatewayEvents(eventName) {
    return this.events.filter((event) => {
      return !event.thingId;
    }).filter((event) => {
      if (eventName) {
        return eventName === event.name;
      }

      return true;
    }).map((event) => {
      return {[event.name]: event.getDescription()};
    });
  }


  /**
   * Get only the events which are associated with a specific thing.
   */
  getByThing(thingId, eventName) {
    return this.events.filter((event) => {
      return event.thingId === thingId;
    }).filter((event) => {
      if (eventName) {
        return eventName === event.name;
      }

      return true;
    }).map((event) => {
      return {[event.name]: event.getDescription()};
    });
  }

  /**
   * Add a new event.
   *
   * @param {Object} event An Event object.
   * @returns {Promise} Promise which resolves when the event has been added.
   */
  add(event) {
    this.events.push(event);

    if (event.thingId) {
      return Things.getThing(event.thingId).then((thing) => {
        thing.dispatchEvent(event);
      });
    }

    return Promise.resolve();
  }
}

module.exports = new Events();
