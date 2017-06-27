/**
 * Create User
 *
 * Implements a simple password confirmation step
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

(function() {

  var form = document.getElementById('create-user-form');
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var name = document.getElementById('name');
  var confirmPassword = document.getElementById('confirm-password');
  var errorPasswordMismatch =
    document.getElementById('error-password-mismatch');
  var errorSubmission = document.getElementById('error-submission');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorSubmission.classList.add('hidden');
    if (password.value !== confirmPassword.value) {
      errorPasswordMismatch.classList.remove('hidden');
      return;
    } else {
      errorPasswordMismatch.classList.add('hidden');
    }

    const emailValue = email.value;
    const passwordValue = password.value;
    const nameValue = name.value;

    window.API.createUser(nameValue, emailValue, passwordValue).
      then(() => {
        console.log('~~~ create user success ~~~');
        window.location.href = '/';
      }).
      catch((err) => {
        errorSubmission.classList.remove('hidden');
        errorSubmission.textContent = err;
        console.error(err);
      });
  })

})();
