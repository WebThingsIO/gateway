/**
 * On/Off Switch.
 *
 * UI element representing an On/Off Switch.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const Thing = require('./thing');

class OnOffSwitch extends Thing {
  /**
   * OnOffSwitch Constructor (extends Thing).
   *
   * @param {Object} description Thing description object.
   * @param {String} format 'svg', 'html', or 'htmlDetail'.
   * @param {Object} options Options for building the view.
   */
  constructor(description, format, options) {
    options = options ||
      {
        baseIcon: '/optimized-images/thing-icons/on_off_switch.svg',
      };

    super(description, format, options);

    if (this.format !== 'svg') {
      this.icon.addEventListener('click', this.handleClick.bind(this));
    }
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.onProperty = null;

    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'BooleanProperty' || name === 'on') {
        this.onProperty = name;
        break;
      }
    }
  }

  get icon() {
    return this.element.querySelector('webthing-on-off-switch-capability');
  }

  /**
   * Update the display for the provided property.
   * @param {string} name - name of the property
   * @param {*} value - value of the property
   */
  updateProperty(name, value) {
    super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    if (name === this.onProperty) {
      this.icon.on = !!value;
    }
  }

  /**
   * Handle a click on the on/off switch.
   */
  handleClick() {
    const newValue = !this.properties[this.onProperty];
    this.icon.on = null;
    this.properties[this.onProperty] = null;
    const payload = {
      on: newValue,
    };
    fetch(this.displayedProperties[this.onProperty].href, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new Error(`Status ${response.status} trying to toggle switch`);
      }
    }).then((json) => {
      this.onPropertyStatus(json);
    }).catch((error) => {
      console.error(`Error trying to toggle switch: ${error}`);
    });
  }

  iconView() {
    return `
      <webthing-on-off-switch-capability>
      </webthing-on-off-switch-capability>`;
  }
}

module.exports = OnOffSwitch;
