/**
 * Thing Model.
 *
 * Represents a Web Thing.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var Config = require('../config');

/**
 * Thing constructor.
 *
 * Create a Thing object from an id and a valid Thing description.
 *
 * @param {String} id Unique ID.
 * @param {Object} description Thing description.
 */
var Thing = function(id, description) {
  if (!id || !description) {
    console.error('id and description needed to create new Thing');
    return;
  }
  // Parse the Thing Description
  this.id = id;
  this.name = description.name || '';
  this.type = description.type || '';
  this.href = description.href || Config.THINGS_PATH + '/' + this.id;
  this.properties = [];
  this.actions = [];
  this.events = [];
  if (description.properties) {
    description.properties.forEach(function(property) {
      if (!property.name) {
        console.error('Properties must have a name');
        return;
      }
      // Give the property a URL if it doesn't have one
      property.href = property.href || Config.THINGS_PATH + '/' + this.id +
        Config.PROPERTIES_PATH + '/' + property.name;
      this.properties.push(property);
    }, this);
  }
};

/**
 * Get a JSON Thing Description for this Thing.
 */
Thing.prototype.getDescription = function() {
  return {
    'name': this.name,
    'type': this.type,
    'href': this.href,
    'properties': this.properties,
    'actions': this.actions,
    'events': this.events
  };
};

module.exports = Thing;
