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

var password = document.getElementById('password');
var confirmPassword = document.getElementById('confirm-password');
var createUserButton = document.getElementById('create-user-button');
var errorPasswordMismatch = document.getElementById('error-password-mismatch');

createUserButton.addEventListener('click', function(event) {
  if (password.value !== confirmPassword.value) {
    errorPasswordMismatch.classList.remove('hidden');
    event.preventDefault();
  } else {
    errorPasswordMismatch.classList.add('hidden');
  }
});
