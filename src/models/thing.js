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

const Constants = require('../constants');
const Database = require('../db.js');
const EventEmitter = require('events');
const WebSocket = require('ws');

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
  this.description = description.description || '';
  this.href = description.href || Constants.THINGS_PATH + '/' + this.id;
  this.properties = {};
  this.actions = description.actions || {};
  this.events = description.events || {};
  this.eventsDispatched = [];
  this.emitter = new EventEmitter();
  if (description.properties) {
    for (var propertyName in description.properties) {
      var property = description.properties[propertyName];
      // Give the property a URL if it doesn't have one
      property.href = property.href || Constants.THINGS_PATH + '/' + this.id +
        Constants.PROPERTIES_PATH + '/' + propertyName;
      this.properties[propertyName] = property;
    }
  }
  this.floorplanX = description.floorplanX;
  this.floorplanY = description.floorplanY;
  this.websockets = [];
  this.links = [
    {
      rel: 'properties',
      href: `${this.href}/properties`,
    },
    {
      rel: 'actions',
      href: `${this.href}/actions`,
    },
    {
      rel: 'events',
      href: `${this.href}/events`,
    },
    {
      rel: 'alternate',
      mediaType: 'text/html',
      href: this.href,
    },
    // TODO: add websocket URL
  ];

  for (const actionName in this.actions) {
    this.actions[actionName].href =
      `${this.href}/actions/${actionName}`;
  }

  for (const eventName in this.events) {
    this.events[eventName].href = `${this.href}/events/${eventName}`;
  }
};

/**
 * Set the x and y co-ordinates for a Thing on the floorplan.
 *
 * @param {number} x The x co-ordinate on floorplan (0-100).
 * @param {number} y The y co-ordinate on floorplan (0-100).
 * @return {Promise} A promise which resolves with the description set.
 */
Thing.prototype.setCoordinates = function(x, y) {
  this.floorplanX = x;
  this.floorplanY = y;
  return Database.updateThing(this.id, this.getDescription());
};

/**
 * Dispatch an event to all listeners subscribed to the Thing
 * @param {Event} event
 */
Thing.prototype.dispatchEvent = function(event) {
  this.eventsDispatched.push(event);
  this.emitter.emit(Constants.EVENT, event);
};

/**
 * Add a subscription to the Thing's events
 * @param {Function} callback
 */
Thing.prototype.addEventSubscription = function(callback) {
  this.emitter.on(Constants.EVENT, callback);
};

/**
 * Remove a subscription to the Thing's events
 * @param {Function} callback
 */
Thing.prototype.removeEventSubscription = function(callback) {
  this.emitter.removeListener(Constants.EVENT, callback);
};

/**
 * Get a JSON Thing Description for this Thing.
 */
Thing.prototype.getDescription = function() {
  return {
    name: this.name,
    type: this.type,
    description: this.description,
    href: this.href,
    properties: this.properties,
    actions: this.actions,
    events: this.events,
    floorplanX: this.floorplanX,
    floorplanY: this.floorplanY,
    links: this.links,
  };
};

Thing.prototype.registerWebsocket = function(ws) {
  this.websockets.push(ws);
};

/**
 * Remove and clean up the Thing
 */
Thing.prototype.remove = function() {
  this.websockets.forEach(function(ws) {
    if (ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  });
};

/**
 * Add an action
 * @param {Action} action
 * @return {boolean} Whether a known action
 */
Thing.prototype.addAction = function(action) {
  return this.actions.hasOwnProperty(action.name);
};

/**
 * Remove an action
 * @param {Action} action
 * @return {boolean} Whether a known action
 */
Thing.prototype.removeAction = function(action) {
  return this.actions.hasOwnProperty(action.name);
};

module.exports = Thing;
