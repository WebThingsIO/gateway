/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import {AddonManager} from '../../addon-manager';
import PropertyEffect from './PropertyEffect';
import {SetEffectDescription} from './SetEffect';

type PulseEffectDescription = SetEffectDescription;
/**
 * An Effect which temporarily sets the target property to
 * a value before restoring its original value
 */
export default class PulseEffect extends PropertyEffect {
  private on = false;

  private oldValue: any = null;

  /**
   * @param {EffectDescription} desc
   */
  constructor(addonManager: AddonManager, private pulseEffectDescription: PulseEffectDescription) {
    super(addonManager, pulseEffectDescription);
  }

  /**
   * @return {PulseEffectDescription}
   */
  toDescription(): PulseEffectDescription {
    return {
      ...super.toDescription(),
      ...{value: this.pulseEffectDescription.value},
    };
  }

  /**
   * @param {State} state
   */
  setState(state: any): Promise<any> | undefined {
    const {
      value,
    } = this.pulseEffectDescription;

    if (state.on) {
      // If we're already active, just perform the effect again
      if (this.on) {
        return this.property.set(value);
      }
      // Activate the effect and save our current state to revert to upon
      // deactivation
      this.property.get().then((value) => {
        this.oldValue = value;
        // Always set to the opposite (always toggle)
        if (typeof value === 'boolean') {
          this.oldValue = !value;
        }
        this.on = true;
        return this.property.set(value);
      });
    } else if (this.on) {
      // Revert to our original value if we pulsed to a new value
      this.on = false;
      if (this.oldValue !== null) {
        return this.property.set(this.oldValue);
      }
    }

    // eslint-disable-next-line no-useless-return
    return;
  }
}
