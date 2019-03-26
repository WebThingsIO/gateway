/**
 * Push Service.
 *
 * Manage the Push Service for notifications
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const WebPush = require('web-push');
const Settings = require('./models/settings');
const Database = require('./db');

const PushService = {

  enabled: false,
  /**
   * Initialize the Push Service, generating and storing a VAPID keypair
   * if necessary.
   */
  init: async (tunnelDomain) => {
    let vapid = await Settings.get('push.vapid');
    if (!vapid) {
      vapid = WebPush.generateVAPIDKeys();
      await Settings.set('push.vapid', vapid);
    }
    const {publicKey, privateKey} = vapid;

    WebPush.setVapidDetails(tunnelDomain, publicKey, privateKey);

    this.enabled = true;
  },

  getVAPIDKeys: async () => {
    try {
      const vapid = await Settings.get('push.vapid');
      return vapid;
    } catch (err) {
      // do nothing
      console.error('vapid still not generated');
    }
  },

  createPushSubscription: async (subscription) => {
    return await Database.createPushSubscription(subscription);
  },

  broadcastNotification: async (message) => {
    if (!this.enabled) {
      return;
    }
    const subscriptions = await Database.getPushSubscriptions();
    for (const subscription of subscriptions) {
      WebPush.sendNotification(subscription, message).catch((err) => {
        console.warn('Push API error', err);
        Database.deletePushSubscription(subscription.id);
      });
    }
  },
};

module.exports = PushService;
