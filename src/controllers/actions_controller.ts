/**
 * Actions Controller.
 *
 * Manages the top level actions queue for the gateway and things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import {AddonManager} from '../addon-manager';
import Action from '../models/action';

export default function ActionsController(addonManager: AddonManager): express.Router {
  const router = express.Router({mergeParams: true});
  /**
 * Handle creating a new action.
 */
  router.post('/', async (request, response) => {
    const keys = Object.keys(request.body);
    if (keys.length != 1) {
      const err = 'Incorrect number of parameters.';
      console.log(err, request.body);
      response.status(400).send(err);
      return;
    }

    const actionName = keys[0];

    if (!Object.prototype.hasOwnProperty.call(request.body[actionName],
                                              'input')) {
      response.status(400).send('Missing input');
      return;
    }

    const actionParams = request.body[actionName].input;
    const thingId = request.params.thingId;
    let action = null;

    if (thingId) {
      try {
        const thing = await addonManager.getThingsCollection().getThing(thingId);
        const actionId = addonManager
          .getActionsCollection()
          .generateId();
        action = new Action(actionId, actionName, actionParams, thing);
      } catch (e) {
        console.error('Thing does not exist', thingId, e);
        response.status(404).send(e);
        return;
      }
    } else {
      const actionId = addonManager
        .getActionsCollection()
        .generateId();
      action = new Action(actionId, actionName, actionParams);
    }

    try {
      if (thingId) {
        await addonManager.requestAction(
          thingId, action.getId(), actionName, actionParams);
      }
      await addonManager.getActionsCollection().add(action);

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
  router.get('/', (request, response) => {
    if (request.params.thingId) {
      response.status(200).json(addonManager
        .getActionsCollection().getByThing(request.params.thingId));
    } else {
      response.status(200).json(addonManager.getActionsCollection().getGatewayActions());
    }
  });

  /**
 * Handle getting a list of actions.
 */
  router.get('/:actionName', (request, response) => {
    const actionName = request.params.actionName;
    if (request.params.thingId) {
      response.status(200).json(addonManager
        .getActionsCollection().getByThing(request.params.thingId,
                                           actionName));
    } else {
      response.status(200).json(addonManager.getActionsCollection().getGatewayActions(actionName));
    }
  });

  /**
 * Handle creating a new action.
 */
  router.post('/:actionName', async (request, response) => {
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

    if (!Object.prototype.hasOwnProperty.call(request.body[actionName],
                                              'input')) {
      response.status(400).send('Missing input');
      return;
    }

    const actionParams = request.body[actionName].input;
    const thingId = request.params.thingId;
    let action = null;

    if (thingId) {
      try {
        const thing = await addonManager.getThingsCollection().getThing(thingId);
        const actionId = addonManager
          .getActionsCollection()
          .generateId();
        action = new Action(actionId, actionName, actionParams, thing);
      } catch (e) {
        console.error('Thing does not exist', thingId, e);
        response.status(404).send(e);
        return;
      }
    } else {
      const actionId = addonManager
        .getActionsCollection()
        .generateId();
      action = new Action(actionId, actionName, actionParams);
    }

    try {
      if (thingId) {
        await addonManager.requestAction(
          thingId, action.getId(), actionName, actionParams);
      }
      await addonManager.getActionsCollection().add(action);

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
  router.get('/:actionName/:actionId', (request, response) => {
    const actionId = request.params.actionId;
    const action = addonManager.getActionsCollection().get(actionId);
    if (action) {
      response.status(200).json({[action.getName()]: action.getDescription()});
    } else {
      const error = `Action "${actionId}" not found`;
      console.error(error);
      response.status(404).send(error);
    }
  });

  /**
 * Handle cancelling an action.
 */
  router.delete(
    '/:actionName/:actionId',
    async (request, response) => {
      const actionName = request.params.actionName;
      const actionId = request.params.actionId;
      const thingId = request.params.thingId;

      if (thingId) {
        try {
          await addonManager.removeAction(thingId, actionId, actionName);
        } catch (e) {
          console.error('Removing action', actionId, 'failed');
          console.error(e);
          response.status(400).send(e);
          return;
        }
      }

      try {
        addonManager.getActionsCollection().remove(actionId);
      } catch (e) {
        console.error('Removing action', actionId, 'failed');
        console.error(e);
        response.status(404).send(e);
        return;
      }

      response.sendStatus(204);
    }
  );

  return router;
}
