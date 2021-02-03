/**
 * New Things Controller.
 *
 * /new_things returns a list of Things connected/paired with the gateway which
 * haven't yet been added to the gateway database.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import expressWs from 'express-ws';
import fetch from 'node-fetch';
import WebSocket from 'ws';
import Things from '../models/things';
import { Device as DeviceSchema } from 'gateway-addon/lib/schema';

function build(): express.Router {
  const controller: express.Router & expressWs.WithWebsocketMethod = express.Router();

  /**
   * Handle GET requests to /new_things
   */
  controller.get('/', (_request, response) => {
    Things.getNewThings()
      .then((newThings: DeviceSchema[]) => {
        response.json(newThings);
      })
      .catch((error: unknown) => {
        console.error(`Error getting a list of new things from adapters ${error}`);
        response.status(500).send(error);
      });
  });

  /**
   * Handle a WebSocket request on /new_things
   */
  controller.ws('/', (websocket: WebSocket) => {
    // Since the Gateway have the asynchronous express middlewares, there is a
    // possibility that the WebSocket have been closed.
    if (websocket.readyState !== WebSocket.OPEN) {
      return;
    }
    console.log('Opened a new things socket');
    // Register the WebSocket with the Things model so new devices can be pushed
    // to the client as they are added.
    Things.registerWebsocket(websocket);
    // Send a list of things the adapter manager already knows about
    Things.getNewThings()
      .then((newThings: DeviceSchema[]) => {
        newThings.forEach((newThing: DeviceSchema) => {
          websocket.send(JSON.stringify(newThing));
        });
      })
      .catch((error: unknown) => {
        console.error(`Error getting a list of new things from adapters ${error}`);
      });
  });

  /**
   * Handle POST requests to /new_things
   */
  controller.post('/', async (request, response) => {
    if (!request.body || !request.body.hasOwnProperty('url')) {
      response.status(400).send('No URL in thing description');
      return;
    }

    const url = request.body.url;
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        response.status(400).send('Web thing not found');
        return;
      }

      const description = await res.json();

      // Verify some high level thing description properties.
      if (
        (description.hasOwnProperty('title') || description.hasOwnProperty('name')) &&
        (description.hasOwnProperty('properties') ||
          description.hasOwnProperty('actions') ||
          description.hasOwnProperty('events'))
      ) {
        response.json(description);
      } else if (Array.isArray(description)) {
        response.status(400).send('Web things must be added individually');
      } else {
        response.status(400).send('Invalid thing description');
      }
    } catch (e) {
      response.status(400).send('Web thing not found');
    }
  });

  return controller;
}

export default build;
