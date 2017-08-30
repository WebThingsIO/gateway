/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const assert = require('assert');
const Events = require('../Events');
const PropertyTrigger = require('./PropertyTrigger');

const LevelTriggerTypes = {
  LESS: 'LESS',
  GREATER: 'GREATER'
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
    assert(this.property.type === 'number');
    assert(typeof desc.level === 'number');
    assert(LevelTriggerTypes[desc.levelType]);

    this.level = desc.level;
    this.levelType = desc.levelType;
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {
        level: this.level,
        levelType: this.levelType
      }
    );
  }

  /**
   * @param {number} propValue
   * @return {State}
   */
  onValueChanged(propValue) {
    let on = false;

    switch (this.type) {
      case LevelTriggerTypes.LESS:
        if (propValue < this.level) {
          on = true;
        }
        break;
      case LevelTriggerTypes.GREATER:
        if (propValue > this.level) {
          on = true;
        }
        break;
    }

    this.emit(Events.STATE_CHANGED, {on: on, value: propValue});
  }
}

LevelTrigger.types = LevelTriggerTypes;

module.exports = LevelTrigger;
