/**
 * Push Subscription model
 *
 * Stores the objects that the web-push API needs to send notifications
 */

const Database = require('../db');

class PushSubscriptions {
  constructor() {
    this.subscriptions = null;
  }
  async load() {
    this.subscriptions = await Database.getPushSubscriptions();
  }
