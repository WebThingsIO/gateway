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

var express = require('express');
var Action = require('../models/action');
var Actions = require('../models/actions');

var ActionsController = express.Router();

/**
 * Handle creating a new action.
 */
ActionsController.post('/', function (request, response) {
  if (!request.body.name) {
    response.status(400).send('No action name provided');
    return;
  }

  var action = new Action(request.body.name);

  try {
    Actions.add(action);
  } catch(e) {
    response.status(400).send('Invalid action name');
  }

  response.status(201).json(action.getDescription());
});

/**
 * Handle getting a list of actions.
 */
ActionsController.get('/', function(request, response) {
  response.status(200).json(Actions.getAll());
});

/**
 * Handle cancelling an action.
 */
ActionsController.delete('/:actionId', function(request, response) {
  var actionId = request.params.actionId;
  try {
    Actions.remove(actionId);
  } catch(e) {
    response.status(404).send('Action ""' + actionId + '" not found.');
    return;
  }
  response.status(204).send();
});

module.exports = ActionsController;
