/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const Property = require('../Property');

/**
 * Action - The outcome of a Rule once triggered
 */
class Action {
  /**
   * Create an Action based on a wire-format description
   * @param {ActionDescription} desc
   */
  constructor(desc) {
    this.type = this.constructor.name;
    this.property = new Property(desc.property);
  }

  /**
   * @return {ActionDescription}
   */
  toDescription() {
    return {
      type: this.type,
      property: this.property.toDescription()
    };
  }

  /**
   * Set the state of Action based on a trigger
   * @param {State} _state
   */
  setState(_state) {
    throw new Error('Unimplemented');
  }
}

module.exports = Action;
