/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const assert = require('assert');
const Action = require('./Action');

/**
 * An Action which temporarily sets the target property to
 * a value before restoring its original value
 */
class PulseAction extends Action {
  /**
   * @param {ActionDescription} desc
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
   * @return {ActionDescription}
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
    if (!this.on && state.on) {
      this.property.get().then(value => {
        this.oldValue = value;
        this.on = true;
        return this.property.set(this.value);
      });
    }
    if (this.on && !state.on) {
      this.on = false;
      return this.property.set(this.oldValue);
    }
  }
}

module.exports = PulseAction;
