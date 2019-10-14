/**
 * UnlockActionDetail
 *
 * A bubble showing a button for an unlock action.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const ActionDetail = require('./action');
const Utils = require('../../utils');

class UnlockActionDetail extends ActionDetail {
  constructor(thing, name, action, href) {
    super(thing, name, action, href);
    this.id = `unlock-action-button-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    return `
      <webthing-unlock-action id="${this.id}"
        data-name="${Utils.escapeHtml(this.label)}"
      </webthing-unlock-action>`;
  }
}

module.exports = UnlockActionDetail;
