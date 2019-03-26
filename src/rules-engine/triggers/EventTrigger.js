/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const assert = require('assert');
const Events = require('../Events');
const Things = require('../../models/things');
const Trigger = require('./Trigger');

/**
 * A trigger activated when an event occurs
 */
class EventTrigger extends Trigger {
  constructor(desc) {
    super(desc);
    assert(desc.thing);
    this.thing = desc.thing;
    this.event = desc.event;
    this.stopped = true;
    this.onEvent = this.onEvent.bind(this);
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {
        thing: this.thing,
        event: this.event,
      }
    );
  }

  async start() {
    this.stopped = false;
    const thing = await Things.getThing(this.thing);
    if (this.stopped) {
      return;
    }
    thing.addEventSubscription(this.onEvent);
  }

  onEvent(event) {
    if (this.event !== event.name) {
      return;
    }

    this.emit(Events.STATE_CHANGED, {on: true, value: Date.now()});
    this.emit(Events.STATE_CHANGED, {on: false, value: Date.now()});
  }

  stop() {
    this.stopped = true;
    Things.getThing(this.thing).then((thing) => {
      thing.removeEventSubscription(this.onEvent);
    });
  }
}

module.exports = EventTrigger;

