/**
 * Color Bulb.
 *
 * UI element representing a bulb with control over its color
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/* globals ColorDetail, OnOffDetail, OnOffSwitch, Thing, ThingDetailLayout,
   ColorTemperatureDetail, Utils */

/**
 * ColorLight Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function ColorLight(description, format) {
  if (format === 'htmlDetail') {
    this.details = this.details || {};
    this.details.on = new OnOffDetail(this);

    if (description.properties.hasOwnProperty('color')) {
      this.details.color = new ColorDetail(this);
    }

    if (description.properties.hasOwnProperty('colorTemperature')) {
      const prop = description.properties.colorTemperature;
      this.details.colorTemperature =
        new ColorTemperatureDetail(this, prop.min, prop.max);
    }
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/bulb.svg',
                                  pngBaseIcon: '/images/bulb.png',
                                  thingCssClass: 'color-light-container',
                                  addIconToView: false});

  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  this.onPropertyUrl = new URL(this.propertyDescriptions.on.href, this.href);

  if (this.propertyDescriptions.hasOwnProperty('color')) {
    this.colorPropertyUrl = new URL(this.propertyDescriptions.color.href,
                                    this.href);
  }

  if (this.propertyDescriptions.hasOwnProperty('colorTemperature')) {
    this.colorTemperaturePropertyUrl =
      new URL(this.propertyDescriptions.colorTemperature.href, this.href);
  }

  this.updateStatus();
  this.colorLight = this.element.querySelector('.color-light');
  this.colorLightLabel = this.element.querySelector('.color-light-label');
  this.colorLightIconPath =
    this.element.querySelector('.color-light-icon-path');

  if (format === 'htmlDetail') {
    for (let prop in this.details) {
      this.details[prop].attach();
    }

    this.layout = new ThingDetailLayout(
      this.element.querySelectorAll('.thing-detail-container'));
  } else {
    this.colorLight.addEventListener('click', this.handleClick.bind(this));
  }
  return this;
}

ColorLight.prototype = Object.create(OnOffSwitch.prototype);

ColorLight.prototype.iconView = function() {
  let colorStyle = '';
  if (this.properties.on) {
    colorStyle = `background: ${this.getIconColor()}`;
  }

  return `<div class="color-light" style="${colorStyle}">
    <div class="color-light-icon">
      <svg
         xmlns:dc="http://purl.org/dc/elements/1.1/"
         xmlns:cc="http://creativecommons.org/ns#"
         xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:svg="http://www.w3.org/2000/svg"
         xmlns="http://www.w3.org/2000/svg"
         version="1.1"
         viewBox="0 0 64 66"
         height="66"
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
        <g transform="translate(0,-987.36216)">
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
             class="color-light-icon-path"/>
        </g>
      </svg>
      <div class="color-light-label">
        ON
      </div>
    </div>
  </div>`;
};

/**
 * HTML view for Color bulb
 */
ColorLight.prototype.htmlView = function() {
  return `<div class="thing ${this.thingCssClass}">
    <a href="${encodeURI(this.href)}" class="thing-details-link"></a>
    ${this.iconView()}
    <span class="thing-name">${Utils.escapeHtml(this.name)}</span>
  </div>`;
};

/**
 * HTML detail view for Color bulb
 */
ColorLight.prototype.htmlDetailView = function() {
  let detailsHTML = '';
  for (let prop in this.details) {
    detailsHTML += this.details[prop].view();
  }

  return `<div class="color-light-container">
    <div class="thing">
      ${this.iconView()}
    </div>
    ${detailsHTML}
  </div>`;
};

/**
 * Update the status of the light.
 */
