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

'use strict';

import {AddonManagerProxy, Notifier, Constants as AddonConstants} from 'gateway-addon';
import Plugin from './plugin';

import Deferred from '../deferred';
import OutletProxy from './outlet-proxy';
import {OutletDescription} from 'gateway-addon/lib/schema';

/**
 * Class used to describe a notifier from the perspective of the gateway.
 */
export default class NotifierProxy extends Notifier {
  private unloadCompletedPromise?: Deferred<void, unknown>;

  constructor(
    addonManager: AddonManagerProxy, notifierId: string, name: string, packageName: string,
    private plugin: Plugin) {
    super(addonManager, notifierId, packageName);
    this.setName(name);
  }

  sendMsg<T extends unknown>(
    methodType: number, data: Record<string, unknown>,
    deferred?: Deferred<T, unknown>): void {
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
    this.unloadCompletedPromise = new Deferred<void, unknown>();
    this.sendMsg(AddonConstants.MessageType.NOTIFIER_UNLOAD_REQUEST, {});
    return this.unloadCompletedPromise.getPromise();
  }

  addOutlet(outletId: string, outletDescription: OutletDescription): void {
    this.getOutlets()[outletId] = new OutletProxy(this, outletDescription);
  }
}
