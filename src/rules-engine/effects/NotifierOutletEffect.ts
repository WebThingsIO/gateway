/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import {Level} from 'gateway-addon/lib/schema';

import assert from 'assert';
import Effect, {EffectDescription} from './Effect';
const AddonManager = require('../../addon-manager');

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
  private notifier: string;

  private outlet: string;

  private title: string;

  private message: string;

  private level: Level;

  /**
   * @param {EffectDescription} desc
   */
  constructor(desc: NotifierOutletEffectDescription) {
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
  toDescription(): NotifierOutletEffectDescription {
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
  setState(state: any): void {
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
      console.warn(
        `Outlet "${this.outlet}" of notifier "${this.notifier}" not found, unable to notify`);
      return;
    }

    outlet.notify(this.title, this.message, this.level).catch((e: any) => {
      console.warn(`Outlet "${this.outlet}" of notifier "${this.notifier}" unable to notify`, e);
    });
  }
}
