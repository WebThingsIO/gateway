/**
 * Events Controller.
 *
 * Manages the top level events queue for the gateway and things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import {AddonManager} from '../addon-manager';

export default function EventsController(addonManager: AddonManager): express.Router {
  const router = express.Router({mergeParams: true});
  /**
 * Handle getting a list of events.
 */
  router.get('/', (request, response) => {
    if (request.params.thingId) {
      response.status(200).json(addonManager
        .getEventsCollection().getByThing(request.params.thingId));
    } else {
      response.status(200).json(addonManager
        .getEventsCollection().getGatewayEvents());
    }
  });

  /**
 * Handle getting a list of events.
 */
  router.get('/:eventName', (request, response) => {
    const eventName = request.params.eventName;

    if (request.params.thingId) {
      response.status(200).json(addonManager
        .getEventsCollection().getByThing(request.params.thingId,
                                          eventName));
    } else {
      response.status(200).json(addonManager
        .getEventsCollection().getGatewayEvents(eventName));
    }
  });

  return router;
}
