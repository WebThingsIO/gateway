/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import assert from 'assert';
import {AddonManager} from '../../addon-manager';
import PropertyEffect, {PropertyEffectDescription} from './PropertyEffect';

export interface SetEffectDescription extends PropertyEffectDescription {
  value: any
}
/**
 * An Effect which permanently sets the target property to
 * a value when triggered
 */
export default class SetEffect extends PropertyEffect {
  protected on = false;

  /**
   * @param {EffectDescription} desc
   */
  constructor(addonManager: AddonManager, private setEffectDescription: SetEffectDescription) {
    super(addonManager, setEffectDescription);
    const {
      value,
    } = setEffectDescription;

    if (typeof value === 'number') {
      assert(this.property.getType() === 'number' ||
             this.property.getType() === 'integer',
             'setpoint and property must be compatible types');
    } else {
      assert(typeof value === this.property.getType(),
             'setpoint and property must be same type');
    }
  }

  /**
   * @return {SetEffectDescription}
   */
  toDescription(): SetEffectDescription {
    return {
      ...super.toDescription(),
      ...{value: this.setEffectDescription.value},
    };
  }

  /**
   * @return {State}
   */
  setState(state: any): Promise<any> | undefined {
    const {
      value,
    } = this.setEffectDescription;

    if (!this.on && state.on) {
      this.on = true;
      return this.property.set(value);
    }
    if (this.on && !state.on) {
      this.on = false;
      return Promise.resolve();
    }

    // eslint-disable-next-line no-useless-return
    return;
  }
}
