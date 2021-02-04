/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Events from '../Events';
import Trigger, { TriggerDescription } from './Trigger';

export interface TimeTriggerDescription extends TriggerDescription {
  time: string;
  localized: boolean;
}

/**
 * An abstract class for triggers whose input is a single property
 */
export default class TimeTrigger extends Trigger {
  private time: string;

  private localized: boolean;

  private timeout: NodeJS.Timeout | null;

  private _sendOn: () => void;

  private _sendOff: () => void;

  constructor(desc: TimeTriggerDescription) {
    super(desc);
    this.time = desc.time;
    this.localized = !!desc.localized;
    this.timeout = null;
    this._sendOn = this.sendOn.bind(this);
    this._sendOff = this.sendOff.bind(this);
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription(): TimeTriggerDescription {
    return Object.assign(super.toDescription(), { time: this.time, localized: this.localized });
  }

  async start(): Promise<void> {
    this.scheduleNext();
  }

  scheduleNext(): void {
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

    this.timeout = setTimeout(this._sendOn, nextTime.getTime() - Date.now());
  }

  sendOn(): void {
    this.emit(Events.STATE_CHANGED, { on: true, value: Date.now() });
    this.timeout = setTimeout(this._sendOff, 60 * 1000);
  }

  sendOff(): void {
    this.emit(Events.STATE_CHANGED, { on: false, value: Date.now() });
    this.scheduleNext();
  }

  stop(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}
