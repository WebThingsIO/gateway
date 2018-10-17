/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const Constants = require('../../constants.js');
const Events = require('../Events');
const ThingConnection = require('../ThingConnection');
const Trigger = require('./Trigger');

/**
 * A trigger activated when an event occurs
 */
class EventTrigger extends Trigger {
  constructor(desc) {
    super();
    this.thing = desc.thing;
    this.event = desc.event;
    this.timeout = null;
    this.onMessage = this.onMessage.bind(this);
    this.thingConn = new ThingConnection(desc.thing.href, this.onMessage);
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
    await this.thingConn.start();
    await this.thingConn.send(JSON.stringify({
      messageType: Constants.ADD_EVENT_SUBSCRIPTION,
      data: {
        [this.event]: {},
      },
    }));
  }

  onMessage(msg) {
    if (msg.messageType !== 'event') {
      return;
    }
    if (!msg.data.hasOwnProperty(this.event)) {
      return;
    }

    this.emit(Events.STATE_CHANGED, {on: true, value: Date.now()});
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.emit(Events.STATE_CHANGED, {on: false, value: Date.now()});
      this.timeout = null;
    }, 500);
  }

  stop() {
    clearTimeout(this.timeout);
    this.thingConn.stop();
  }
}

module.exports = EventTrigger;

