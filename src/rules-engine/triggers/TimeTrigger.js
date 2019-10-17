/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Events = require('../Events');
const Trigger = require('./Trigger');

/**
 * An abstract class for triggers whose input is a single property
 */
class TimeTrigger extends Trigger {
  constructor(desc) {
    super(desc);
    this.time = desc.time;
    this.localized = !!desc.localized;
    this.sendOn = this.sendOn.bind(this);
    this.sendOff = this.sendOff.bind(this);
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {time: this.time, localized: this.localized}
    );
  }

  async start() {
    this.scheduleNext();
  }

  scheduleNext() {
    const parts = this.time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    // Time is specified in local time
    const nextTime = new Date();
    nextTime.setHours(hours, minutes, 0, 0);

    if (nextTime.getTime() < Date.now()) {
      // NB: this will wrap properly into the next month/year
      nextTime.setDate(nextTime.getDate() + 1);
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.sendOn, nextTime.getTime() - Date.now());
  }

  sendOn() {
    this.emit(Events.STATE_CHANGED, {on: true, value: Date.now()});
    this.timeout = setTimeout(this.sendOff, 60 * 1000);
  }

  sendOff() {
    this.emit(Events.STATE_CHANGED, {on: false, value: Date.now()});
    this.scheduleNext();
  }

  stop() {
    clearTimeout(this.timeout);
    this.timeout = null;
  }
}

module.exports = TimeTrigger;

