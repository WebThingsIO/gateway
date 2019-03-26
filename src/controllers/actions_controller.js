/**
 * Actions Controller.
 *
 * Manages the top level actions queue for the gateway and things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const PromiseRouter = require('express-promise-router');
const Action = require('../models/action');
const Actions = require('../models/actions');
const AddonManager = require('../addon-manager');
const Things = require('../models/things');

const ActionsController = PromiseRouter({mergeParams: true});

/**
 * Handle creating a new action.
 */
ActionsController.post('/', async (request, response) => {
  const keys = Object.keys(request.body);
  if (keys.length != 1) {
    const err = 'Incorrect number of parameters.';
    console.log(err, request.body);
    response.status(400).send(err);
    return;
  }

  const actionName = keys[0];
  const actionParams = request.body[actionName].input;
  const thingId = request.params.thingId;
  let action = null;

  if (thingId) {
    try {
      const thing = await Things.getThing(thingId);
      action = new Action(actionName, actionParams, thing);
    } catch (e) {
      console.error('Thing does not exist', thingId, e);
      response.status(404).send(e);
      return;
    }
  } else {
    action = new Action(actionName, actionParams);
  }

  try {
    if (thingId) {
      await AddonManager.requestAction(
        thingId, action.id, actionName, actionParams);
    }
    await Actions.add(action);

    response.status(201).json({[actionName]: action.getDescription()});
  } catch (e) {
    console.error('Creating action', actionName, 'failed');
    console.error(e);
    response.status(400).send(e);
  }
});

/**
 * Handle getting a list of actions.
 */
ActionsController.get('/', (request, response) => {
  if (request.params.thingId) {
    response.status(200).json(Actions.getByThing(request.params.thingId));
  } else {
    response.status(200).json(Actions.getGatewayActions());
  }
});

/**
 * Handle getting a list of actions.
 */
ActionsController.get('/:actionName', (request, response) => {
  const actionName = request.params.actionName;
  if (request.params.thingId) {
    response.status(200).json(Actions.getByThing(request.params.thingId,
                                                 actionName));
  } else {
    response.status(200).json(Actions.getGatewayActions(actionName));
  }
});

/**
 * Handle creating a new action.
 */
ActionsController.post('/:actionName', async (request, response) => {
  const actionName = request.params.actionName;

  const keys = Object.keys(request.body);
  if (keys.length != 1) {
    const err = 'Incorrect number of parameters.';
    console.log(err, request.body);
    response.status(400).send(err);
    return;
  }

  if (actionName !== keys[0]) {
    const err = `Action name must be ${actionName}`;
    console.log(err, request.body);
    response.status(400).send(err);
    return;
  }

  const actionParams = request.body[actionName].input;
  const thingId = request.params.thingId;
  let action = null;

  if (thingId) {
    try {
      const thing = await Things.getThing(thingId);
      action = new Action(actionName, actionParams, thing);
    } catch (e) {
      console.error('Thing does not exist', thingId, e);
      response.status(404).send(e);
      return;
    }
  } else {
    action = new Action(actionName, actionParams);
  }

  try {
    if (thingId) {
      await AddonManager.requestAction(
        thingId, action.id, actionName, actionParams);
    }
    await Actions.add(action);

    response.status(201).json({[actionName]: action.getDescription()});
  } catch (e) {
    console.error('Creating action', actionName, 'failed');
    console.error(e);
    response.status(400).send(e);
  }
});

/**
 * Handle getting a particular action.
 */
ActionsController.get('/:actionName/:actionId', (request, response) => {
  const actionId = request.params.actionId;
  const action = Actions.get(actionId);
  if (action) {
    response.status(200).json({[action.name]: action.getDescription()});
  } else {
    const error = `Action "${actionId}" not found`;
    console.error(error);
    response.status(404).send(error);
  }
});

/**
 * Handle cancelling an action.
 */
ActionsController.delete(
  '/:actionName/:actionId',
  async (request, response) => {
    const actionName = request.params.actionName;
    const actionId = request.params.actionId;
    const thingId = request.params.thingId;

    if (thingId) {
      try {
        await AddonManager.removeAction(thingId, actionId, actionName);
      } catch (e) {
        console.error('Removing action', actionId, 'failed');
        console.error(e);
        response.status(400).send(e);
        return;
      }
    }

    try {
      Actions.remove(actionId);
    } catch (e) {
      console.error('Removing action', actionId, 'failed');
      console.error(e);
      response.status(404).send(e);
      return;
    }

    response.status(204).end();
  });

module.exports = ActionsController;
