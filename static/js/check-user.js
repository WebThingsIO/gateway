/**
 * Show an appriopriate UI based on if we have any users yet.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

(function() {
  if (window.API.isLoggedIn()) {
    window.API.verifyJWT().then((valid) => {
      if (!valid) {
        redirectUnauthed();
      }
    });
  } else {
    redirectUnauthed();
  }

  function redirectUnauthed() {
    window.API.userCount().then((count) => {
      let url;
      if (count > 0) {
        url = `/login?url=${encodeURIComponent(window.location.pathname)}`;
      } else {
        url = '/signup';
      }

      window.location.href = url;
    });
  }

}());
