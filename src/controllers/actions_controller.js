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

const PromiseRouter = require('express-promise-router');
var Action = require('../models/action');
var Actions = require('../models/actions');
var Things = require('../models/things');

const ActionsController = PromiseRouter({mergeParams: true});

/**
 * Handle creating a new action.
 */
ActionsController.post('/', async (request, response) => {
  if (!request.body.name) {
    response.status(400).send('No action name provided');
    return;
  }

  var actionName = request.body.name;
  var actionParams = request.body.parameters;
  var action = null;
  var thingId = request.params.thingId;
  if (thingId) {
    try {
      var thing = await Things.getThing(thingId);
      action = new Action(actionName, actionParams, thing);
    } catch(e) {
      console.error('Thing does not exist', thingId, e);
      response.status(400).send(e);
      return;
    }
  } else {
    action = new Action(actionName, actionParams);
  }

  try {
    await Actions.add(action);
    response.status(201).json(action.getDescription());
  } catch(e) {
    console.error('Creating action', actionName, 'failed');
    console.error(e);
    response.status(400).send(e);
  }
});

/**
 * Handle getting a list of actions.
 */
ActionsController.get('/', function(request, response) {
  if (request.params.thingId) {
    response.status(200).json(Actions.getByThing(request.params.thingId));
  } else {
    response.status(200).json(Actions.getUnassociated());
  }
});

/**
 * Handle getting a particular action.
 */
ActionsController.get('/:actionId', function(request, response) {
  var actionId = request.params.actionId;
  var action =  Actions.get(actionId);
  if (action) {
    response.status(200).json(action);
  } else {
    var error = 'Action "' + actionId + '" not found';
    console.error(error);
    response.status(404).send(error);
  }
});

/**
 * Handle cancelling an action.
 */
ActionsController.delete('/:actionId', function(request, response) {
  var actionId = request.params.actionId;
  try {
    Actions.remove(actionId);
  } catch(e) {
    console.error('Removing action', actionId, 'failed');
    console.error(e);
    response.status(404).send(e);
    return;
  }
  response.status(204).send();
});

module.exports = ActionsController;
