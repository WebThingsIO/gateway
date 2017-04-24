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

var Database = require('../db.js');
var adapterManager = require('../adapter-manager');

var Things = {

  /**
   * A Map of Things in the Things database.
   */
  things: {},

   /**
    * A collection of open websockets listening for new things.
    */
   websockets: [],

   /**
    * Get all Things stored in the database.
    *
    * @return Promise which resolves with a list of Thing objects.
    */
   getThings: function() {
     return new Promise((function(resolve, reject) {
       Database.getThings().then((function(things) {
         // Update the map of Things
         this.things = {};
         things.forEach(function(thing) {
           this.things[thing.id] = thing;
         }, this);
         resolve(things);
       }).bind(this));
     }).bind(this));
   },

  /**
   * Get a list of things which are connected to adapters but not yet saved
   * in the gateway database.
   *
   * @returns Promise A promise which resolves with a list of Things.
   */
   getNewThings: function() {
     return new Promise((function(resolve, reject) {
       // Make sure the things map is up to date with database
       this.getThings().then((function() {
         // Get a map of things in the database
         var storedThings = this.things;
         // Get a list of things connected to adapters
         var connectedThings = adapterManager.getThings();
         var newThings = [];
         connectedThings.forEach(function(connectedThing) {
           if(!storedThings[connectedThing.id]) {
             connectedThing.href = '/things/' + connectedThing.id;
             if (connectedThing.properties) {
               connectedThing.properties.forEach(function(property) {
                 property.href = '/things/' + connectedThing.id +
                   '/properties/' + property.name;
               });
             }
             newThings.push(connectedThing);
           }
         });
         resolve(newThings);
       }).bind(this));
     }).bind(this));
   },

   /**
    * Create a new Thing with the given ID and description.
    *
    * @param String id ID to give Thing.
    * @param Object description Thing description.
    */
   createThing: function(id, description) {
     // TODO: Create a Thing object
     return Database.createThing(id, description);
   },

   /**
    * Handle a new Thing having been discovered.
    *
    * @param Object New Thing description
    */
   handleNewThing: function(newThing) {
     // Give the Thing a URL
     newThing.href = '/things/' + newThing.id;
     // Temporary hack because name can currently be blank
     if (!newThing.name) {
       newThing.name = 'My On/Off Switch';
     }
     // Give the Thing's properties URLs
     if (newThing.properties) {
       newThing.properties.forEach(function(property) {
         property.href = '/things/' + newThing.id +
           '/properties/' + property.name;
       });
     }
     // Notify each open websocket of the new Thing
     this.websockets.forEach(function(socket) {
       socket.send(JSON.stringify(newThing));
     });
   },

  /**
   * Add a websocket to the list of new Thing subscribers.
   *
   * @param {Websocket} websocket A websocket instance.
   */
   registerWebsocket: function(websocket) {
     this.websockets.push(websocket);
   }
 };

module.exports = Things;
