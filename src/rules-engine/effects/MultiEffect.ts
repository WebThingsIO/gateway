/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import {fromDescription} from '.';
import {AddonManager} from '../../addon-manager';
import Effect, {EffectDescription} from './Effect';

interface MultiEffectDescription extends EffectDescription {
  effects: EffectDescription[]
}

/**
 * MultiEffect - The outcome of a Rule involving multiple effects
 */
export default class MultiEffect extends Effect {
  private effects: Effect[];

  /**
   * @param {MultiEffectDescription} desc
   */
  constructor(addonManager: AddonManager, multiEffectDescription: MultiEffectDescription) {
    super(addonManager, multiEffectDescription);
    this.effects = multiEffectDescription.effects
      .map((effect) => fromDescription(addonManager, effect));
  }

  /**
   * @return {MultiEffectDescription}
   */
  toDescription(): MultiEffectDescription {
    return {
      ...super.toDescription(),
      ...{effects: this.effects.map((effect) => effect.toDescription())},
    };
  }

  /**
   * @param {State} state
   */
  setState(state: any): void {
    for (const effect of this.effects) {
      effect.setState(state);
    }
  }
}
