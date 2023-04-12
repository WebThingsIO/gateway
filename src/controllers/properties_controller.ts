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
import Thing from '../models/thing';
import { Property } from 'gateway-addon';
import AddonManager from '../addon-manager';
import * as Constants from '../constants';
import { Any } from 'gateway-addon/lib/schema';

function build(): express.Router {
  const controller = express.Router({ mergeParams: true });

  /**
   * Read or observe all properties of a Thing.
   */
  controller.get('/', async (request: Request, response: Response) => {
    // Serve either an event stream or a JSON response depending on requested content type
    if (request.accepts('text/event-stream')) {
      openPropertyStream(request, response);
    } else {
      sendProperties(request, response);
    }
  });

  /**
   * Write multiple properties of a Thing.
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
   * Read or observe a property of a Thing.
   */
  controller.get('/:propertyName', async (request: Request, response: Response) => {
    // Serve either an event stream or a JSON response depending on requested content type
    if (request.accepts('text/event-stream')) {
      openPropertyStream(request, response);
    } else {
      sendProperty(request, response);
    }
  });

  /**
   * Write a property of a Thing.
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

  /**
   * Open an event stream to observe a property or properties.
   *
   * @param {express.Request} request
   * @param {express.Response} response
   * @return {Promise}
   */
  async function openPropertyStream(
    request: express.Request,
    response: express.Response
  ): Promise<void> {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    let thing: Thing | undefined;

    // For now don't allow event streams for properties not associated with a Thing
    if (!thingId) {
      response.status(406).send();
      return;
    }

    // Check requested thing exists
    try {
      thing = await Things.getThing(thingId);
    } catch (error: unknown) {
      console.error(`Thing not found ${error}`);
      response.status(404).send();
      return;
    }

    // Check that requested property (if any) exists
    if (propertyName && !thing.getProperties()[propertyName]) {
      response.status(404).send();
      return;
    }

    // Keep the socket open
    request.socket.setKeepAlive(true);
    // Prevent Nagle's algorithm from trying to optimise throughput
    request.socket.setNoDelay(true);
    // Disable inactivity timeout on the socket
    request.socket.setTimeout(0);

    // Set event stream content type
    response.setHeader('Content-Type', 'text/event-stream');
    // Disable caching and compression
    response.setHeader('Cache-Control', 'no-cache,no-transform');
    // Tell client to keep the connection alive
    response.setHeader('Connection', 'keep-alive');
    // Set 200 OK response
    response.status(200);
    // Send headers to complete the connection, but don't end the response
    response.flushHeaders();

    /**
     * Handle a property reading emitted by a Thing
     *
     * @param {PropertyReading} propertyReading The value of a property at an instant in time.
     * @returns {Promise<void>}
     */
    async function onPropertyChange(propertyReading: Property<Any>): Promise<void> {
      // Filter out readings which don't belong to this Thing
      if (propertyReading.getDevice().getId() !== thingId) {
        return;
      }

      // Filter out readings which don't belong to the requested property, if specified
      if (propertyName && propertyReading.getName() !== propertyName) {
        return;
      }

      // Generate an ISO 8601 date time string as an ID
      const propertyReadingId = new Date().toISOString();

      const propertyValue = await propertyReading.getValue();

      // Push event to client via event stream
      response.write(`id: ${propertyReadingId}\n`);
      response.write(`event: ${propertyReading.getName()}\n`);
      response.write(`data: ${JSON.stringify(propertyValue)}\n\n`);
    }

    // Subscribe to property change events
    AddonManager.on(Constants.PROPERTY_CHANGED, onPropertyChange);

    // Unsubscribe from events if the connection is closed
    response.on('close', function () {
      AddonManager.removeListener(Constants.PROPERTY_CHANGED, onPropertyChange);
    });
  }

  /**
   * Respond with a property value in JSON.
   *
   * @param {express.Request} request
   * @param {express.Response} response
   * @returns {Promise<void>}
   */
  async function sendProperty(request: express.Request, response: express.Response): Promise<void> {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    try {
      const value = await Things.getThingProperty(thingId, propertyName);
      response.status(200).json(value);
    } catch (err) {
      response.status((err as HttpErrorWithCode).code).send((err as HttpErrorWithCode).message);
    }
  }

  /**
   * Respond with all property values in JSON.
   *
   * @param {express.Request} request
   * @param {express.Response} response
   * @returns {Promise<void>}
   */
  async function sendProperties(
    request: express.Request,
    response: express.Response
  ): Promise<void> {
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
  }

  return controller;
}

export default build;
