/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {EventEmitter} from 'events';

export interface TriggerDescription {
  type: string;
  label?: string;
}

/**
 * The trigger component of a Rule which monitors some state and passes on
 * whether to be active to the Rule's effect
 */
export default class Trigger extends EventEmitter {
  private type: string;

  private label?: string;

  /**
   * Create a Trigger based on a wire-format description with a property
   * @param {TriggerDescription} desc
   */
  constructor(desc: TriggerDescription) {
    super();
    this.type = this.constructor.name;
    this.label = desc.label;
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription(): TriggerDescription {
    return {
      type: this.type,
      label: this.label,
    };
  }

  async start(): Promise<void> {
    // to be overridden
  }

  stop(): void {
    // to be overridden
  }
}
