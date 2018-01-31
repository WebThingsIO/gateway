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

/* globals LabelDetail, OnOffDetail, OnOffSwitch, Thing, ThingDetailLayout,
  LevelDetail */

/**
 * SmartPlug Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function SmartPlug(description, format) {
  this.displayedProperties = this.displayedProperties || {};

  if (description.properties) {
    // This is needed to make OnOffSwitch work.
    this.onPropertyUrl = description.properties.on.href;

    this.displayedProperties.on = {
      href: description.properties.on.href,
      detail: new OnOffDetail(this),
    };

    this.displayedProperties.instantaneousPower = {
      href: description.properties.instantaneousPower.href,
      detail: new LabelDetail(this, 'instantaneousPower', 'Power', 'W'),
    };

    if (description.properties.hasOwnProperty('voltage')) {
      this.displayedProperties.voltage = {
        href: description.properties.voltage.href,
        detail: new LabelDetail(this, 'voltage', 'Voltage', 'V'),
      };
    }

    if (description.properties.hasOwnProperty('current')) {
      this.displayedProperties.current = {
        href: description.properties.current.href,
        detail: new LabelDetail(this, 'current', 'Current', 'A'),
      };
    }

    if (description.properties.hasOwnProperty('frequency')) {
      this.displayedProperties.frequency = {
        href: description.properties.frequency.href,
        detail: new LabelDetail(this, 'frequency', 'Frequency', 'Hz'),
      };
    }

    if (description.properties.hasOwnProperty('level')) {
      this.displayedProperties.level = {
        href: description.properties.level.href,
        detail: new LevelDetail(this),
      };
    }
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

  this.smartPlug = this.element.querySelector('.smart-plug');
  this.smartPlugLabel =
    this.element.querySelector('.smart-plug-label');

  this.updateStatus();

  if (format === 'htmlDetail') {
    for (const prop of Object.values(this.displayedProperties)) {
      prop.detail.attach();
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
  return `<div class="thing smart-plug">
    <a href="${this.href}" class="thing-details-link"></a>
    ${this.iconView()}
    <span class="thing-name">${this.name}</span>
  </div>`
};

/**
 * HTML detail view for smart plug.
 */
SmartPlug.prototype.htmlDetailView = function() {
  let detailsHTML = '';
  for (const prop in this.displayedProperties) {
    detailsHTML += this.displayedProperties[prop].detail.view();
  }

  return `<div class="smart-plug-container">
    <div class="thing">
      ${this.iconView()}
    </div>
    ${detailsHTML}
  </div>`;
};

/**
 * Update the status of the smart plug.
 */
SmartPlug.prototype.updateStatus = function() {
  const urls = Object.values(this.displayedProperties).map(v => v.href);
  const opts = {
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`,
      'Accept': 'application/json'
    }
  };

  const requests = urls.map(u => fetch(u, opts));
  Promise.all(requests).then(responses => {
    return Promise.all(responses.map(response => {
      return response.json();
    }));
  }).then(responses => {
    responses.forEach(response => {
      this.onPropertyStatus(response);
    });
  }).catch(error => {
    console.error(`Error fetching smart plug status: ${error}`);
  });
};

/**
 * Handle a 'propertyStatus' message.
 * @param {Object} properties - property data
 */
SmartPlug.prototype.onPropertyStatus = function(data) {
  for (const prop in data) {
    if (!this.displayedProperties.hasOwnProperty(prop)) {
      continue;
    }

    const value = data[prop];
    if (typeof(value) === 'undefined' || value === null) {
      continue;
    }

    this.properties[prop] = value;
    this.updateProperty(prop, value);
  }
};

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
SmartPlug.prototype.updateProperty = function(name, value) {
  if (!this.displayedProperties.hasOwnProperty(name)) {
    return;
  }

  switch (name) {
    case 'on':
      this.updateOn(value);
      break;
    case 'instantaneousPower':
      this.updatePower(value);
      break;
    case 'voltage':
    case 'current':
    case 'frequency':
      this.properties[name] = value;
      this.displayedProperties[name].detail.update();
      break;
    case 'level':
      this.updateLevel(value);
      break;
  }
};

SmartPlug.prototype.updateOn = function(on) {
  this.displayedProperties.on.detail.update();

  if (this.displayedProperties.level) {
    this.updateLevel(this.properties.level);
  }

  if (on) {
    this.showOn();
    this.updatePower(this.properties.power);
  } else {
    this.showOff();
    if (this.smartPlugLabel) {
      this.smartPlugLabel.innerText = 'off';
    }
  }
};

/**
 * Show updated power consumption value.
 */
SmartPlug.prototype.updatePower = function(power) {
  power = parseFloat(power);

  if (this.smartPlugLabel) {
    if (!this.properties.on) {
      this.smartPlugLabel.innerText = 'off';
    } else if (power) {
      this.smartPlugLabel.innerText = `${power.toFixed(2)}W`;
    } else {
      this.smartPlugLabel.innerText = '0W';
    }
  }

  this.displayedProperties.instantaneousPower.detail.update();
};

/**
 * Show updated level.
 */
SmartPlug.prototype.updateLevel = function(level) {
  if (this.displayedProperties.hasOwnProperty('level')) {
    this.properties.level = level;
    this.displayedProperties.level.detail.update();
  }
};

/**
 * Set the level.
 */
SmartPlug.prototype.setLevel = function(level) {
  if (typeof(level) === 'string') {
    level = parseInt(level, 10);
  }

  const payload = {
   level: level
  };
  fetch(this.displayedProperties.level.href, {
   method: 'PUT',
   body: JSON.stringify(payload),
   headers: Object.assign(window.API.headers(), {
     'Content-Type': 'application/json'
   })
  }).then(response => {
   if (response.status === 200) {
     this.updateLevel(level);
   } else {
     console.error('Status ' + response.status + ' trying to set level');
   }
  }).catch(function(error) {
   console.error('Error trying to set level: ' + error);
  });
};
