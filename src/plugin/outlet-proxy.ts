/**
 * OutletProxy - Gateway side representation of an outlet when using
 *               a notifier plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import {Outlet, Constants as AddonConstants, Notifier} from 'gateway-addon';
import {Level, OutletDescription} from 'gateway-addon/lib/schema';
import Deferred from '../deferred';
import NotifierProxy from './notifier-proxy';

export default class OutletProxy extends Outlet {
  constructor(notifier: Notifier, outletDict: OutletDescription) {
    super(notifier, outletDict.id);
    this.setName(outletDict.name);
  }

  notify(title: string, message: string, level: Level): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('OutletProxy: notify title:', title, 'message:', message,
                  'level:', level, 'for:', this.getId());

      const deferredSet = new Deferred();

      deferredSet.getPromise().then(() => {
        resolve();
      }).catch(() => {
        reject();
      });

      (<NotifierProxy> this.getNotifier()).sendMsg(
        AddonConstants.MessageType.OUTLET_NOTIFY_REQUEST,
        {
          outletId: this.getId(),
          title,
          message,
          level,
        },
        deferredSet
      );
    });
  }
}
