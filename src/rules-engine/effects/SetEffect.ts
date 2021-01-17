/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import assert from 'assert';
import PropertyEffect, {PropertyEffectDescription} from './PropertyEffect';
import {PropertyValue} from 'gateway-addon/lib/schema';

export interface SetEffectDescription extends PropertyEffectDescription {
  value: PropertyValue;
}

/**
 * An Effect which permanently sets the target property to
 * a value when triggered
 */
export default class SetEffect extends PropertyEffect {
  private value: PropertyValue;

  private on = false;

  /**
   * @param {EffectDescription} desc
   */
  constructor(desc: SetEffectDescription) {
    super(desc);
    this.value = desc.value;
    if (typeof this.value === 'number') {
      assert(this.property.getType() === 'number' ||
             this.property.getType() === 'integer',
             'setpoint and property must be compatible types');
    } else {
      assert(typeof this.value === this.property.getType(),
             'setpoint and property must be same type');
    }
  }

  /**
   * @return {EffectDescription}
   */
  toDescription(): SetEffectDescription {
    return Object.assign(
      super.toDescription(),
      {value: this.value}
    );
  }

  /**
   * @return {State}
   */
  setState(state: any): Promise<any> | undefined {
    if (!this.on && state.on) {
      this.on = true;
      return this.property.set(this.value);
    }
    if (this.on && !state.on) {
      this.on = false;
      return Promise.resolve();
    }

    // eslint-disable-next-line no-useless-return
    return;
  }
}
