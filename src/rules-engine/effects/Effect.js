/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

/**
 * Effect - The outcome of a Rule once triggered
 */
class Effect {
  /**
   * Create an Effect based on a wire-format description
   * @param {EffectDescription} _desc
   */
  constructor(_desc) {
    this.type = this.constructor.name;
  }

  /**
   * @return {EffectDescription}
   */
  toDescription() {
    return {
      type: this.type
    };
  }

  /**
   * Set the state of Effect based on a trigger
   * @param {State} _state
   */
  setState(_state) {
    throw new Error('Unimplemented');
  }
}

module.exports = Effect;
