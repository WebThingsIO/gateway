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

/**
 * Create a new Event
 * @param {String} name
 * @param {String?} description
 */
function Event(name, description) {
  this.name = name;
  if (description) {
    this.description = description;
  }
  this.time = new Date();
}

Event.prototype.getDescription = function() {
  return {
    name: this.name,
    description: this.description,
    time: this.time
  };
};

module.exports = Event;
