/**
 * Things Model.
 *
 * Manages the data model and business logic for a collection of Things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing.js');
const Database = require('../db.js');
const AddonManager = require('../addon-manager');
const Constants = require('../constants');

const Things = {

  /**
   * A Map of Things in the Things database.
   */
  things: new Map(),

  /**
   * A collection of open websockets listening for new things.
   */
  websockets: [],

  /**
   * Get all Things known to the Gateway, initially loading them from the
   * database,
   *
   * @return {Promise} which resolves with a Map of Thing objects.
   */
  getThings: function() {
    if (this.things.size > 0) {
      return Promise.resolve(this.things);
    }
    return Database.getThings().then((things) => {
      // Update the map of Things
      this.things = new Map();
      things.forEach((thing) => {
        this.things.set(thing.id, new Thing(thing.id, thing));
      });
      return this.things;
    });
  },

  /**
   * Get Thing Descriptions for all Things stored in the database.
   *
   * @param {String} reqHost request host, if coming via HTTP
   * @param {Boolean} reqSecure whether or not the request is secure, i.e. TLS
   * @return {Promise} which resolves with a list of Thing Descriptions.
   */
  getThingDescriptions: function(reqHost, reqSecure) {
    return this.getThings().then(function(things) {
      const descriptions = [];
      for (const thing of things.values()) {
        descriptions.push(thing.getDescription(reqHost, reqSecure));
      }
      return descriptions;
    });
  },

  /**
   * Get a list of Things by their IDs.
   *
   * {Array} ids IDs of the list of Things to get.
   * @return {Promise} A promise which resolves with a list of Things.
   */
  getListThings: function(ids) {
    return this.getThings().then(function(things) {
      const listThings = [];
      for (const id of ids) {
        if (things.has(id)) {
          listThings.push(things.get(id));
        }
      }
      return listThings;
    });
  },

  /**
   * Get Thing Descriptions for a list of Things by their IDs.
   *
   * @param {Array} ids The IDs of the list of Things to get descriptions of.
   * @param {String} reqHost request host, if coming via HTTP.
   * @param {Boolean} reqSecure whether or not the request is secure, i.e. TLS.
   * @return {Promise} which resolves with a list of Thing Descriptions.
   */
  getListThingDescriptions: function(ids, reqHost, reqSecure) {
    return this.getListThings(ids).then(function(listThings) {
      const descriptions = [];
      for (const thing of listThings) {
        descriptions.push(thing.getDescription(reqHost, reqSecure));
      }
      return descriptions;
    });
  },

  /**
   * Get a list of things which are connected to adapters but not yet saved
   * in the gateway database.
   *
   * @returns Promise A promise which resolves with a list of Things.
   */
  getNewThings: function() {
    // Get a map of things in the database
    return this.getThings().then((function(storedThings) {
      // Get a list of things connected to adapters
      const connectedThings = AddonManager.getThings();
      const newThings = [];
      connectedThings.forEach(function(connectedThing) {
        if (!storedThings.has(connectedThing.id)) {
          connectedThing.href =
           `${Constants.THINGS_PATH}/${connectedThing.id}`;
          if (connectedThing.properties) {
            for (const propertyName in connectedThing.properties) {
              const property = connectedThing.properties[propertyName];
              property.href = `${Constants.THINGS_PATH
              }/${connectedThing.id
              }${Constants.PROPERTIES_PATH}/${propertyName}`;
            }
          }
          newThings.push(connectedThing);
        }
      });
      return newThings;
    }));
  },

  /**
   * Create a new Thing with the given ID and description.
   *
   * @param String id ID to give Thing.
   * @param Object description Thing description.
   */
  createThing: function(id, description) {
    const thing = new Thing(id, description);
    return Database.createThing(thing.id, thing.getDescription())
      .then(function(thingDesc) {
        this.things.set(thing.id, thing);
        return thingDesc;
      }.bind(this));
  },

  /**
   * Handle a new Thing having been discovered.
   *
   * @param Object New Thing description
   */
  handleNewThing: function(newThing) {
    this.getThing(newThing.id).catch(() => {
      // If we don't already know about this thing, notify each open websocket
      this.websockets.forEach(function(socket) {
        socket.send(JSON.stringify(newThing));
      });
    });
  },

  /**
   * Add a websocket to the list of new Thing subscribers.
   *
   * @param {Websocket} websocket A websocket instance.
   */
  registerWebsocket: function(websocket) {
    this.websockets.push(websocket);
    websocket.on('close', () => {
      const index = this.websockets.indexOf(websocket);
      this.websockets.splice(index, 1);
    });
  },

  /**
   * Get a Thing by its ID.
   *
   * @param {String} id The ID of the Thing to get.
   * @return {Promise<Thing>} A Thing object.
   */
  getThing: function(id) {
    return this.getThings().then(function(things) {
      if (things.has(id)) {
        return things.get(id);
      } else {
        throw new Error(`Unable to find thing with id: ${id}`);
      }
    });
  },

  /**
   * Get a Thing description for a thing by its ID.
   *
   * @param {String} id The ID of the Thing to get a description of.
   * @param {String} reqHost request host, if coming via HTTP
   * @param {Boolean} reqSecure whether or not the request is secure, i.e. TLS
   * @return {Promise<ThingDescription>} A Thing description object.
   */
  getThingDescription: function(id, reqHost, reqSecure) {
    return this.getThing(id).then((thing) => {
      return thing.getDescription(reqHost, reqSecure);
    });
  },

  /**
   * Remove a Thing.
   *
   * @param String id ID to give Thing.
   */
  removeThing: function(id) {
    return Database.removeThing(id).then(() => {
      const thing = this.things.get(id);
      if (!thing) {
        return;
      }
      thing.remove();
      this.things.delete(id);
    });
  },

  clearState: function() {
    this.websockets = [];
    this.things = new Map();
  },
};

AddonManager.on(Constants.THING_ADDED, function(thing) {
  Things.handleNewThing(thing);
});

module.exports = Things;
