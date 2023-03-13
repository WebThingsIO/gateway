/**
 * Properties Controller.
 *
 * Manages properties endpoints of things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express, { Request, Response } from 'express';
import { HttpErrorWithCode } from '../errors';
import Things from '../models/things';
import AddonManager from '../addon-manager';
import { Any } from 'gateway-addon/lib/schema';

function build(): express.Router {
  const controller = express.Router({ mergeParams: true }); 
  
  /**
   * Get the properties of a Thing.
   */
  controller.get('/', async (request: Request, response: Response) => {
    const thingId = request.params.thingId;

    let thing;
    try {
      thing = await Things.getThing(thingId);
    } catch (e) {
      console.error('Failed to get thing:', e);
      response.status(404).send(e);
      return;
    }

    const result: Record<string, Any> = {};
    for (const name in thing.getProperties()) {
      try {
        const value = await AddonManager.getProperty(thingId, name);
        result[name] = value;
      } catch (e) {
        console.error(`Failed to get property ${name}:`, e);
      }
    }

    response.status(200).json(result);
  });

  /**
   * Set multiple properties of a Thing.
   */
  controller.put('/', async (request: Request, response: Response) => {
    const thingId = request.params.thingId;
    if (!(typeof request.body === 'object') || request.body === null) {
      response.sendStatus(400);
      return;
    }
    // An array of promises to set each property
    const promises = [];
    for (const propertyName of Object.keys(request.body)) {
      promises.push(Things.setThingProperty(thingId, propertyName, request.body[propertyName]));
    }
    Promise.all(promises)
      .then(() => {
        // Respond with success code if all properties set successfully
        response.sendStatus(204);
      })
      .catch((err) => {
        // Otherwise send an error response
        console.error('Error setting property:', err);
        response.sendStatus(500);
      });
  });

  /**
   * Get a property of a Thing.
   */
  controller.get('/:propertyName', async (request: Request, response: Response) => {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    try {
      const value = await Things.getThingProperty(thingId, propertyName);
      response.status(200).json(value);
    } catch (err) {
      response.status((err as HttpErrorWithCode).code).send((err as HttpErrorWithCode).message);
    }
  });

  /**
   * Set a property of a Thing.
   */
  controller.put('/:propertyName', async (request: Request, response: Response) => {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    if (typeof request.body === 'undefined') {
      response.sendStatus(400);
      return;
    }
    const value = request.body;
    try {
      await Things.setThingProperty(thingId, propertyName, value);
      response.sendStatus(204);
    } catch (err) {
      console.error('Error setting property:', err);
      response
        .status((err as HttpErrorWithCode).code || 500)
        .send((err as HttpErrorWithCode).message);
    }
  });

  return controller;
}

export default build;
