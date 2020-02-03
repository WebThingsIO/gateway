/**
 * UnlockAction
 *
 * A bubble showing an unlock action button.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const Action = require('./action');

class UnlockAction extends Action {
  constructor() {
    super({icon: '/images/component-icons/lock-unlock.svg'});
  }
}

window.customElements.define('webthing-unlock-action', UnlockAction);
module.exports = UnlockAction;
