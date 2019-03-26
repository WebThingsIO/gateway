/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const assert = require('assert');
const Events = require('../Events');
const PropertyTrigger = require('./PropertyTrigger');

const LevelTriggerTypes = {
  LESS: 'LESS',
  EQUAL: 'EQUAL',
  GREATER: 'GREATER',
};

/**
 * A trigger which activates when a numerical property is less or greater than
 * a given level
 */
class LevelTrigger extends PropertyTrigger {
  /**
   * @param {TriggerDescription} desc
   */
  constructor(desc) {
    super(desc);
    assert(this.property.type === 'number' || this.property.type === 'integer');
    assert(typeof desc.value === 'number');
    assert(LevelTriggerTypes[desc.levelType]);
    if (desc.levelType === 'EQUAL') {
      assert(this.property.type === 'integer');
    }

    this.value = desc.value;
    this.levelType = desc.levelType;
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {
        value: this.value,
        levelType: this.levelType,
      }
    );
  }

  /**
   * @param {number} propValue
   * @return {State}
   */
  onValueChanged(propValue) {
    let on = false;

    switch (this.levelType) {
      case LevelTriggerTypes.LESS:
        if (propValue < this.value) {
          on = true;
        }
        break;
      case LevelTriggerTypes.EQUAL:
        if (propValue === this.value) {
          on = true;
        }
        break;
      case LevelTriggerTypes.GREATER:
        if (propValue > this.value) {
          on = true;
        }
        break;
    }

    this.emit(Events.STATE_CHANGED, {on: on, value: propValue});
  }
}

LevelTrigger.types = LevelTriggerTypes;

module.exports = LevelTrigger;
