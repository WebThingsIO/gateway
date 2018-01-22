/**
 * On/Off Light.
 *
 * UI element representing an On/Off Light.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/* globals OnOffSwitch, Thing */

/**
 * OnOffLight Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function OnOffLight(description, format) {
  this.base = Thing;
  this.base(description, format);
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  // Parse on property URL
  if (this.propertyDescriptions.on.href) {
    this.onPropertyUrl = new URL(this.propertyDescriptions.on.href, this.href);
  }
  this.updateStatus();
  this.element.addEventListener('click', this.handleClick.bind(this));
  return this;
}

OnOffLight.prototype = Object.create(OnOffSwitch.prototype);

/**
 * HTML view for On/Off Light
 */
OnOffLight.prototype.htmlView = function() {
  return `<div class="thing on-off-light">
    <div class="thing-icon"></div>
    <span class="thing-name">${this.name}</span>
  </div>`;
}

/**
 * SVG view for On/Off Light
 */
OnOffLight.prototype.svgView = function() {
  return '<g transform="translate(' + this.x + ',' + this.y + ')"' +
         '  dragx="' + this.x + '" dragy="' + this.y + '"' +
         '  class="floorplan-thing">' +
         '  <a href="' + this.href +'" class="svg-thing-link">' +
         '    <circle cx="0" cy="0" r="5" class="svg-thing-icon" />' +
         '    <image x="-2.5" y="-2.5" width="5" height="5" ' +
         '      xlink:href="/images/bulb.svg" />' +
         '    <text x="0" y="8" text-anchor="middle" class="svg-thing-text">' +
                this.name.substring(0, 7) +
         '    </text>' +
         '  </a>' +
         '</g>';
};
