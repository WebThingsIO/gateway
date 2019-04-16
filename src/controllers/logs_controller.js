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

const Constants = require('../constants');
const Logs = require('../models/logs');

const LogsController = PromiseRouter();

/**
 * Get a list of all currently logged properties
 */
LogsController.get('/.schema', async (request, response) => {
  const schema = await Logs.getSchema();
  response.status(200).json(schema);
});

/**
 * Register a new metric
 */
LogsController.post('/', async (request, response) => {
  const descr = request.body.descr;
  const maxAge = request.body.maxAge;
  if (!descr || typeof maxAge !== 'number') {
    response.status(400).send('Invalid descr or maxAge property');
    return;
  }
  let normalizedDescr = '';
  switch (descr.type) {
    case 'property':
      normalizedDescr = Logs.propertyDescr(descr.thing, descr.property);
      break;
    case 'action':
      normalizedDescr = Logs.actionDescr(descr.thing, descr.action);
      break;
    case 'event':
      normalizedDescr = Logs.eventDescr(descr.thing, descr.event);
      break;
    default:
      response.status(400).send('Invalid descr type');
      return;
  }

  try {
    const id = await Logs.registerMetric(normalizedDescr, maxAge);
    if (typeof id === 'undefined') {
      response.status(400).send('Log already exists');
      return;
    }
    response.status(200).send({
      descr: normalizedDescr,
    });
  } catch (e) {
    response.status(500).send(`Error registering: ${e.message}`);
  }
});

/**
 * Get all the values of the currently logged properties
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
  const logs = await Logs.getAll(request.query.start, request.query.end);
  response.status(200).json(logs);
});

/**
 * Get a historical list of the values of all a Thing's properties
 */
LogsController.get(`${Constants.THINGS_PATH}/:thingId`, async (request, response) => {
  const id = request.params.thingId;
  try {
    const logs = await Logs.get(id, request.query.start, request.query.end);
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
    const values = await Logs.getProperty(thingId, propertyName,
                                          request.query.start,
                                          request.query.end);
    response.status(200).json(values || []);
  } catch (err) {
    response.status(404).send(err);
  }
});

LogsController.delete(singlePropertyPath, async (request, response) => {
  const thingId = request.params.thingId;
  const propertyName = request.params.propertyName;
  const normalizedDescr = Logs.propertyDescr(thingId, propertyName);

  try {
    await Logs.unregisterMetric(normalizedDescr);
    response.status(200).send({
      descr: normalizedDescr,
    });
  } catch (e) {
    response.status(500).send(`Internal error: ${e}`);
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

  function streamMetric(metrics) {
    if (!metrics || metrics.length === 0) {
      return;
    }
    try {
      websocket.send(JSON.stringify(metrics), (_err) => {});
    } catch (_e) {
      // Just don't let it crash anything
    }
  }

  const cleanup = () => {
    clearInterval(heartbeat);
  };

  Logs.streamAll(streamMetric).then(() => {
    cleanup();
    // Eventually send dynamic property value updates for the graphs to update
    // in real time
    websocket.close();
  });

  websocket.on('error', cleanup);
  websocket.on('close', cleanup);
});
module.exports = LogsController;
