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

var Thing = require('./thing.js');
var Database = require('../db.js');
var AdapterManager = require('../adapter-manager');
var Constants = require('../constants');

var Things = {

  /**
   * A Map of Things in the Things database.
   */
  things: new Map(),

   /**
    * A collection of open websockets listening for new things.
    */
   websockets: [],

   /**
    * Get all Things stored in the database.
    *
    * @return {Promise} which resolves with a Map of Thing objects.
    */
   getThings: function() {
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
    * @Return {Promise} which resolves with a list of Thing Descriptions.
    */
   getThingDescriptions: function() {
     return this.getThings().then(function(things) {
       var descriptions = [];
       for (let thing of things.values()) {
         descriptions.push(thing.getDescription());
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
       var connectedThings = AdapterManager.getThings();
       var newThings = [];
       connectedThings.forEach(function(connectedThing) {
         if(!storedThings.has(connectedThing.id)) {
           connectedThing.href =
            Constants.THINGS_PATH + '/' + connectedThing.id;
           if (connectedThing.properties) {
             for (var propertyName in connectedThing.properties) {
               var property = connectedThing.properties[propertyName];
               property.href = Constants.THINGS_PATH +
                 '/' + connectedThing.id +
                 Constants.PROPERTIES_PATH + '/' + propertyName;
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
     var thing = new Thing(id, description);
     return Database.createThing(thing.id, thing.getDescription());
   },

   /**
    * Handle a new Thing having been discovered.
    *
    * @param Object New Thing description
    */
   handleNewThing: function(newThing) {
     // Notify each open websocket of the new Thing
     this.websockets.forEach(function(socket) {
       socket.send(JSON.stringify(newThing));
     });
   },

   // eslint-disable-next-line
   handleRemovedThing: function(thingId) {
    /// TODO: Remove from database
    /// TODO: Send websocket notification
   },

  /**
   * Add a websocket to the list of new Thing subscribers.
   *
   * @param {Websocket} websocket A websocket instance.
   */
   registerWebsocket: function(websocket) {
     this.websockets.push(websocket);
   },

   /**
    * Get a Thing description for a thing by its ID.
    *
    * @param {String} id The ID of the Thing to get a description of.
    * @return {Object} A Thing description object.
    */
    getThingDescription: function(id) {
      return Database.getThing(id).then((thing) => {
        return new Thing(thing.id, thing).getDescription();
      });
    },

   /**
    * Remove a Thing.
    *
    * @param String id ID to give Thing.
    * @param Object description Thing description.
    */
   removeThing: function(id) {
     return Database.removeThing(id);
   }
 };

AdapterManager.on('thing-added', function(thing) {
  Things.handleNewThing(thing);
});

module.exports = Things;
