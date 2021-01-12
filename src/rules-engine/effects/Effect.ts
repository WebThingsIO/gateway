/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import {AddonManager} from '../../addon-manager';

export interface EffectDescription {
  type: any,
  label: string
}

/**
 * Effect - The outcome of a Rule once triggered
 */
export default class Effect {
  /**
   * Create an Effect based on a wire-format description with a property
   * @param {EffectDescription} effectDescription
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(_: AddonManager, private effectDescription: EffectDescription) {
  }

  getType(): string {
    return this.constructor.name;
  }

  getLabel(): string {
    return this.effectDescription.label;
  }

  /**
   * @return {EffectDescription}
   */
  toDescription(): any {
    return {
      type: this.getType(),
      label: this.getLabel(),
    };
  }

  /**
   * Set the state of Effect based on a trigger
   * @param {State} _state
   */
  setState(_state: any): void {
    throw new Error('Unimplemented');
  }
}
