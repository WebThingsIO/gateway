/**
 * Push API Controller.
 *
 * Implements the Push API for notifications to use
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const PromiseRouter = require('express-promise-router');
const WebPush = require('web-push');
const Database = require('../db');
const Settings = require('../models/settings');

const PushController = PromiseRouter();

/**
 * Initialize the Push API, generating and storing a VAPID keypair if necessary
 */
PushController.init = async () => {
  let vapid = await Settings.get('push.vapid');
  if (!vapid) {
    vapid = WebPush.generateVAPIDKeys();
    await Settings.set('push.vapid', vapid);
  }
  const {publicKey, privateKey} = vapid;

  const {tunnelDomain} = await Settings.getTunnelInfo();
  WebPush.setVapidDetails(tunnelDomain, publicKey, privateKey);
};

/**
 * Handle requests for the public key
 */
PushController.get('/vapid-public-key', async (request, response) => {
  const vapid = await Settings.get('push.vapid');
  if (!vapid) {
    response.status(500).json({error: 'vapid not configured'});
    return;
  }
  response.status(200).json({publicKey: vapid.publicKey});
});

PushController.post('/register', async (request, response) => {
  await Database.createPushSubscription(request.body.subscription);
  response.status(200).json({});
});

PushController.broadcastNotification = async (message) => {
  const subscriptions = await Database.getPushSubscriptions();
  for (const subscription of subscriptions) {
    WebPush.sendNotification(subscription, message).catch((err) => {
      console.warn('Push API error', err);
      Database.deletePushSubscription(subscription.id);
    });
  }
};

module.exports = PushController;
