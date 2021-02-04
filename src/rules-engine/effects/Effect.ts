/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { State } from '../State';

export interface EffectDescription {
  type: string;
  label?: string;
}

/**
 * Effect - The outcome of a Rule once triggered
 */
export default class Effect {
  private type: string;

  private label?: string;

  /**
   * Create an Effect based on a wire-format description with a property
   * @param {EffectDescription} desc
   */
  constructor(desc: EffectDescription) {
    this.type = this.constructor.name;
    this.label = desc.label;
  }

  /**
   * @return {EffectDescription}
   */
  toDescription(): EffectDescription {
    return {
      type: this.type,
      label: this.label,
    };
  }

  /**
   * Set the state of Effect based on a trigger
   * @param {State} _state
   */
  setState(_state: State): void {
    throw new Error('Unimplemented');
  }
}
