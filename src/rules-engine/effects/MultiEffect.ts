/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {fromDescription} from './index';
import Effect, {EffectDescription} from './Effect';
import {State} from '../State';

export interface MultiEffectDescription extends EffectDescription {
  effects: EffectDescription[];
}

/**
 * MultiEffect - The outcome of a Rule involving multiple effects
 */
export default class MultiEffect extends Effect {
  private effects: Effect[];

  /**
   * @param {MultiEffectDescription} desc
   */
  constructor(desc: MultiEffectDescription) {
    super(desc);

    this.effects = desc.effects.map(function(effect) {
      return fromDescription(effect);
    });
  }

  /**
   * @return {EffectDescription}
   */
  toDescription(): MultiEffectDescription {
    return Object.assign(super.toDescription(), {
      effects: this.effects.map((effect) => effect.toDescription()),
    });
  }

  /**
   * @param {State} state
   */
  setState(state: State): void {
    for (const effect of this.effects) {
      effect.setState(state);
    }
  }
}
