/**
 * OutletProxy - Gateway side representation of an outlet when using
 *               a notifier plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import {Level} from 'gateway-addon/lib/schema';

const {MessageType} = require('gateway-addon').Constants;
import {Outlet} from 'gateway-addon';
import NotifierProxy from './notifier-proxy';
import Deferred from '../deferred';

export default class OutletProxy extends Outlet {
  constructor(notifier: NotifierProxy, outletDict: any) {
    super(notifier, outletDict.id);

    this.setName(outletDict.name);
  }

  notify(title: string, message: string, level: Level): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('OutletProxy: notify title:', title, 'message:', message,
                  'level:', level, 'for:', this.getId());

      const deferredSet = new Deferred<unknown, unknown>();

      deferredSet.getPromise().then(() => {
        resolve();
      }).catch(() => {
        reject();
      });

      (<NotifierProxy> this.getNotifier()).sendMsg(
        MessageType.OUTLET_NOTIFY_REQUEST,
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
