/**
 * Push API Controller.
 *
 * Implements the Push API for notifications to use
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import PushService from '../push-service';

export default function PushController(): express.Router {
  const router = express.Router();

  /**
 * Handle requests for the public key
 */
  router.get('/vapid-public-key', async (_request, response) => {
    const vapid = await PushService.getVAPIDKeys();
    if (!vapid) {
      response.status(500).json({error: 'vapid not configured'});
      return;
    }
    response.status(200).json({publicKey: vapid.publicKey});
  });

  router.post('/register', async (request, response) => {
    const subscription = request.body.subscription;
    try {
      await PushService.createPushSubscription(subscription);
    } catch (err) {
      console.error(`PushController: Failed to register ${subscription}`, err);
      response.status(500).json({error: 'register failed'});
      return;
    }
    response.status(200).json({});
  });

  return router;
}
