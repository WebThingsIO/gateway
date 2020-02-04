/**
 * LockAction
 *
 * A bubble showing a lock action button.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const Action = require('./action');

class LockAction extends Action {
  constructor() {
    super({icon: '/images/component-icons/lock-lock.svg'});
  }
}

window.customElements.define('webthing-lock-action', LockAction);
module.exports = LockAction;
