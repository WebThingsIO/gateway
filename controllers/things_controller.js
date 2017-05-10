/**
 * Things Controller.
 *
 * Manages HTTP requests to /things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var express = require('express');
var Things = require('../models/things');
var AdapterManager = require('../adapter-manager');

var ThingsController = express.Router();

/**
 * Get a list of Things.
 */
ThingsController.get('/', function (request, response) {
  Things.getThings().then(function(things) {
    response.status(200).json(things);
  });
});

/**
 * Handle creating a new thing.
 */
ThingsController.post('/', function (request, response) {
  if (!request.body || !request.body.id) {
    response.status(400).send('No id in thing description');
    return;
  }
  var description = request.body;
  var id = description.id;
  delete description.id;
  Things.createThing(id, description).then(function(thing) {
    console.log('Successfully created new thing ' + thing);
    response.status(201).send(thing);
  }).catch(function(error) {
    console.error('Error saving new thing ' + error);
    response.status(500).send(error);
  });
});

/**
 * Get a property of a Thing.
 */
ThingsController.get('/:thingId/properties/:propertyName',
  function(request, response) {
  var thingId = request.params.thingId;
  var propertyName = request.params.propertyName;
  var value = AdapterManager.getProperty(thingId, propertyName);
  // TODO: Only respond once Promise resolves when bug #42 has landed.
  var result = {};
  if (value === undefined) {
    result[propertyName] = null;
  } else {
    result[propertyName] = value;
  }
  response.status(200).json(result);
});

/**
 * Set a property of a Thing.
 */
ThingsController.put('/:thingId/properties/:propertyName',
  function(request, response) {
  var thingId = request.params.thingId;
  var propertyName = request.params.propertyName;
  if(!request.body || request.body[propertyName] === undefined) {
    response.status(400).send('Invalid property name');
    return;
  }
  var value = request.body[propertyName];
  AdapterManager.setProperty(thingId, propertyName, value);
  // TODO: Only respond once Promise resolves when bug #42 has landed.
  var result = {};
  result[propertyName] = value;
  response.status(200).json(result);
});

module.exports = ThingsController;
