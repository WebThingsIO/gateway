/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Events from '../Events';
import PropertyTrigger, { PropertyTriggerDescription } from './PropertyTrigger';

export interface EqualityTriggerDescription extends PropertyTriggerDescription {
  value: number;
}

/**
 * A trigger which activates when a property is equal to a given value
 */
export default class EqualityTrigger extends PropertyTrigger {
  private value: number;

  /**
   * @param {TriggerDescription} desc
   */
  constructor(desc: EqualityTriggerDescription) {
    super(desc);

    this.value = desc.value;
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription(): EqualityTriggerDescription {
    return Object.assign(super.toDescription(), {
      value: this.value,
    });
  }

  /**
   * @param {number} propValue
   * @return {State}
   */
  onValueChanged(propValue: number): void {
    const on = propValue === this.value;

    this.emit(Events.STATE_CHANGED, { on: on, value: propValue });
  }
}
