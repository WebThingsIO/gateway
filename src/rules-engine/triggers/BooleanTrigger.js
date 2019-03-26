/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const assert = require('assert');
const Events = require('../Events');
const PropertyTrigger = require('./PropertyTrigger');

/**
 * A Trigger which activates when a boolean property is
 * equal to a given value, `onValue`
 */
class BooleanTrigger extends PropertyTrigger {
  /**
   * @param {TriggerDescription} desc
   */
  constructor(desc) {
    super(desc);
    assert(this.property.type === 'boolean');
    assert(typeof desc.onValue === 'boolean');
    this.onValue = desc.onValue;
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {onValue: this.onValue}
    );
  }

  /**
   * @param {boolean} propValue
   * @return {State}
   */
  onValueChanged(propValue) {
    if (propValue === this.onValue) {
      this.emit(Events.STATE_CHANGED, {on: true, value: propValue});
    } else {
      this.emit(Events.STATE_CHANGED, {on: false, value: propValue});
    }
  }
}

module.exports = BooleanTrigger;
