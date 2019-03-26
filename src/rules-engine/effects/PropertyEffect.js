/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Property = require('../Property');
const Effect = require('./Effect');

/**
 * PropertyEffect - The outcome of a Rule involving a property
 */
class PropertyEffect extends Effect {
  /**
   * Create an Effect based on a wire-format description with a property
   * @param {PropertyEffectDescription} desc
   */
  constructor(desc) {
    super(desc);
    this.property = new Property(desc.property);
  }

  /**
   * @return {EffectDescription}
   */
  toDescription() {
    return Object.assign(super.toDescription(), {
      property: this.property.toDescription(),
    });
  }
}

module.exports = PropertyEffect;
