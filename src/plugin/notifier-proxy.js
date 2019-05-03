/**
 * @module NotifierProxy base class.
 *
 * Manages Notifier data model and business logic.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const {Notifier} = require('gateway-addon');
const Constants = require('../constants');
const Deferred = require('../deferred');
const OutletProxy = require('./outlet-proxy');

/**
 * Class used to describe a notifier from the perspective of the gateway.
 */
class NotifierProxy extends Notifier {

  constructor(addonManager, notifierId, name, packageName, plugin) {
    super(addonManager, notifierId, packageName);
    this.name = name;
    this.plugin = plugin;
    this.unloadCompletedPromise = null;
  }

  sendMsg(methodType, data, deferred) {
    data.notifierId = this.id;
    return this.plugin.sendMsg(methodType, data, deferred);
  }

  /**
   * Unloads a notifier.
   *
   * @returns a promise which resolves when the notifier has finished unloading.
   */
  unload() {
    if (this.unloadCompletedPromise) {
      console.error('NotifierProxy: unload already in progress');
      return Promise.reject();
    }
    this.unloadCompletedPromise = new Deferred();
    this.sendMsg(Constants.UNLOAD_NOTIFIER, {});
    return this.unloadCompletedPromise.promise;
  }

  addOutlet(outletId, outletDescription) {
    this.outlets[outletId] = new OutletProxy(this, outletDescription);
  }
}

module.exports = NotifierProxy;
