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

/* globals PowerDetail, OnOffDetail, OnOffSwitch, Thing, ThingDetailLayout */

/**
 * SmartPlug Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function SmartPlug(description, format) {
  if (format === 'htmlDetail') {
    this.details = this.details || {};
    this.details.on = new OnOffDetail(this);
    this.details.power = new PowerDetail(this);
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/smart-plug-off.svg',
                                  pngBaseIcon: '/images/smart-plug.svg',
                                  thingCssClass: 'smart-plug',
                                  addIconToView: false});
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  this.onPropertyUrl = new URL(this.propertyDescriptions.on.href, this.href);
  this.powerPropertyUrl = new URL(
    this.propertyDescriptions.instantaneousPower.href, this.href);
  this.smartPlug = this.element.querySelector('.smart-plug');
  this.smartPlugLabel =
    this.element.querySelector('.smart-plug-label');
  this.updateStatus();

  if (format === 'htmlDetail') {
    for (let prop in this.details) {
      this.details[prop].attach();
    }

    this.layout = new ThingDetailLayout(
      this.element.querySelectorAll('.thing-detail-container'));
  }
  return this;
}

SmartPlug.prototype = Object.create(OnOffSwitch.prototype);

SmartPlug.prototype.iconView = function() {
  return `<div class="thing-icon">
    <span class="smart-plug-label">...</span>
    </div>`;
};

/**
 * HTML view for smart plug.
 */
SmartPlug.prototype.htmlView = function() {
  return `<a href="${this.href}">
    <div class="thing smart-plug">
      ${this.iconView()}
      <span class="thing-name">${this.name}</span>
    </div>
  </a>`;
};

/**
 * HTML detail view for smart plug.
 */
SmartPlug.prototype.htmlDetailView = function() {
  let detailsHTML = '';
  for (let prop in this.details) {
    detailsHTML += this.details[prop].view();
  }

  return `<div class="smart-plug-container">
    <div class="thing">
      ${this.iconView()}
    </div>
    ${detailsHTML}
  </div>`;
};

/**
 * SVG view for smart plug.
 */
SmartPlug.prototype.svgView = function() {
  return '<g transform="translate(' + this.x + ',' + this.y + ')"' +
         '  dragx="' + this.x + '" dragy="' + this.y + '"' +
         '  class="floorplan-thing">' +
         '  <a href="' + this.href +'" class="svg-thing-link">' +
         '    <circle cx="0" cy="0" r="5" class="svg-thing-icon" />' +
         '    <image x="-2.5" y="-2.5" width="5" height="5" ' +
         '      xlink:href="/images/smart-plug-off.svg" />' +
         '    <text x="0" y="8" text-anchor="middle" class="svg-thing-text">' +
                this.name.substring(0, 7) +
         '    </text>' +
         '  </a>' +
         '</g>';
};

/**
 * Update the status of the smart plug.
 */
SmartPlug.prototype.updateStatus = function() {
  var opts = {
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`,
      'Accept': 'application/json'
    }
  };

  fetch(this.onPropertyUrl, opts).then(response => {
    return response.json();
  }).then(response => {
    this.onPropertyStatus(response);
    return fetch(this.powerPropertyUrl, opts);
  }).then(response => {
    return response.json();
  }).then(response => {
    this.onPropertyStatus(response);
  }).catch(error => {
    console.error('Error fetching smart plug status ' + error);
  });
};

/**
 * Handle a 'propertyStatus' message.
 * @param {Object} properties - property data
 */
SmartPlug.prototype.onPropertyStatus = function(data) {
  if (data.hasOwnProperty('on')) {
    this.updateOn(data.on);
  }
  if (data.hasOwnProperty('instantaneousPower')) {
    this.updatePower(data.instantaneousPower);
  }
};

SmartPlug.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }

  if (this.details) {
    this.details.on.update();
  }

  if (on) {
    this.showOn();
    this.updatePower();
  } else {
    this.showOff();
    this.smartPlugLabel.innerText = 'off';
  }
};

/**
 * Show updated power consumption value.
 */
SmartPlug.prototype.updatePower = function(power) {
  this.properties.power = power;
  if (!this.properties.on) {
    this.smartPlugLabel.innerText = 'off';
  } else if (power) {
    this.smartPlugLabel.innerText = power + 'W';
  } else {
    this.smartPlugLabel.innerText = '0W';
  }
  if (this.details) {
    this.details.power.update();
  }
};
