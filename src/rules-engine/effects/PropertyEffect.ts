/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Property, { PropertyDescription } from '../Property';
import Effect, { EffectDescription } from './Effect';

export interface PropertyEffectDescription extends EffectDescription {
  property: PropertyDescription;
}
/**
 * PropertyEffect - The outcome of a Rule involving a property
 */
export default class PropertyEffect extends Effect {
  protected property: Property;

  /**
   * Create an Effect based on a wire-format description with a property
   * @param {PropertyEffectDescription} desc
   */
  constructor(desc: PropertyEffectDescription) {
    super(desc);
    this.property = new Property(desc.property);
  }

  /**
   * @return {EffectDescription}
   */
  toDescription(): PropertyEffectDescription {
    return Object.assign(super.toDescription(), {
      property: this.property.toDescription(),
    });
  }
}
