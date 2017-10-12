/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const Events = require('../Events');
const Trigger = require('./Trigger');
const IfThisThenThatListener = require('./IfThisThenThatListener');

/**
 * Trigger whose input is an IFTTT webhook
 */
class IfThisThenThatTrigger extends Trigger {
  constructor() {
    super();
    this.onValueChanged = this.onValueChanged.bind(this);
    IfThisThenThatListener.on(Events.VALUE_CHANGED, this.onValueChanged);
  }

  onValueChanged(value) {
    this.emit(Events.STATE_CHANGED, {on: true, value: value});
    setTimeout(() => {
      this.emit(Events.STATE_CHANGED, {on: false, value: value});
    }, 1000);
  }

  stop() {
    IfThisThenThatListener.removeListener(Events.VALUE_CHANGED,
      this.onValueChanged);
  }
}

module.exports = IfThisThenThatTrigger;

