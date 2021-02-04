/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import assert from 'assert';
import PropertyEffect from './PropertyEffect';
import { SetEffectDescription } from './SetEffect';
import { PropertyValue } from 'gateway-addon/lib/schema';
import { State } from '../State';

export type PulseEffectDescription = SetEffectDescription;

/**
 * An Effect which temporarily sets the target property to
 * a value before restoring its original value
 */
export default class PulseEffect extends PropertyEffect {
  private value: PropertyValue;

  private on: boolean;

  private oldValue: PropertyValue;

  /**
   * @param {EffectDescription} desc
   */
  constructor(desc: PulseEffectDescription) {
    super(desc);
    this.value = desc.value;
    if (typeof this.value === 'number') {
      assert(
        this.property.getType() === 'number' || this.property.getType() === 'integer',
        'setpoint and property must be compatible types'
      );
    } else {
      assert(
        typeof this.value === this.property.getType(),
        'setpoint and property must be same type'
      );
    }

    this.on = false;
    this.oldValue = null;
  }

  /**
   * @return {EffectDescription}
   */
  toDescription(): PulseEffectDescription {
    return Object.assign(super.toDescription(), { value: this.value });
  }

  /**
   * @param {State} state
   */
  setState(state: State): Promise<PropertyValue> {
    if (state.on) {
      // If we're already active, just perform the effect again
      if (this.on) {
        return this.property.set(this.value);
      }

      // Activate the effect and save our current state to revert to upon
      // deactivation
      this.property.get().then((value) => {
        this.oldValue = value;

        // Always set to the opposite (always toggle)
        if (typeof value === 'boolean') {
          this.oldValue = !this.value;
        }

        this.on = true;
        return this.property.set(this.value);
      });
    } else if (this.on) {
      // Revert to our original value if we pulsed to a new value
      this.on = false;
      if (this.oldValue !== null) {
        return this.property.set(this.oldValue);
      }
    }

    return Promise.resolve(null);
  }
}
