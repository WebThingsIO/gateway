/**
 * Push Service.
 *
 * Manage the Push Service for notifications
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import WebPush from 'web-push';
import * as Settings from './models/settings';
import Database from './db';

class PushService {
  private enabled: boolean;

  constructor() {
    this.enabled = false;
  }

  /**
   * Initialize the Push Service, generating and storing a VAPID keypair
   * if necessary.
   */
  async init(tunnelDomain: string): Promise<void> {
    let vapid = await Settings.getSetting('push.vapid');
    if (!vapid) {
      vapid = WebPush.generateVAPIDKeys();
      await Settings.setSetting('push.vapid', vapid);
    }
    const {publicKey, privateKey} = vapid;

    WebPush.setVapidDetails(tunnelDomain, publicKey, privateKey);

    this.enabled = true;
  }

  async getVAPIDKeys(): Promise<string|null> {
    try {
      const vapid = await Settings.getSetting('push.vapid');
      return vapid;
    } catch (err) {
      console.error('vapid still not generated');
      return null;
    }
  }

  async createPushSubscription(subscription: any): Promise<any> {
    return await Database.createPushSubscription(subscription);
  }

  async broadcastNotification(message: string): Promise<void> {
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
  }
}

export = new PushService();
