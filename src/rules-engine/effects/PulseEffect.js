/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const assert = require('assert');
const PropertyEffect = require('./PropertyEffect');

/**
 * An Effect which temporarily sets the target property to
 * a value before restoring its original value
 */
class PulseEffect extends PropertyEffect {
  /**
   * @param {EffectDescription} desc
   */
  constructor(desc) {
    super(desc);
    this.value = desc.value;
    assert(typeof this.value === this.property.type,
           'setpoint and property must be same type');
    this.on = false;
    this.oldValue = null;
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
   * @param {State} state
   */
  setState(state) {
    if (state.on) {
      // If we're already active, just perform the effect again
      if (this.on) {
        return this.property.set(this.value);
      }
      // Activate the effect and save our current state to revert to upon
      // deactivation
      this.property.get().then((value) => {
        if (value !== this.value) {
          this.oldValue = value;
        } else {
          this.oldValue = null;
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
  }
}

module.exports = PulseEffect;
