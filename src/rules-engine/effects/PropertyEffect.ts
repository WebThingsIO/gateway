/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import {AddonManager} from '../../addon-manager';
import Property, {PropertyDescription} from '../Property';
import Effect, {EffectDescription} from './Effect';

export interface PropertyEffectDescription extends EffectDescription {
  property: PropertyDescription
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
  constructor(addonManager: AddonManager,
              propertyEffectDescription: PropertyEffectDescription) {
    super(addonManager, propertyEffectDescription);
    this.property = new Property(addonManager, propertyEffectDescription.property);
  }

  /**
   * @return {EffectDescription}
   */
  toDescription(): PropertyEffectDescription {
    return {...super.toDescription(),
            ...{property: this.property.toDescription()}};
  }
}
