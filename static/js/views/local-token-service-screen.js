/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

// eslint-disable-next-line no-unused-vars
const LocalTokenServiceScreen = {
  init: function() {
    this.tokenHints = document.querySelectorAll('.token-hint');
  },

  show: function() {
    let token = window.location.search.match(/[?&]code=([^?&]+)/)[1];
    if (!token) {
      token = 'not found';
    }
    for (const tokenHint of this.tokenHints) {
      tokenHint.textContent = token;
    }
  },
};

