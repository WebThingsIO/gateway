/**
 * OutletProxy - Gateway side representation of an outlet when using
 *               a notifier plugin.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Constants = require('../constants');
const {Outlet, Deferred} = require('gateway-addon');

class OutletProxy extends Outlet {
  constructor(notifier, outletDict) {
    super(notifier, outletDict.id);

    this.name = outletDict.name;
  }

  notify(title, message, level) {
    return new Promise((resolve, reject) => {
      console.log('OutletProxy: notify title:', title, 'message:', message,
                  'level:', level, 'for:', this.id);

      const deferredSet = new Deferred();

      deferredSet.promise.then(() => {
        resolve();
      }).catch(() => {
        reject();
      });

      this.notifier.sendMsg(
        Constants.NOTIFY, {
          outletId: this.id,
          title,
          message,
          level,
        }, deferredSet);
    });
  }
}

module.exports = OutletProxy;
