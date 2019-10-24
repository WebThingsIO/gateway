/**
 * Push Button.
 *
 * UI element representing a Push Button.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');

class PushButton extends Thing {
  /**
   * PushButton Constructor (extends Thing).
   *
   * @param {Object} description Thing description object.
   * @param {Number} format See Constants.ThingFormat
   */
  constructor(model, description, format) {
    super(
      model,
      description,
      format,
      {
        baseIcon: '/optimized-images/thing-icons/push_button.svg',
      }
    );

    this.pressedEventName = null;
    this.doublePressedEventName = null;
    this.longPressedEventName = null;

    if (description.events) {
      for (const name in description.events) {
        switch (description.events[name]['@type']) {
          case 'PressedEvent':
            if (this.pressedEventName === null) {
              this.pressedEventName = name;
            }
            break;
          case 'DoublePressedEvent':
            if (this.doublePressedEventName === null) {
              this.doublePressedEventName = name;
            }
            break;
          case 'LongPressedEvent':
            if (this.longPressedEventName === null) {
              this.longPressedEventName = name;
            }
            break;
        }
      }
    }

    // findProperties gets called as part of super(), so this.pushedProperty
    // will already be defined at this point.
    if (!this.pushedProperty) {
      this.icon.pushed = false;
    }
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.pushedProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'PushedProperty') {
        this.pushedProperty = name;
        break;
      }
    }
  }

  get icon() {
    return this.element.querySelector('webthing-push-button-capability');
  }

  /**
   * Update the display for the provided property.
   * @param {string} name - name of the property
   * @param {*} value - value of the property
   */
  updateProperty(name, value) {
    value = super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    if (name === this.pushedProperty) {
      this.icon.pushed = !!value;
    }
  }

  /**
   * Handle an 'event' message.
   *
   * @param {Object} data - Event data
   */
  onEvent(data) {
    super.onEvent(data);

    if (!this.pushedProperty) {
      for (const name in data) {
        if (name === this.pressedEventName) {
          this.icon.dispatchEvent(new CustomEvent('press', {detail: 'single'}));
        } else if (name === this.doublePressedEventName) {
          this.icon.dispatchEvent(new CustomEvent('press', {detail: 'double'}));
        } else if (name === this.longPressedEventName) {
          this.icon.dispatchEvent(new CustomEvent('press', {detail: 'long'}));
        }
      }
    }
  }

  iconView() {
    return `
      <webthing-push-button-capability>
      </webthing-push-button-capability>`;
  }
}

module.exports = PushButton;
