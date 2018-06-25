/**
 * User login.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('./api');

(function() {
  const form = document.getElementById('login-form');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const errorSubmission = document.getElementById('error-submission');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorSubmission.classList.add('hidden');

    const emailValue = email.value;
    const passwordValue = password.value;

    API.login(emailValue, passwordValue).
      then(() => {
        const search = window.location.search;
        const match = search.match(/url=([^=&]+)/);

        let url = '/';
        if (match) {
          url = decodeURIComponent(match[1]);
        }

        window.location.href = url;
      }).
      catch((err) => {
        errorSubmission.classList.remove('hidden');
        errorSubmission.textContent = err.message;
        console.error(err);
      });
  });
})();
