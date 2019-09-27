/**
 * @module APIHandlerProxy base class.
 *
 * Manages API handler data model and business logic.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const {APIHandler} = require('gateway-addon');
const Deferred = require('../deferred');
const {MessageType} = require('gateway-addon').Constants;

/**
 * Class used to describe an API handler from the perspective of the gateway.
 */
class APIHandlerProxy extends APIHandler {

  constructor(addonManager, packageName, plugin) {
    super(addonManager, packageName);
    this.plugin = plugin;
    this.unloadCompletedPromise = null;
  }

  sendMsg(methodType, data, deferred) {
    data.packageName = this.packageName;
    return this.plugin.sendMsg(methodType, data, deferred);
  }

  handleRequest(request) {
    return new Promise((resolve, reject) => {
      const deferred = new Deferred();
      deferred.promise.then((response) => {
        resolve(response);
      }).catch(() => {
        reject();
      });

      this.sendMsg(
        MessageType.API_HANDLER_API_REQUEST,
        {
          packageName: this.packageName,
          request,
        },
        deferred
      );
    });
  }

  /**
   * Unloads the handler.
   *
   * @returns a promise which resolves when the handler has finished unloading.
   */
  unload() {
    if (this.unloadCompletedPromise) {
      console.error('APIHandlerProxy: unload already in progress');
      return Promise.reject();
    }
    this.unloadCompletedPromise = new Deferred();
    this.sendMsg(MessageType.API_HANDLER_UNLOAD_REQUEST, {});
    return this.unloadCompletedPromise.promise;
  }
}

module.exports = APIHandlerProxy;
