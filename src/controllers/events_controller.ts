/**
 * Events Controller.
 *
 * Manages events endpoints for the gateway and things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express, { Request, Response } from 'express';
import Things from '../models/things';
import Thing from '../models/thing';
import Events from '../models/events';
import Event from '../models/event';

function build(): express.Router {
  const controller = express.Router({ mergeParams: true });

  /**
   * Handle getting events of all types.
   */
  controller.get('/', (request: Request, response: Response) => {
    // Serve either an event stream or a log depending on requested content type
    if (request.accepts('text/event-stream')) {
      openEventStream(request, response);
    } else {
      sendEventLog(request, response);
    }
  });

  /**
   * Handle getting events of a specific type.
   */
  controller.get('/:eventName', (request: Request, response: Response) => {
    // Serve either an event stream or a log depending on requested content type
    if (request.accepts('text/event-stream')) {
      openEventStream(request, response);
    } else {
      sendEventLog(request, response);
    }
  });

  /**
   * Open a Server-Sent Events event stream to push events to the client.
   *
   * @param {express.Request} request
   * @param {express.Response} response
   * @return {Promise}
   */
  async function openEventStream(
    request: express.Request,
    response: express.Response
  ): Promise<void> {
    const thingID = request.params.thingId;
    const eventName = request.params.eventName;
    let thing: Thing | undefined;

    // Don't allow event streams for events not associated with a Thing
    if (!thingID) {
      response.status(406).send();
      return;
    }

    // Check requested thing exists
    try {
      thing = await Things.getThing(thingID);
    } catch (error: unknown) {
      console.error(`Thing not found ${error}`);
      response.status(404).send();
      return;
    }

    // Check that requested event type (if any) exists
    if (eventName && !thing.getEvents()[eventName]) {
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
     * Handle an event emitted by a Thing
     *
     * @param {Event} event
     */
    function onEvent(event: Event): void {
      // If subscribed to a particular event, filter others out
      if (eventName && eventName != event.getName()) {
        return;
      }

      // Generate an ISO 8601 date time string as an ID
      const eventId = new Date().toISOString();

      // Push event to client via event stream
      response.write(`id: ${eventId}\n`);
      response.write(`event: ${event.getName()}\n`);
      response.write(`data: ${JSON.stringify(event.getData())}\n\n`);
    }

    // Subscribe to events from the specified Thing
    thing.addEventSubscription(onEvent);

    // Unsubscribe from events if the connection is closed
    response.on('close', function () {
      thing!.removeEventSubscription(onEvent);
    });
  }

  /**
   * Respond with a log of events.
   *
   * @param {express.Request} request
   * @param {express.Response} response
   */
  function sendEventLog(request: express.Request, response: express.Response): void {
    const eventName = request.params.eventName;
    if (request.params.thingId) {
      response.status(200).json(Events.getByThing(request.params.thingId, eventName));
    } else {
      response.status(200).json(Events.getGatewayEvents(eventName));
    }
  }

  return controller;
}

export default build;
