/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import assert from 'assert';
import {Level} from 'gateway-addon/lib/schema';
import {AddonManager} from '../../addon-manager';
import Effect, {EffectDescription} from './Effect';

interface NotifierOutletEffectDescription extends EffectDescription {
  notifier: string,
  outlet: string,
  title: string,
  message: string,
  level: Level,
}
/**
 * An Effect which calls notify on a notifier's outlet
 */
export default class NotifierOutletEffect extends Effect {
  /**
   * @param {EffectDescription} desc
   */
  constructor(private addonManager: AddonManager,
              private notifierOutletEffectDescription: NotifierOutletEffectDescription) {
    super(addonManager, notifierOutletEffectDescription);
    assert(notifierOutletEffectDescription.hasOwnProperty('notifier'));
    assert(notifierOutletEffectDescription.hasOwnProperty('outlet'));
    assert(notifierOutletEffectDescription.hasOwnProperty('title'));
    assert(notifierOutletEffectDescription.hasOwnProperty('message'));
    assert(notifierOutletEffectDescription.hasOwnProperty('level'));
  }

  /**
   * @return {NotifierOutletEffectDescription}
   */
  toDescription(): NotifierOutletEffectDescription {
    return {
      ...super.toDescription(),
      ...{
        notifier: this.notifierOutletEffectDescription.notifier,
        outlet: this.notifierOutletEffectDescription.outlet,
        title: this.notifierOutletEffectDescription.title,
        message: this.notifierOutletEffectDescription.message,
        level: this.notifierOutletEffectDescription.level,
      },
    };
  }

  /**
   * @param {State} state
   */
  setState(state: any): void {
    if (!state.on) {
      return;
    }

    const notifierId = this.notifierOutletEffectDescription.notifier;
    const outletId = this.notifierOutletEffectDescription.outlet;

    const notifier = this.addonManager.getNotifier(notifierId);
    if (!notifier) {
      console.warn(`Notifier "${notifierId}" not found, unable to notify`);
      return;
    }

    const outlet = notifier.getOutlet(outletId);
    if (!outlet) {
      console.warn(`Outlet "${outletId}" of notifier "${notifierId}" not found, unable to notify`);
      return;
    }

    const {
      title,
      message,
      level,
    } = this.notifierOutletEffectDescription;

    outlet.notify(title, message, level).catch((e) => {
      console.warn(`Outlet "${outlet}" of notifier "${notifier}" unable to notify`, e);
    });
  }
}
