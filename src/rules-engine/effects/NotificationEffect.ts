/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import assert from 'assert';
import Effect, {EffectDescription} from './Effect';
import PushService from '../../push-service';
import {AddonManager} from '../../addon-manager';


interface NotificationEffectDescription extends EffectDescription {
  message: string
}

/**
 * An Effect which creates a notification
 */
export default class NotificationEffect extends Effect {
  /**
   * @param {NotificationEffectDescription} desc
   */
  constructor(addonManager: AddonManager,
              private notificationEffectDescription: NotificationEffectDescription) {
    super(addonManager, notificationEffectDescription);
    assert(notificationEffectDescription.hasOwnProperty('message'));
  }

  /**
   * @return {NotificationEffectDescription}
   */
  toDescription(): NotificationEffectDescription {
    return {
      ...super.toDescription(),
      ...{
        message: this.notificationEffectDescription.message,
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

    PushService.broadcastNotification(this.notificationEffectDescription.message);
  }
}
