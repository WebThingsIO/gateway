/**
 * Actions Controller.
 *
 * Manages the top level actions queue for the gateway (i.e. not actions on
 * Things but on the gateway itself.)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* jshint unused:false */
/* globals AdapterManager */

var express = require('express');
var Things = require('../models/things');
var AdapterManager = require('../adapter-manager');

var ActionsController = express.Router();
ActionsController.actions = {};
ActionsController.nextId = 0;

/**
 * Handle creating a new action.
 */
ActionsController.post('/', function (request, response) {
  if (!request.body.name) {
    response.status(400).send('No action name provided');
    return;
  }
  var id = ActionsController.nextId;
  switch(request.body.name) {
    case 'pair':
      var action = {
        'name': 'pair',
        'href': '/actions/' + id,
      };
      ActionsController.actions[id] = action;
      ActionsController.nextId++;
      AdapterManager.addNewDevice();
      response.status(201).send(JSON.stringify(action));
      break;
    default:
      response.status(400).send('Invalid action name');
  }
});

/**
 * Handle getting a list of actions.
 */
ActionsController.get('/', function(request, response) {
  response.status(200).send(JSON.stringify(ActionsController.actions));
});

/**
 * Handle cancelling an action.
 */
ActionsController.delete('/:actionId', function(request, response) {
  var actionId = request.params.actionId;
  if(!ActionsController.actions[actionId]) {
    response.status(404).send('Action ""' + actionId + '" not found.');
    return;
  }
  switch(ActionsController.actions[actionId].name) {
    case 'pair':
      AdapterManager.cancelAddNewDevice();
      break;
  }
  delete ActionsController.actions[actionId];
  response.status(204).send();
});

module.exports = ActionsController;
