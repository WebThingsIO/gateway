/**
 * Metrics Controller.
 *
 * Manages HTTP requests to /metrics.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Metrics = require('../models/metrics');
const Constants = require('../constants');
const PromiseRouter = require('express-promise-router');

const MetricsController = PromiseRouter();

/**
 * Get all the metrics
 */
MetricsController.get('/', async (request, response) => {
  // if (request.jwt.payload.role !== Constants.USER_TOKEN) {
  //   if (!request.jwt.payload.scope) {
  //     response.status(400).send('Token must contain scope');
  //   } else {
  //     const scope = request.jwt.payload.scope;
  //     if (scope.indexOf(' ') === -1 && scope.indexOf('/') == 0 &&
  //       scope.split('/').length == 2 &&
  //       scope.split(':')[0] === Constants.THINGS_PATH) {
  //       Metrics.getThingDescriptions(request.get('Host'), request.secure)
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
  //       Metrics.getListThingDescriptions(hrefs,
  //                                       request.get('Host'),
  //                                       request.secure)
  //         .then((things) => {
  //           response.status(200).json(things);
  //         });
  //     }
  //   }
  // } else
  const metrics = await Metrics.getAll();
  response.status(200).json(metrics);
});

/**
 * Get a historical list of the values of all a Thing's properties
 */
MetricsController.get(`${Constants.THINGS_PATH}/:thingId`, async (request, response) => {
  const id = request.params.thingId;
  try {
    const metrics = await Metrics.get(id);
    response.status(200).json(metrics);
  } catch (error) {
    console.error(`Error getting metrics for thing with id ${id}`);
    console.error(`Error: ${error}`);
    response.status(404).send(error);
  }
});

/**
 * Get a historical list of the values of a Thing's property
 */
MetricsController.get(
  `${Constants.THINGS_PATH}/:thingId/${Constants.PROPERTIES_PATH}/:propertyName`,
  async (request, response) => {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    try {
      const values = await Metrics.getProperty(thingId, propertyName);
      const result = {};
      result[propertyName] = values;
      response.status(200).json(result);
    } catch (err) {
      response.status(err.code).send(err.message);
    }
  });

module.exports = MetricsController;

