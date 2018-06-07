/**
 * Dimmable Light
 *
 * UI element representing a light with an independent dimming function.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const BrightnessDetail = require('./brightness-detail');
const OnOffLight = require('./on-off-light');

/**
 * DimmableLight Constructor.
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function DimmableLight(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.level = {
      href: description.properties.level.href,
      detail: new BrightnessDetail(this, 'level'),
    };
  }

  this.base = OnOffLight;
  this.base(description, format);

  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.levelBar = this.element.querySelector('.level-bar');
  this.levelBarLabel = this.element.querySelector('.level-bar-label');
  this.light = this.element.querySelector('.dimmable-light');

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  } else if (this.light) {
    this.light.addEventListener('click', this.handleClick.bind(this));
  }

  return this;
}

DimmableLight.prototype = Object.create(OnOffLight.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
DimmableLight.prototype.updateProperty = function(name, value) {
  if (name === 'on') {
    this.updateOn(value);
    if (this.properties.on) {
      this.light.classList.add('on');
      this.levelBarLabel.textContent = `${Math.round(this.properties.level)}%`;
    } else {
      this.light.classList.remove('on');
    }
  }
  if (name === 'level') {
    this.updateLevel(value);
  }
};

DimmableLight.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }

  this.updateLevel(this.properties.level);

  if (!on) {
    this.levelBarLabel.textContent = 'OFF';
  }

  if (this.format === 'htmlDetail') {
    this.displayedProperties.on.detail.update();
  }

  if (on) {
    this.showOn();
  } else {
    this.showOff();
  }
};

/**
 * @param {number} level
 */
DimmableLight.prototype.updateLevel = function(level) {
  this.properties.level = level;
  if (this.properties.on) {
    this.levelBarLabel.textContent = `${Math.round(level)}%`;
  }

  if (this.format === 'htmlDetail') {
    this.displayedProperties.level.detail.update();
  }
};

DimmableLight.prototype.setBrightness = function(level) {
  if (typeof level === 'string') {
    level = parseInt(level, 10);
  }

  const payload = {
    level: level,
  };
  fetch(this.displayedProperties.level.href, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: Object.assign(API.headers(), {
      'Content-Type': 'application/json',
    }),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(`Status ${response.status} trying to set level`);
    }
  }).then((json) => {
    this.updateLevel(json.level);
  }).catch(function(error) {
    console.error(`Error trying to set level: ${error}`);
  });
};

DimmableLight.prototype.iconView = function() {
  return `<div class="dimmable-light level-bar-container">
    <div class="dimmable-light-icon">
      <svg
         xmlns:dc="http://purl.org/dc/elements/1.1/"
         xmlns:cc="http://creativecommons.org/ns#"
         xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:svg="http://www.w3.org/2000/svg"
         xmlns="http://www.w3.org/2000/svg"
         version="1.1"
         viewBox="0 0 64 64"
         height="64"
         width="64">
        <defs
           id="defs16980" />
        <metadata
           id="metadata16983">
          <rdf:RDF>
            <cc:Work
               rdf:about="">
              <dc:format>image/svg+xml</dc:format>
              <dc:type
                 rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
              <dc:title></dc:title>
            </cc:Work>
          </rdf:RDF>
        </metadata>
        <g transform="translate(0,-988.36216)">
          <path
             d="m 41.6997,1041.6985 c 0,1.0723 -0.8727,1.9367 -1.9366,1.9367 l
             -15.5179,0 c -1.0722,0 -1.9366,-0.8727 -1.9366,-1.9367 0,-1.0722
             0.8727,-1.9366 1.9366,-1.9366 l 15.5179,0 c 1.0639,-0.01
             1.9366,0.8644 1.9366,1.9366 z m -1.9449,2.9091 -15.5096,0 c
             -1.28,0 -2.2608,1.2302 -1.8369,2.5683 0.2577,0.8063 1.0722,1.305
             1.92,1.305 l 0.033,0 c 1.1221,0 2.1444,0.6317 2.6431,1.6374 l
             0.017,0.041 c 0.6732,1.3465 2.053,2.2026 3.5657,2.2026 l 2.826,0 c
             1.5127,0 2.8925,-0.8561 3.5657,-2.2026 l 0.017,-0.041 c
             0.4987,-1.0057 1.5294,-1.6374 2.6432,-1.6374 l 0.033,0 c 0.8478,0
             1.6623,-0.4987 1.92,-1.305 0.4322,-1.3381 -0.5569,-2.5683
             -1.8369,-2.5683 z m 1.9449,-7.7631 c 0,1.0722 -0.8727,1.9366
             -1.9366,1.9366 l -15.5179,0 c -1.0722,0 -1.9366,-0.8727
             -1.9366,-1.9366 0,-1.0306 0.8062,-1.8701 1.8285,-1.9283
             -1.2135,-10.9132 -12.5008,-13.3403 -12.5008,-26.19 0,-11.24577
             9.118,-20.36377 20.3637,-20.36377 11.2457,0 20.3637,9.118
             20.3637,20.36377 0,12.8497 -11.2873,15.2768 -12.4925,26.19
             1.014,0.058 1.8285,0.8977 1.8285,1.9283 z"
             class="dimmable-light-icon-path"/>
        </g>
      </svg>
      <div class="level-bar-label">
        ON
      </div>
    </div>
  </div>`;
};

module.exports = DimmableLight;
