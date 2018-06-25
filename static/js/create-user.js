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

const API = require('./api');

(function() {
  const form = document.getElementById('create-user-form');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const name = document.getElementById('name');
  const confirmPassword = document.getElementById('confirm-password');
  const errorPasswordMismatch =
    document.getElementById('error-password-mismatch');
  const errorSubmission = document.getElementById('error-submission');

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

    API.createUser(nameValue, emailValue, passwordValue).
      then(() => {
        window.location.href = '/';
      }).
      catch((err) => {
        errorSubmission.classList.remove('hidden');
        errorSubmission.textContent = err.message;
        console.error(err);
      });
  });
})();
