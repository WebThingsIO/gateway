/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Events = require('../Events');
const PropertyTrigger = require('./PropertyTrigger');

/**
 * A trigger which activates when a property is equal to a given value
 */
class EqualityTrigger extends PropertyTrigger {
  /**
   * @param {TriggerDescription} desc
   */
  constructor(desc) {
    super(desc);

    this.value = desc.value;
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {
        value: this.value,
      }
    );
  }

  /**
   * @param {number} propValue
   * @return {State}
   */
  onValueChanged(propValue) {
    const on = propValue === this.value;

    this.emit(Events.STATE_CHANGED, {on: on, value: propValue});
  }
}

module.exports = EqualityTrigger;
