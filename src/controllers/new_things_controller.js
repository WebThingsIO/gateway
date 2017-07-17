/**
 * New Things Controller.
 *
 * /new_things returns a list of Things connected/paried with the gateway which
 * haven't yet been added to the gateway database.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var express = require('express');
var Things = require('../models/things');

var NewThingsController = express.Router();

/**
 * Handle GET requests to /new_things
 */
NewThingsController.get('/', function (request, response) {
  Things.getNewThings().then(function(newThings) {
    response.json(newThings);
  }).catch(function(error) {
    console.error('Error getting a list of new things from adapters ' + error);
    response.status(500).send(error);
  });
});

/**
 * Handle a WebSocket request on /new_things
 */
NewThingsController.ws('/', function(websocket) {
  console.log('Opened a new things socket');
  // Register the WebSocket with the Things model so new devices can be pushed
  // to the client as they are added.
  Things.registerWebsocket(websocket);
  // Send a list of things the adapter manager already knows about
  Things.getNewThings().then(function(newThings) {
    newThings.forEach(function(newThing) {
      websocket.send(JSON.stringify(newThing));
    }, this);
  }).catch(function(error) {
    console.error('Error getting a list of new things from adapters ' + error);
  });
});

module.exports = NewThingsController;
