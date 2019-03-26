/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const assert = require('assert');
const Events = require('../Events');
const Trigger = require('./Trigger');

const DEBUG = false || (process.env.NODE_ENV === 'test');

const ops = {
  AND: 'AND',
  OR: 'OR',
};

/**
 * A Trigger which activates only when a set of triggers are activated
 */
class MultiTrigger extends Trigger {
  /**
   * @param {TriggerDescription} desc
   */
  constructor(desc) {
    super(desc);
    assert(desc.op in ops);
    this.op = desc.op;
    const fromDescription = require('./index').fromDescription;

    if (DEBUG) {
      this.id = Math.floor(Math.random() * 1000);
    }
    this.triggers = desc.triggers.map((trigger) => {
      return fromDescription(trigger);
    });

    this.states = new Array(this.triggers.length);
    for (let i = 0; i < this.states.length; i++) {
      this.states[i] = false;
    }
    this.state = false;
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription() {
    return Object.assign(super.toDescription(), {
      op: this.op,
      triggers: this.triggers.map((trigger) => trigger.toDescription()),
    });
  }

  async start() {
    const starts = this.triggers.map((trigger, triggerIndex) => {
      trigger.on(Events.STATE_CHANGED,
                 this.onStateChanged.bind(this, triggerIndex));
      return trigger.start();
    });
    await Promise.all(starts);
  }

  stop() {
    this.triggers.forEach((trigger) => {
      trigger.removeAllListeners(Events.STATE_CHANGED);
      trigger.stop();
    });
  }

  onStateChanged(triggerIndex, state) {
    this.states[triggerIndex] = state.on;

    let value = this.states[0];
    for (let i = 1; i < this.states.length; i++) {
      if (this.op === ops.AND) {
        value = value && this.states[i];
      } else if (this.op === ops.OR) {
        value = value || this.states[i];
      }
    }
    if (DEBUG) {
      console.debug(
        `MultiTrigger(${this.id}).onStateChanged(${triggerIndex}, ${state}) -> ${this.states}`);
    }
    if (value !== this.state) {
      this.state = value;
      this.emit(Events.STATE_CHANGED, {on: this.state});
    }
  }
}

module.exports = MultiTrigger;
