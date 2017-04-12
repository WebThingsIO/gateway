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

var ThingsController = express.Router();

ThingsController.get('/', function (request, response) {
  Things.getThings().then(function(things) {
    response.send(JSON.stringify(things));
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

module.exports = ThingsController;
