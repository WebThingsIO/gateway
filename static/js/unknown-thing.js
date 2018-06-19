/**
 * Unknown thing.
 *
 * UI element representing an unknown thing type.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const ActionDetail = require('./action-detail');
const BooleanDetail = require('./boolean-detail');
const NumberDetail = require('./number-detail');
const StringDetail = require('./string-detail');
const Thing = require('./thing');

/**
 * UnknownThing Constructor (extends Thing).
 *
 * @param Object description Thing description object.
 */
const UnknownThing = function(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    for (const name in description.properties) {
      const prop = description.properties[name];
      const href = prop.href;
      if (href) {
        let detail;
        switch (prop.type) {
          case 'string':
            detail = new StringDetail(this, name);
            break;
          case 'integer':
          case 'number': {
            const min = prop.hasOwnProperty('min') ? prop.min : prop.minimum;
            const max = prop.hasOwnProperty('max') ? prop.max : prop.maximum;
            detail =
              new NumberDetail(this, name, prop.type, prop.unit, min, max);
            break;
          }
          case 'boolean':
            detail = new BooleanDetail(this, name);
            break;
          default:
            continue;
        }

        const obj = {href, detail, type: prop.type};
        this.displayedProperties[name] = obj;
      }
    }
  }

  this.displayedActions = this.displayedActions || {};
  if (description.actions) {
    let href;
    for (const link of description.links) {
      if (link.rel === 'actions') {
        href = link.href;
        break;
      }
    }

    if (href) {
      for (const name in description.actions) {
        const action = description.actions[name];
        const detail = new ActionDetail(this, name, action.input, href);
        this.displayedActions[name] = {detail};
      }
    }
  }

  this.base = Thing;
  this.base(description, format);

  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  }

  this.updateStatus();

  return this;
};

UnknownThing.prototype = Object.create(Thing.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
UnknownThing.prototype.updateProperty = function(name, value) {
  if (!this.displayedProperties.hasOwnProperty(name)) {
    return;
  }

  this.properties[name] = value;
  this.displayedProperties[name].detail.update();
};

/**
 * Set the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
UnknownThing.prototype.setProperty = function(name, value) {
  if (this.displayedProperties[name].type === 'number') {
    value = parseFloat(value);
  }

  const payload = {
    [name]: value,
  };
  fetch(this.displayedProperties[name].href, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: Object.assign(API.headers(), {
      'Content-Type': 'application/json',
    }),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(`Status ${response.status} trying to set ${name}`);
    }
  }).then((json) => {
    this.updateProperty(name, json[name]);
  }).catch((error) => {
    console.error(`Error trying to set ${name}: ${error}`);
  });
};

UnknownThing.prototype.iconView = function() {
  return `<div class="unknown-thing">
    <img class="unknown-thing-icon" src="/images/unknown-thing.png" />
  </div>`;
};

module.exports = UnknownThing;
