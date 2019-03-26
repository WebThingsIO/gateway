/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Effect = require('./Effect');

/**
 * MultiEffect - The outcome of a Rule involving multiple effects
 */
class MultiEffect extends Effect {
  /**
   * @param {MultiEffectDescription} desc
   */
  constructor(desc) {
    super(desc);
    const fromDescription = require('./index').fromDescription;

    this.effects = desc.effects.map(function(effect) {
      return fromDescription(effect);
    });
  }

  /**
   * @return {EffectDescription}
   */
  toDescription() {
    return Object.assign(super.toDescription(), {
      effects: this.effects.map((effect) => effect.toDescription()),
    });
  }

  /**
   * @param {State} state
   */
  setState(state) {
    for (const effect of this.effects) {
      effect.setState(state);
    }
  }
}

module.exports = MultiEffect;

