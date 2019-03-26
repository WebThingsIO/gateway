/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const assert = require('assert');
const PropertyEffect = require('./PropertyEffect');

/**
 * An Effect which permanently sets the target property to
 * a value when triggered
 */
class SetEffect extends PropertyEffect {
  /**
   * @param {EffectDescription} desc
   */
  constructor(desc) {
    super(desc);
    this.value = desc.value;
    assert(typeof this.value === this.property.type,
           'setpoint and property must be same type');
    this.on = false;
  }

  /**
   * @return {EffectDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {value: this.value}
    );
  }

  /**
   * @return {State}
   */
  setState(state) {
    if (!this.on && state.on) {
      this.on = true;
      return this.property.set(this.value);
    }
    if (this.on && !state.on) {
      this.on = false;
      return Promise.resolve();
    }
  }
}

module.exports = SetEffect;
