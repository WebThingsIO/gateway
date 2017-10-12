/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const Effect = require('./Effect');
const Property = require('../Property');

/**
 * PropertyEffect - Modify a property when a rule is triggered
 */
class PropertyEffect extends Effect {
  /**
   * Create an Effect based on a wire-format description
   * @param {EffectDescription} desc
   */
  constructor(desc) {
    super();
    if (!desc.property) {
      throw new Error('Missing effect property');
    }
    this.property = new Property(desc.property);
  }

  /**
   * @return {EffectDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {property: this.property.toDescription()}
    );
  }
}

module.exports = PropertyEffect;

