/**
 * Push API Controller.
 *
 * Implements the Push API for notifications to use
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const PromiseRouter = require('express-promise-router');
const PushService = require('../push-service');

const PushController = PromiseRouter();

/**
 * Handle requests for the public key
 */
PushController.get('/vapid-public-key', async (request, response) => {
  const vapid = await PushService.getVAPIDKeys();
  if (!vapid) {
    response.status(500).json({error: 'vapid not configured'});
    return;
  }
  response.status(200).json({publicKey: vapid.publicKey});
});

PushController.post('/register', async (request, response) => {
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

module.exports = PushController;
