/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import assert from 'assert';
import * as Events from '../Events';
import PropertyTrigger, {PropertyTriggerDescription} from './PropertyTrigger';

export interface LevelTriggerDescription extends PropertyTriggerDescription {
  value: number;
  levelType: string;
}

/**
 * A trigger which activates when a numerical property is less or greater than
 * a given level
 */
export default class LevelTrigger extends PropertyTrigger {
  static types: Record<string, string> = {
    LESS: 'LESS',
    EQUAL: 'EQUAL',
    GREATER: 'GREATER',
  };

  private value: number;

  private levelType: string;

  /**
   * @param {TriggerDescription} desc
   */
  constructor(desc: LevelTriggerDescription) {
    super(desc);
    assert(this.property.type === 'number' || this.property.type === 'integer');
    assert(typeof desc.value === 'number');
    assert(LevelTrigger.types[desc.levelType]);
    if (desc.levelType === 'EQUAL') {
      assert(this.property.type === 'integer');
    }

    this.value = desc.value;
    this.levelType = desc.levelType;
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription(): LevelTriggerDescription {
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
  onValueChanged(propValue: number): void {
    let on = false;

    switch (this.levelType) {
      case LevelTrigger.types.LESS:
        if (propValue < this.value) {
          on = true;
        }
        break;
      case LevelTrigger.types.EQUAL:
        if (propValue === this.value) {
          on = true;
        }
        break;
      case LevelTrigger.types.GREATER:
        if (propValue > this.value) {
          on = true;
        }
        break;
    }

    this.emit(Events.STATE_CHANGED, {on: on, value: propValue});
  }
}
