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

const Ajv = require('ajv');
const EventEmitter = require('events');

const AddonManager = require('../addon-manager');
const Database = require('../db');
const Router = require('../router');
const Thing = require('./thing');
const Constants = require('../constants');

const ajv = new Ajv();

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
   * The promise object returned by Database.getThings()
   */
  getThingsPromise: null,

  /**
   * An EventEmitter used to bubble up added things
   *
   * Note that this differs from AddonManager's THING_ADDED because that thing
   * added is when the addon discovers a thing, not when the model is
   * instantiated
   */
  emitter: new EventEmitter(),

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

    if (this.getThingsPromise) {
      // We're still waiting for the database request.
      return this.getThingsPromise;
    }

    this.getThingsPromise = Database.getThings().then((things) => {
      this.getThingsPromise = null;

      // Update the map of Things
      this.things = new Map();
      things.forEach((thing, index) => {
        // This should only happen on the first migration.
        if (!thing.hasOwnProperty('layoutIndex')) {
          thing.layoutIndex = index;
        }

        this.things.set(thing.id, new Thing(thing.id, thing));
      });

      return this.things;
    });

    return this.getThingsPromise;
  },

  /**
   * Get the titles of all things.
   *
   * @return {Promise<Array>} which resolves with a list of all thing titles.
   */
  getThingTitles: function() {
    return this.getThings().then(function(things) {
      return Array.from(things.values()).map((t) => t.title);
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
   * Get a list of Things by their hrefs.
   *
   * {Array} hrefs hrefs of the list of Things to get.
   * @return {Promise} A promise which resolves with a list of Things.
   */
  getListThings: function(hrefs) {
    return this.getThings().then(function(things) {
      const listThings = [];
      for (const href of hrefs) {
        things.forEach(function(thing) {
          if (thing.href === href) {
            listThings.push(thing);
          }
        });
      }
      return listThings;
    });
  },

  /**
   * Get Thing Descriptions for a list of Things by their hrefs.
   *
   * @param {Array} hrefs The hrefs of the list of Things to get
   *                      descriptions of.
   * @param {String} reqHost request host, if coming via HTTP.
   * @param {Boolean} reqSecure whether or not the request is secure, i.e. TLS.
   * @return {Promise} which resolves with a list of Thing Descriptions.
   */
  getListThingDescriptions: function(hrefs, reqHost, reqSecure) {
    return this.getListThings(hrefs).then(function(listThings) {
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
    thing.connected = true;
    thing.layoutIndex = this.things.size;

    return Database.createThing(thing.id, thing.getDescription())
      .then((thingDesc) => {
        this.things.set(thing.id, thing);
        this.emitter.emit(Constants.THING_ADDED, thing);
        return thingDesc;
      });
  },

  /**
   * Handle a new Thing having been discovered.
   *
   * @param {Object} newThing - New Thing description
   */
  handleNewThing: function(newThing) {
    this.getThing(newThing.id).then((thing) => {
      thing.setConnected(true);
      return thing.updateFromDescription(newThing);
    }).catch(() => {
      // If we don't already know about this thing, notify each open websocket
      this.websockets.forEach(function(socket) {
        socket.send(JSON.stringify(newThing));
      });
    });
  },

  /**
   * Handle a thing being removed by an adapter.
   *
   * @param {Object} thing - Thing which was removed
   */
  handleThingRemoved: function(thing) {
    this.getThing(thing.id).then((thing) => {
      thing.setConnected(false);
    }).catch(() => {});
  },

  /**
   * Handle a thing's connectivity state change.
   *
   * @param {string} thingId - ID of thing
   * @param {boolean} connected - New connectivity state
   */
  handleConnected: function(thingId, connected) {
    this.getThing(thingId).then((thing) => {
      thing.setConnected(connected);
    }).catch(() => {});
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
   * Get a Thing by its title.
   *
   * @param {String} title The title of the Thing to get.
   * @return {Promise<Thing>} A Thing object.
   */
  getThingByTitle: function(title) {
    title = title.toLowerCase();

    return this.getThings().then(function(things) {
      for (const thing of things.values()) {
        if (thing.title.toLowerCase() === title) {
          return thing;
        }
      }

      throw new Error(`Unable to find thing with title: ${title}`);
    }).catch((e) => {
      console.warn('Unexpected thing retrieval error', e);
      return null;
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
    Router.removeProxyServer(id);
    return Database.removeThing(id).then(() => {
      const thing = this.things.get(id);
      if (!thing) {
        return;
      }

      const index = thing.layoutIndex;

      thing.remove();
      this.things.delete(id);

      this.things.forEach((t) => {
        if (t.layoutIndex > index) {
          t.setLayoutIndex(t.layoutIndex - 1);
        }
      });
    });
  },

  /**
   * @param {String} thingId
   * @param {String} propertyName
   * @return {Promise<any>} resolves to value of property
   */
  getThingProperty: async function(thingId, propertyName) {
    try {
      return await AddonManager.getProperty(thingId, propertyName);
    } catch (error) {
      console.error('Error getting value for thingId:', thingId,
                    'property:', propertyName);
      console.error(error);
      throw {
        code: 500,
        message: error,
      };
    }
  },

  /**
   * @param {String} thingId
   * @param {String} propertyName
   * @param {any} value
   * @return {Promise<any>} resolves to new value
   */
  setThingProperty: async function(thingId, propertyName, value) {
    let thing;
    try {
      thing = await Things.getThingDescription(thingId, 'localhost', true);
    } catch (e) {
      throw {
        code: 404,
        message: 'Thing not found',
      };
    }

    if (!thing.properties.hasOwnProperty(propertyName)) {
      throw {
        code: 404,
        message: 'Property not found',
      };
    }

    if (thing.properties[propertyName].readOnly) {
      throw {
        code: 400,
        message: 'Read-only property',
      };
    }

    const valid = ajv.validate(thing.properties[propertyName], value);
    if (!valid) {
      throw {
        code: 400,
        message: 'Invalid property value',
      };
    }

    try {
      const updatedValue = await AddonManager.setProperty(thingId,
                                                          propertyName, value);
      // Note: it's possible that updatedValue doesn't match value.
      return updatedValue;
    } catch (e) {
      console.error('Error setting value for thingId:', thingId,
                    'property:', propertyName,
                    'value:', value);
      throw {
        code: 500,
        message: e,
      };
    }
  },

  on: function(name, listener) {
    this.emitter.on(name, listener);
  },

  removeListener: function(name, listener) {
    this.emitter.removeListener(name, listener);
  },

  clearState: function() {
    this.websockets = [];
    this.things = new Map();
    this.emitter.removeAllListeners();
  },
};

AddonManager.on(Constants.THING_ADDED, (thing) => {
  Things.handleNewThing(thing);
});

AddonManager.on(Constants.THING_REMOVED, (thing) => {
  Things.handleThingRemoved(thing);
});

AddonManager.on(Constants.CONNECTED, ({device, connected}) => {
  Things.handleConnected(device.id, connected);
});

module.exports = Things;
