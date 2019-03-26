/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const assert = require('assert');
const Effect = require('./Effect');
const PushService = require('../../push-service');

/**
 * An Effect which creates a notification
 */
class NotificationEffect extends Effect {
  /**
   * @param {EffectDescription} desc
   */
  constructor(desc) {
    super(desc);

    assert(desc.hasOwnProperty('message'));

    this.message = desc.message;
  }

  /**
   * @return {EffectDescription}
   */
  toDescription() {
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
  setState(state) {
    if (!state.on) {
      return;
    }

    PushService.broadcastNotification(this.message);
  }
}

module.exports = NotificationEffect;

