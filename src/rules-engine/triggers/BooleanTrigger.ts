/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import assert from 'assert';
import * as Events from '../Events';
import PropertyTrigger, { PropertyTriggerDescription } from './PropertyTrigger';

export interface BooleanTriggerDescription extends PropertyTriggerDescription {
  onValue: boolean;
}

/**
 * A Trigger which activates when a boolean property is
 * equal to a given value, `onValue`
 */
export default class BooleanTrigger extends PropertyTrigger {
  private onValue: boolean;

  /**
   * @param {TriggerDescription} desc
   */
  constructor(desc: BooleanTriggerDescription) {
    super(desc);
    assert(this.property.getType() === 'boolean');
    assert(typeof desc.onValue === 'boolean');
    this.onValue = desc.onValue;
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription(): BooleanTriggerDescription {
    return Object.assign(super.toDescription(), { onValue: this.onValue });
  }

  /**
   * @param {boolean} propValue
   * @return {State}
   */
  onValueChanged(propValue: boolean): void {
    if (propValue === this.onValue) {
      this.emit(Events.STATE_CHANGED, { on: true, value: propValue });
    } else {
      this.emit(Events.STATE_CHANGED, { on: false, value: propValue });
    }
  }
}
