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
   * @param {String?} thingId
   * @param {String?} timestamp
   */
  constructor(name, data, thingId, timestamp) {
    this.name = name;
    this.data = data || null;
    this.thingId = thingId;
    this.timestamp = timestamp || Utils.timestamp();
  }

  getDescription() {
    return {
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}

module.exports = Event;
