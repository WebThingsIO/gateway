/**
 * Show an appriopriate UI based on if we have any users yet.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('./api');

if (API.isLoggedIn()) {
  API.verifyJWT().then((valid) => {
    if (!valid) {
      redirectUnauthed();
    } else if (document.body) {
      document.body.classList.remove('hidden');
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.remove('hidden');
      });
    }
  }).catch(() => {
    document.body.classList.remove('hidden');
    document.getElementById('connectivity-scrim').classList.remove('hidden');
  });
} else {
  redirectUnauthed();
}

function redirectUnauthed() {
  API.userCount().then((count) => {
    let url;
    if (count > 0) {
      url = `/login/`;
    } else {
      url = '/signup/';
    }

    if (window.location.pathname !== url) {
      window.location.replace(url);
    }
  });
}
