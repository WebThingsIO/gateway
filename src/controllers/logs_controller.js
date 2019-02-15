/**
 * Logs Controller.
 *
 * Manages HTTP requests to /logs.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const PromiseRouter = require('express-promise-router');
const WebSocket = require('ws');

const AddonManager = require('../addon-manager');
const Constants = require('../constants');
const Logs = require('../models/logs');

const LogsController = PromiseRouter();

/**
 * Get all the currently logged properties
 */
LogsController.get('/', async (request, response) => {
  // if (request.jwt.payload.role !== Constants.USER_TOKEN) {
  //   if (!request.jwt.payload.scope) {
  //     response.status(400).send('Token must contain scope');
  //   } else {
  //     const scope = request.jwt.payload.scope;
  //     if (scope.indexOf(' ') === -1 && scope.indexOf('/') == 0 &&
  //       scope.split('/').length == 2 &&
  //       scope.split(':')[0] === Constants.THINGS_PATH) {
  //       Things.getThingDescriptions(request.get('Host'), request.secure)
  //         .then((things) => {
  //           response.status(200).json(things);
  //         });
  //     } else {
  //       // Get hrefs of things in scope
  //       const paths = scope.split(' ');
  //       const hrefs = new Array(0);
  //       for (const path of paths) {
  //         const parts = path.split(':');
  //         hrefs.push(parts[0]);
  //       }
  //       Things.getListThingDescriptions(hrefs,
  //                                       request.get('Host'),
  //                                       request.secure)
  //         .then((things) => {
  //           response.status(200).json(things);
  //         });
  //     }
  //   }
  // } else
  const logs = await Logs.getAll();
  response.status(200).json(logs);
});

/**
 * Get a historical list of the values of all a Thing's properties
 */
LogsController.get(`${Constants.THINGS_PATH}/:thingId`, async (request, response) => {
  const id = request.params.thingId;
  try {
    const logs = await Logs.get(id);
    response.status(200).json(logs);
  } catch (error) {
    console.error(`Error getting logs for thing with id ${id}`);
    console.error(`Error: ${error}`);
    response.status(404).send(error);
  }
});

const singlePropertyPath =
  `${Constants.THINGS_PATH}/:thingId${Constants.PROPERTIES_PATH}/:propertyName`;
/**
 * Get a historical list of the values of a Thing's property
 */
LogsController.get(singlePropertyPath, async (request, response) => {
  const thingId = request.params.thingId;
  const propertyName = request.params.propertyName;
  try {
    const values = await Logs.getProperty(thingId, propertyName);
    response.status(200).json(values || []);
  } catch (err) {
    response.status(404).send(err);
  }
});

LogsController.ws('/', (websocket) => {
  if (websocket.readyState !== WebSocket.OPEN) {
    return;
  }

  const heartbeat = setInterval(() => {
    try {
      websocket.ping();
    } catch (e) {
      websocket.terminate();
    }
  }, 30 * 1000);

  function onLog(message) {
    websocket.send(JSON.stringify(message), (err) => {
      if (err) {
        console.error('WebSocket sendMessage failed:', err);
      }
    });
  }

  AddonManager.pluginServer.on('log', onLog);

  const cleanup = () => {
    AddonManager.pluginServer.removeListener('log', onLog);
    clearInterval(heartbeat);
  };

  websocket.on('error', cleanup);
  websocket.on('close', cleanup);
});

module.exports = LogsController;
