/**
 * Actions Controller.
 *
 * Manages the top level actions queue for the gateway and things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express, { Request, Response } from 'express';
import Action from '../models/action';
import Actions from '../models/actions';
import Things from '../models/things';
import AddonManager from '../addon-manager';

function build(): express.Router {
  const controller = express.Router({ mergeParams: true });

  /**
   * Handle creating a new action.
   */
  controller.post('/', async (request: Request, response: Response) => {
    console.warn('Invoking an action without the action name in the URL is deprecated');
    const keys = Object.keys(request.body);
    if (keys.length != 1) {
      const err = 'Incorrect number of parameters.';
      console.log(err, request.body);
      response.status(400).send();
      return;
    }

    const actionName = keys[0];

    if (!Object.prototype.hasOwnProperty.call(request.body[actionName], 'input')) {
      response.status(400).send();
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
        response.status(404).send();
        return;
      }
    } else {
      action = new Action(actionName, actionParams);
    }

    try {
      if (thingId) {
        await AddonManager.requestAction(thingId, action.getId(), actionName, actionParams);
      }
      await Actions.add(action);
      response.location(action.getDescription().href);
      response.status(201).json(action.getDescription());
    } catch (e) {
      console.error('Creating action', actionName, 'failed');
      console.error(e);
      response.status(400).send();
    }
  });

  /**
   * Handle getting a list of all actions.
   */
  controller.get('/', (request: Request, response: Response) => {
    if (request.params.thingId) {
      response.status(200).json(Actions.getAllActionsByThing(request.params.thingId));
    } else {
      response.status(200).json(Actions.getAllGatewayActions());
    }
  });

  /**
   * Handle getting a list of actions for a given action name (deprecated).
   */
  controller.get('/:actionName', (request: Request, response: Response) => {
    console.warn(
      'Getting a list of actions by action name is deprecated, ' +
        'please use the main /actions endpoint'
    );
    const actionName = request.params.actionName;
    if (request.params.thingId) {
      response.status(200).json(Actions.getByThing(request.params.thingId, actionName));
    } else {
      response.status(200).json(Actions.getGatewayActions(actionName));
    }
  });

  /**
   * Handle creating a new action.
   */
  controller.post('/:actionName', async (request: Request, response: Response) => {
    const actionName = request.params.actionName;
    const input = request.body;
    const thingId = request.params.thingId;
    let action = null;

    if (thingId) {
      try {
        const thing = await Things.getThing(thingId);
        action = new Action(actionName, input, thing);
      } catch (e) {
        console.error('Thing does not exist', thingId, e);
        response.status(404).send();
        return;
      }
    } else {
      action = new Action(actionName, input);
    }

    try {
      if (thingId) {
        await AddonManager.requestAction(thingId, action.getId(), actionName, input);
      }
      await Actions.add(action);
      response.location(action.getDescription().href);
      response.status(201).json(action.getDescription());
    } catch (e) {
      console.error('Creating action', actionName, 'failed.');
      console.error(e);
      response.status(400).send();
    }
  });

  /**
   * Handle getting a particular action.
   */
  controller.get('/:actionName/:actionId', (request, response) => {
    const actionId = request.params.actionId;
    const action = Actions.get(actionId);
    if (action) {
      response.status(200).json(action.getDescription());
    } else {
      console.error(`Action "${actionId}" not found`);
      response.status(404).send();
    }
  });

  /**
   * Handle cancelling an action.
   */
  controller.delete('/:actionName/:actionId', async (request: Request, response: Response) => {
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

    response.sendStatus(204);
  });

  return controller;
}

export default build;