ColorLight.prototype.updateStatus = function() {
  var opts = {
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`,
      'Accept': 'application/json'
    }
  };

  const promises = [];
  promises.push(fetch(this.onPropertyUrl, opts));

  if (this.hasOwnProperty('colorPropertyUrl')) {
    promises.push(fetch(this.colorPropertyUrl));
  }

  if (this.hasOwnProperty('colorTemperaturePropertyUrl')) {
    promises.push(fetch(this.colorTemperaturePropertyUrl));
  }

  Promise.all(promises).then(responses => {
    return Promise.all(responses.map(response => {
      return response.json();
    }));
  }).then(responses => {
    responses.forEach(response => {
      this.onPropertyStatus(response);
    });
  }).catch(error => {
    console.error('Error fetching on/off switch status ' + error);
  });
};

/**
 * Handle a 'propertyStatus' message
 * @param {Object} properties - property data
 */
ColorLight.prototype.onPropertyStatus = function(data) {
  if (data.hasOwnProperty('on')) {
    this.updateOn(data.on);
  }
  if (data.hasOwnProperty('color')) {
    this.updateColor(data.color);
  }
  if (data.hasOwnProperty('colorTemperature')) {
    this.updateColorTemperature(data.colorTemperature);
  }
};

ColorLight.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }

  let onoff = on ? 'on' : 'off';
  this.colorLightLabel.textContent = onoff;

  if (this.details) {
    this.details.on.update();
  }

  this.colorLight.style.background = on ? 'white' : '';

  if (on) {
    this.showOn();
  } else {
    this.showOff();
  }
};

ColorLight.prototype.updateColor = function(color) {
  if (!color) {
    return;
  }

  this.properties.color = color;
  if (!this.colorLight) {
    return;
  }

  if (this.details) {
    this.details.color.update();
  }

  this.updateIcon();
};

ColorLight.prototype.setColor = function(color) {
  const payload = {
   color: color
  };
  fetch(this.colorPropertyUrl, {
   method: 'PUT',
   body: JSON.stringify(payload),
   headers: Object.assign(window.API.headers(), {
     'Content-Type': 'application/json'
   })
  }).then(response => {
   if (response.status === 200) {
     this.updateColor(color);
   } else {
     console.error('Status ' + response.status + ' trying to set color');
   }
  }).catch(function(error) {
   console.error('Error trying to set color: ' + error);
  });
};

ColorLight.prototype.updateColorTemperature = function(temperature) {
  if (typeof(temperature) === 'string') {
    temperature = parseInt(temperature, 10);
  }

  this.properties.colorTemperature = temperature;
  if (!this.colorLight) {
    return;
  }

  if (this.details) {
    this.details.colorTemperature.update();
  }

  this.updateIcon();
};

ColorLight.prototype.setColorTemperature = function(temperature) {
  if (typeof(temperature) === 'string') {
    temperature = parseInt(temperature, 10);
  }

  const payload = {
   colorTemperature: temperature
  };
  fetch(this.colorTemperaturePropertyUrl, {
   method: 'PUT',
   body: JSON.stringify(payload),
   headers: Object.assign(window.API.headers(), {
     'Content-Type': 'application/json'
   })
  }).then(response => {
   if (response.status === 200) {
     this.updateColorTemperature(temperature);
   } else {
     console.error(
       'Status ' + response.status + ' trying to set color temperature');
   }
  }).catch(function(error) {
   console.error('Error trying to set color temperature: ' + error);
  });
};

ColorLight.prototype.getIconColor = function() {
  // If we only have color, or we have both, but color temperature is invalid
  // (0), then use the color. Otherwise, use the color temperature.
  if (this.properties.hasOwnProperty('color') &&
      (!this.properties.hasOwnProperty('colorTemperature') ||
       this.properties.colorTemperature === 0)) {
    return this.properties.color;
  } else if (this.properties.hasOwnProperty('colorTemperature')) {
      return this.colorTemperatureToRGB(this.properties.colorTemperature);
  } else {
    return '#ffffff';
  }
};

ColorLight.prototype.updateIcon = function() {
  const iconColor = this.getIconColor();
  this.colorLightIconPath.style.fill = iconColor;

  let r = parseInt(iconColor.substr(1,2), 16);
  let g = parseInt(iconColor.substr(3,2), 16);
  let b = parseInt(iconColor.substr(5,2), 16);

  // From https://stackoverflow.com/questions/3942878/
  if (r * 0.299 + g * 0.587 + b * 0.114 > 186) {
    this.colorLight.classList.add('bright-color');
  } else {
    this.colorLight.classList.remove('bright-color');
  }
};

/**
 * Algorithm found here:
 *   http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
 */
ColorLight.prototype.colorTemperatureToRGB = function(temperature) {
  temperature /= 100;

  let r;
  if (temperature <= 66) {
    r = 255;
  } else {
    r = temperature - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    r = Math.max(r, 0);
    r = Math.min(r, 255);
  }

  let g;
  if (temperature <= 66) {
    g = temperature;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
  } else {
    g = temperature - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492)
  }

  g = Math.max(g, 0);
  g = Math.min(g, 255);

  let b;
  if (temperature >= 66) {
    b = 255;
  } else if (temperature <= 19) {
    b = 0
  } else {
    b = temperature - 10;
    b = 138.5177312231 * Math.log(b) - 305.0447927307;
    b = Math.max(b, 0);
    b = Math.min(b, 255);
  }

  r = Math.round(r).toString(16);
  g = Math.round(g).toString(16);
  b = Math.round(b).toString(16);
  return `#${r}${g}${b}`;
};
