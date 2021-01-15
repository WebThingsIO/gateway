/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Events from '../Events';
import Trigger, {TriggerDescription} from './Trigger';

const Property = require('../Property');

export interface PropertyTriggerDescription extends TriggerDescription {
  property: any;
}

/**
 * An abstract class for triggers whose input is a single property
 */
export default class PropertyTrigger extends Trigger {
  protected property: any;

  private _onValueChanged: (value: any) => void;

  constructor(desc: PropertyTriggerDescription) {
    super(desc);
    this.property = new Property(desc.property);
    this._onValueChanged = this.onValueChanged.bind(this);
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription(): PropertyTriggerDescription {
    return Object.assign(
      super.toDescription(),
      {property: this.property.toDescription()}
    );
  }

  async start(): Promise<void> {
    this.property.on(Events.VALUE_CHANGED, this._onValueChanged);
    await this.property.start();
  }

  onValueChanged(_value: any): void {
    // to be overridden
  }

  stop(): void {
    this.property.removeListener(Events.VALUE_CHANGED, this._onValueChanged);
    this.property.stop();
  }
}
