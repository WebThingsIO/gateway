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

import Deferred from '../deferred';
import {AddonManagerProxy, APIHandler, APIRequest, APIResponse, Constants} from 'gateway-addon';
import {AddonManager} from '../addon-manager';
import Plugin from './plugin';
const MessageType = Constants.MessageType;

/**
 * Class used to describe an API handler from the perspective of the gateway.
 */
export default class APIHandlerProxy extends APIHandler {
  public unloadCompletedPromise: Deferred<void, void> | null = null;

  constructor(addonManager: AddonManager, packageName: string, private plugin: Plugin) {
    super(<AddonManagerProxy><unknown>addonManager, packageName);
  }

  sendMsg(
    methodType: number,
    data: Record<string, unknown>,
    deferred?: Deferred<APIResponse, unknown>
  ): void {
    data.packageName = this.getPackageName();
    return this.plugin.sendMsg(methodType, data, <Deferred<unknown, unknown>>deferred);
  }

  handleRequest(request: APIRequest): Promise<APIResponse> {
    return new Promise((resolve, reject) => {
      const deferred = new Deferred<APIResponse, unknown>();
      deferred.getPromise().then((response) => {
        resolve(response);
      }).catch(() => {
        reject();
      });

      this.sendMsg(
        MessageType.API_HANDLER_API_REQUEST,
        {
          packageName: this.getPackageName(),
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
  unload(): Promise<void> {
    if (this.unloadCompletedPromise) {
      console.error('APIHandlerProxy: unload already in progress');
      return Promise.reject();
    }
    this.unloadCompletedPromise = new Deferred();
    this.sendMsg(MessageType.API_HANDLER_UNLOAD_REQUEST, {});
    return this.unloadCompletedPromise.getPromise();
  }
}
