/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Events = require('../Events');
const Trigger = require('./Trigger');
const Property = require('../Property');

/**
 * An abstract class for triggers whose input is a single property
 */
class PropertyTrigger extends Trigger {
  constructor(desc) {
    super(desc);
    this.property = new Property(desc.property);
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {property: this.property.toDescription()}
    );
  }

  async start() {
    this.property.on(Events.VALUE_CHANGED, this.onValueChanged);
    await this.property.start();
  }

  onValueChanged(_value) {
  }

  stop() {
    this.property.removeListener(Events.VALUE_CHANGED, this.onValueChanged);
    this.property.stop();
  }
}

module.exports = PropertyTrigger;
