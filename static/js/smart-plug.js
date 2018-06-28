/**
 * Smart Plug.
 *
 * UI element representing a smart plug with an on/off switch and
 * energy monitoring functionality.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const OnOffSwitch = require('./on-off-switch');

class SmartPlug extends OnOffSwitch {
  /**
   * SmartPlug Constructor (extends OnOffSwitch).
   *
   * @param {Object} description Thing description object.
   * @param {String} format 'svg', 'html', or 'htmlDetail'.
   */
  constructor(description, format) {
    super(
      description,
      format,
      {
        svgBaseIcon: '/images/smart-plug-off.svg',
        pngBaseIcon: '/images/smart-plug.svg',
      }
    );
  }

  get icon() {
    return this.element.querySelector('webthing-smart-plug-capability');
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

    const property = this.displayedProperties[name].property;
    if (property['@type'] === 'OnOffProperty' || name === 'on') {
      this.icon.on = !!value;
    } else if (property['@type'] === 'InstantaneousPowerProperty' ||
               name === 'instantaneousPower') {
      value = parseFloat(value);
      this.icon.power = value;
    }
  }

  iconView() {
    return `
      <webthing-smart-plug-capability>
      </webthing-smart-plug-capability>`;
  }
}

module.exports = SmartPlug;
