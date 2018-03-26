/**
 * Event Model.
 *
 * Manages Event data model
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const {Utils} = require('gateway-addon');

class Event {
  /**
   * Create a new Event
   * @param {String} name
   * @param {*} data
   * @param {Thing?} thing
   * @param {String?} timestamp
   */
  constructor(name, data, thing, timestamp) {
    this.name = name;
    this.data = data || null;
    this.timestamp = timestamp || Utils.timestamp();
    if (thing) {
      this.thingId = thing.id;
    }
  }

  getDescription() {
    return {
      name: this.name,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}

module.exports = Event;
