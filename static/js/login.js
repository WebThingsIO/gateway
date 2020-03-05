/**
 * User login.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('./api');
const fluent = require('./fluent');

function setupForm() {
  const form = document.getElementById('login-form');
  const button = document.getElementById('login-button');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const totp = document.getElementById('totp');
  const totpPrompt = document.getElementById('totp-prompt');
  const errorSubmission = document.getElementById('error-submission');

  totp.addEventListener('input', () => {
    button.disabled = !totp.checkValidity();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorSubmission.classList.add('hidden');

    const emailValue = email.value;
    const passwordValue = password.value;
    const totpValue = totp.value;

    API.login(emailValue, passwordValue, totpValue).
      then(() => {
        window.location.href = '/';
      }).
      catch((err) => {
        if (typeof err.message === 'string' && err.message[0] === '{') {
          err = JSON.parse(err.message);
        }

        if (typeof err === 'object' && err.mfaRequired) {
          if (totpValue) {
            errorSubmission.classList.remove('hidden');
            errorSubmission.textContent = fluent.getMessage('login-wrong-totp');
          } else {
            button.disabled = true;
            errorSubmission.classList.add('hidden');
            email.type = 'hidden';
            password.type = 'hidden';
            totp.type = 'text';
            totpPrompt.classList.remove('hidden');
          }

          totp.focus();
        } else {
          errorSubmission.classList.remove('hidden');
          errorSubmission.textContent =
            fluent.getMessage('login-wrong-credentials');
        }
      });
  });
}

window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  fluent.load().then(() => {
    fluent.init();
    setupForm();
  });
});
