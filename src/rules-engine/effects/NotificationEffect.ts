/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import assert from 'assert';
import Effect, {EffectDescription} from './Effect';
import PushService from '../../push-service';

export interface NotificationEffectDescription extends EffectDescription {
  message: string;
}

/**
 * An Effect which creates a notification
 */
export default class NotificationEffect extends Effect {
  private message: string;

  /**
   * @param {EffectDescription} desc
   */
  constructor(desc: NotificationEffectDescription) {
    super(desc);

    assert(desc.hasOwnProperty('message'));

    this.message = desc.message;
  }

  /**
   * @return {EffectDescription}
   */
  toDescription(): NotificationEffectDescription {
    return Object.assign(
      super.toDescription(),
      {
        message: this.message,
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

    PushService.broadcastNotification(this.message);
  }
}
