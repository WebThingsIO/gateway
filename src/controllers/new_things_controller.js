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

'use strict';

const PromiseRouter = require('express-promise-router');
const fetch = require('node-fetch');
const WebSocket = require('ws');
const Things = require('../models/things');

const NewThingsController = PromiseRouter();

/**
 * Handle GET requests to /new_things
 */
NewThingsController.get('/', (request, response) => {
  Things.getNewThings().then(newThings => {
    response.json(newThings);
  }).catch(error => {
    console.error(`Error getting a list of new things from adapters ${error}`);
    response.status(500).send(error);
  });
});

/**
 * Handle a WebSocket request on /new_things
 */
NewThingsController.ws('/', websocket => {
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
  Things.getNewThings().then(function(newThings) {
    newThings.forEach(newThing => {
      websocket.send(JSON.stringify(newThing));
    }, this);
  }).catch(error => {
    console.error(`Error getting a list of new things from adapters ${error}`);
  });
});

/**
 * Handle POST requests to /new_things
 */
NewThingsController.post('/', async (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('url')) {
    response.status(400).send('No URL in thing description');
    return;
  }

  const url = request.body.url;
  try {
    const res = await fetch(url, {headers: {Accept: 'application/json'}});

    if (!res.ok) {
      response.status(400).send('Web thing not found');
      return;
    }

    const description = await res.json();

    // Verify some high level thing description properties.
    if (description.hasOwnProperty('name') &&
        (description.hasOwnProperty('type') ||
         description.hasOwnProperty('@type')) &&
        description.hasOwnProperty('properties')) {
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

module.exports = NewThingsController;
