/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const Events = require('../Events');
const Trigger = require('./Trigger');

/**
 * An abstract class for triggers whose input is a single property
 */
class TimeTrigger extends Trigger {
  constructor(desc) {
    super();
    this.time = desc.time;
    this.sendStateChanged = this.sendStateChanged.bind(this);
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {time: this.time}
    );
  }

  async start() {
    this.scheduleNext();
  }

  scheduleNext() {
    let parts = this.time.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);

    let nextTime = new Date();
    nextTime.setHours(hours);
    nextTime.setMinutes(minutes);
    nextTime.setSeconds(0);
    nextTime.setMilliseconds(0);

    if (nextTime.getTime() < Date.now()) {
      // NB: this will wrap properly into the next month/year
      nextTime.setDate(nextTime.getDate() + 1);
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.sendStateChanged,
                              nextTime.getTime() - Date.now());
  }

  sendStateChanged() {
    this.emit(Events.STATE_CHANGED, {on: true, value: Date.now()});
    this.scheduleNext();
  }

  stop() {
    clearTimeout(this.timeout);
    this.timeout = null;
  }
}

module.exports = TimeTrigger;

