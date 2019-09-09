/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const assert = require('assert');
const Effect = require('./Effect');
const AddonManager = require('../../addon-manager');

/**
 * An Effect which calls notify on a notifier's outlet
 */
class NotifierOutletEffect extends Effect {
  /**
   * @param {EffectDescription} desc
   */
  constructor(desc) {
    super(desc);

    assert(desc.hasOwnProperty('notifier'));
    assert(desc.hasOwnProperty('outlet'));
    assert(desc.hasOwnProperty('title'));
    assert(desc.hasOwnProperty('message'));
    assert(desc.hasOwnProperty('level'));

    this.notifier = desc.notifier;
    this.outlet = desc.outlet;
    this.title = desc.title;
    this.message = desc.message;
    this.level = desc.level;
  }

  /**
   * @return {EffectDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {
        notifier: this.notifier,
        outlet: this.outlet,
        title: this.title,
        message: this.message,
        level: this.level,
      }
    );
  }

  /**
   * @param {State} state
   */
  setState(state) {
    if (!state.on) {
      return;
    }

    const notifier = AddonManager.getNotifier(this.notifier);
    if (!notifier) {
      console.warn(`Notifier "${this.notifier}" not found, unable to notify`);
      return;
    }
    const outlet = notifier.getOutlet(this.outlet);
    if (!outlet) {
      console.warn(`Outlet "${this.outlet}" of notifier "${this.notifier}" not found, unable to notify`);
      return;
    }

    outlet.notify(this.title, this.message, this.level).catch((e) => {
      console.warn(`Outlet "${this.outlet}" of notifier "${this.notifier}" unable to notify`, e);
    });
  }
}

module.exports = NotifierOutletEffect;
