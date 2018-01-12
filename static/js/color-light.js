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

/* globals OnOffSwitch, Thing, ThingDetailLayout */

/**
 * ColorLight Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function ColorLight(description, format) {
  Thing.call(this, description, format);
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  this.onPropertyUrl = new URL(this.propertyDescriptions.on.href, this.href);
  this.colorPropertyUrl = new URL(this.propertyDescriptions.color.href,
                                  this.href);

  this.updateStatus();
  this.colorLight = this.element;
  if (format === 'htmlDetail') {
    this.colorLight = this.element.querySelector('.color-light');
    this.colorLightIconPath =
      this.element.querySelector('.color-light-icon-path');
    this.onOffSwitch = this.element.querySelector('.color-light-onoff-switch');
    this.onOffLabel = this.element.querySelector('.color-light-onoff-label');
    this.colorInput = this.element.querySelector('.color-light-color');

    this.onOffSwitch.addEventListener('click', this.handleClick.bind(this));
    this.colorInput.addEventListener('change', () => {
      this.setColor(this.colorInput.value);
    });

    this.layout = new ThingDetailLayout(
      this.element.querySelectorAll('.thing-detail-container'));
    this.layout.update();
  } else {
    this.element.addEventListener('click', this.handleClick.bind(this));
  }
  return this;
}

ColorLight.prototype = Object.create(OnOffSwitch.prototype);

/**
 * HTML view for Color bulb
 */
ColorLight.prototype.htmlView = function() {
  return `<div class="thing on-off-switch">
      <div class="thing-icon"></div>
      <span class="thing-name">${this.name}</span>
    </div>`;
}

/**
 * HTML detail view for Color bulb
 */
ColorLight.prototype.htmlDetailView = function() {
  let id = this.href.pathname.split('/').pop();
  let checked = this.properties.on;
  let onoff = checked ? 'on' : 'off';
  let color = this.properties.color;

  return `<div class="color-light-container">
    <div class="color-light" style="background: ${color};">
      <svg
         xmlns:dc="http://purl.org/dc/elements/1.1/"
         xmlns:cc="http://creativecommons.org/ns#"
         xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:svg="http://www.w3.org/2000/svg"
         xmlns="http://www.w3.org/2000/svg"
         version="1.1"
         viewBox="0 0 64 64"
         height="64"
         width="64"
         class="color-light-icon">
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
             style="fill:#ffffff"
             class="color-light-icon-path"/>
        </g>
      </svg>
    </div>
    <div class="thing-detail-container" style="top: 25%; left: 65%;">
      <div class="thing-detail">
        <input class="thing-detail-contents color-light-color" type="color"
               value="${color}"/>
      </div>
      <div class="thing-detail-label">Color</div>
    </div>
    <div class="thing-detail-container">
      <div class="thing-detail on-off-switch-switch">
        <div class="thing-detail-contents">
          <form class="switch">
            <input type="checkbox" id="color-light-switch-${id}"
                   class="switch-checkbox color-light-onoff-switch" ${checked}/>
            <label class="switch-slider" for="color-light-switch-${id}"></label>
          </form>
          <div class="color-light-onoff-label">
            ${onoff}
          </div>
        </div>
      </div>
      <div class="thing-detail-label">On/Off</div>
    </div>
  </div>`;
};

/**
 * SVG view for Color bulb
 */
ColorLight.prototype.svgView = function() {
  return '<g transform="translate(' + this.x + ',' + this.y + ')"' +
         '  dragx="' + this.x + '" dragy="' + this.y + '"' +
         '  class="floorplan-thing">' +
         '  <a href="' + this.href +'" class="svg-thing-link">' +
         '    <circle cx="0" cy="0" r="5" class="svg-thing-icon" />' +
         '    <image x="-2.5" y="-2.5" width="5" height="5" ' +
         '      xlink:href="/images/on-off-switch.svg" />' +
         '    <text x="0" y="8" text-anchor="middle" class="svg-thing-text">' +
                this.name.substring(0, 7) +
         '    </text>' +
         '  </a>' +
         '</g>';
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

  fetch(this.onPropertyUrl, opts).then(response => {
    return response.json();
  }).then(response => {
    this.onPropertyStatus(response);
    return fetch(this.colorPropertyUrl, opts);
  }).then(response => {
    return response.json();
  }).then(response => {
    this.onPropertyStatus(response);
  }).catch(error => {
    console.error('Error fetching on/off switch status ' + error);
  });
};

/**
 * Handle a 'propertyStatus' message
 * @param {Object} properties - property data
 */
ColorLight.prototype.onPropertyStatus = function(data) {
  console.log(data);
  if (data.hasOwnProperty('on')) {
    this.updateOn(data.on);
  }
  if (data.hasOwnProperty('color')) {
    this.updateColor(data.color);
  }
};

ColorLight.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }
  this.onOffLabel.textContent = on ? 'on' : 'off';
  this.onOffSwitch.checked = on;

  if (on) {
    this.showOn();
  } else {
    this.showOff();
  }
};

ColorLight.prototype.updateColor = function(color) {
  this.properties.color = color;
  this.colorLight.style.background = color;
  this.colorInput.value = color;
  let r = parseInt(color.substr(1,2), 16);
  let g = parseInt(color.substr(3,2), 16);
  let b = parseInt(color.substr(5,2), 16);

  // From https://stackoverflow.com/questions/3942878/
  if (r * 0.299 + g * 0.587 + b * 0.114 > 186) {
    this.colorLightIconPath.style.fill = '#666666';
  } else {
    this.colorLightIconPath.style.fill = '#ffffff';
  }
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
