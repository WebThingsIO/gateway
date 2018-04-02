/**
 * User login.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

(function() {
  var form = document.getElementById('login-form');
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var errorSubmission = document.getElementById('error-submission');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorSubmission.classList.add('hidden');

    const emailValue = email.value;
    const passwordValue = password.value;

    window.API.login(emailValue, passwordValue).
      then(() => {
        console.log('~~~ log in success ~~~');

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
