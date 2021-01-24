/**
 * Logs Controller.
 *
 * Manages HTTP requests to /logs.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';
import * as Constants from '../constants';
import Logs from '../models/logs';

function build(): express.Router {
  const controller: express.Router & expressWs.WithWebsocketMethod = express.Router();

  /**
   * Get a list of all currently logged properties
   */
  controller.get('/.schema', async (_request, response) => {
    const schema = await Logs.getSchema();
    response.status(200).json(schema);
  });

  /**
   * Register a new metric
   */
  controller.post('/', async (request, response) => {
    const descr = request.body.descr;
    const maxAge = request.body.maxAge;
    if (!descr || typeof maxAge !== 'number') {
      response.status(400).send('Invalid descr or maxAge property');
      return;
    }

    let normalizedDescr;
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
      if (id === null) {
        response.status(400).send('Log already exists');
        return;
      }

      response.status(200).send({
        descr: normalizedDescr,
      });
    } catch (e) {
      console.error('Failed to register log:', e);
      response.status(500).send(`Error registering: ${e.message}`);
    }
  });

  /**
   * Get all the values of the currently logged properties
   */
  controller.get('/', async (request, response) => {
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
    const start = 'start' in request.query ? parseInt(`${request.query.start}`, 10) : null;
    const end = 'end' in request.query ? parseInt(`${request.query.end}`, 10) : null;
    try {
      const logs = await Logs.getAll(start, end);
      response.status(200).json(logs);
    } catch (e) {
      console.error('Failed to get logs:', e);
      response.status(500).send(`Internal error: ${e}`);
    }
  });

  /**
   * Get a historical list of the values of all a Thing's properties
   */
  controller.get(`${Constants.THINGS_PATH}/:thingId`, async (request, response) => {
    const id = request.params.thingId;
    const start = 'start' in request.query ? parseInt(`${request.query.start}`, 10) : null;
    const end = 'end' in request.query ? parseInt(`${request.query.end}`, 10) : null;
    try {
      const logs = await Logs.get(id, start, end);
      response.status(200).json(logs);
    } catch (error) {
      console.error(`Error getting logs for thing with id ${id}`);
      console.error(`Error: ${error}`);
      response.status(404).send(error);
    }
  });

  const missingPropertyPath =
    `${Constants.THINGS_PATH}/:thingId${Constants.PROPERTIES_PATH}`;
  const singlePropertyPath =
    `${Constants.THINGS_PATH}/:thingId${Constants.PROPERTIES_PATH}/:propertyName`;

  /**
   * Get a historical list of the values of a Thing's property
   */
  controller.get(
    [missingPropertyPath, singlePropertyPath],
    async (request, response) => {
      const thingId = request.params.thingId;
      const propertyName = request.params.propertyName || '';
      const start = 'start' in request.query ? parseInt(`${request.query.start}`, 10) : null;
      const end = 'end' in request.query ? parseInt(`${request.query.end}`, 10) : null;
      try {
        const values = await Logs.getProperty(thingId, propertyName, start, end);
        response.status(200).json(values || []);
      } catch (err) {
        response.status(404).send(err);
      }
    }
  );

  controller.delete(
    [missingPropertyPath, singlePropertyPath],
    async (request, response) => {
      const thingId = request.params.thingId;
      const propertyName = request.params.propertyName || '';
      const normalizedDescr = Logs.propertyDescr(thingId, propertyName);

      try {
        await Logs.unregisterMetric(normalizedDescr);
        response.status(200).send({
          descr: normalizedDescr,
        });
      } catch (e) {
        console.error('Failed to delete log:', e);
        response.status(500).send(`Internal error: ${e}`);
      }
    }
  );

  controller.ws('/', (websocket: WebSocket) => {
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

    function streamMetric(metrics: any[]): void {
      if (!metrics || metrics.length === 0) {
        return;
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        websocket.send(JSON.stringify(metrics), () => {});
      } catch (_e) {
        // Just don't let it crash anything
      }
    }

    const cleanup = (): void => {
      clearInterval(heartbeat);
    };

    Logs.streamAll(streamMetric, null, null).then(() => {
      cleanup();
      // Eventually send dynamic property value updates for the graphs to update
      // in real time
      websocket.close();
    });

    websocket.on('error', cleanup);
    websocket.on('close', cleanup);
  });

  return controller;
}

export default build;
