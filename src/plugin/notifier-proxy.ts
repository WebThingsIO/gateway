/**
 * @module NotifierProxy base class.
 *
 * Manages Notifier data model and business logic.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Deferred from '../deferred';
import {Constants, Notifier} from 'gateway-addon';
import OutletProxy from './outlet-proxy';
const MessageType = Constants.MessageType;

/**
 * Class used to describe a notifier from the perspective of the gateway.
 */
export default class NotifierProxy extends Notifier {
  private unloadCompletedPromise: any = null;

  constructor(
    addonManager: any, notifierId: string, name: string, packageName: string, private plugin: any) {
    super(addonManager, notifierId, packageName);
    this.setName(name);
  }

  sendMsg(methodType: number, data: any, deferred? : Deferred<unknown, unknown>): void {
    data.notifierId = this.getId();
    return this.plugin.sendMsg(methodType, data, deferred);
  }

  /**
   * Unloads a notifier.
   *
   * @returns a promise which resolves when the notifier has finished unloading.
   */
  unload(): Promise<void> {
    if (this.unloadCompletedPromise) {
      console.error('NotifierProxy: unload already in progress');
      return Promise.reject();
    }
    this.unloadCompletedPromise = new Deferred();
    this.sendMsg(MessageType.NOTIFIER_UNLOAD_REQUEST, {});
    return this.unloadCompletedPromise.promise;
  }

  addOutlet(outletId: string, outletDescription: any): void {
    this.getOutlets()[outletId] = new OutletProxy(this, outletDescription);
  }
}
