/**
 * Subdomain setup Screen.
 *
 * UI for subdomain setup.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const fluent = require('./fluent');

function setupForm() {
  const subdomain = document.getElementById('subdomain');
  const email = document.getElementById('email');
  const optIn = document.getElementById('opt-in');
  const agree = document.getElementById('agree');
  const reclamationToken = document.getElementById('reclamation-token');
  const createDomainButton = document.getElementById('create-domain-button');
  const skipAnchor = document.getElementById('skip-subdomain-anchor');
  const errorMessage = document.getElementById('error-setup');
  const reclaimMessage = document.getElementById('error-reclaim');
  const validationMessage = document.getElementById('error-validation');
  const ntpMessage = document.getElementById('ntp-warning');

  function displayMessage(errorMsg, type) {
    reclaimMessage.classList.add('hidden');
    errorMessage.innerHTML = errorMsg;
    errorMessage.classList.remove('hidden');
    if (type === 'message') {
      errorMessage.classList.remove('error');
      errorMessage.classList.add('message');
    } else {
      errorMessage.classList.remove('message');
      errorMessage.classList.add('error');
    }
  }

  let haveRestartedNtp = false;
  function pollNtp() {
    API.getNtpStatus().then((body) => {
      if (body.statusImplemented) {
        if (body.synchronized) {
          ntpMessage.classList.add('hidden');
        } else {
          ntpMessage.classList.remove('hidden');

          if (!haveRestartedNtp) {
            API.restartNtpSync().catch((e) => {
              console.error('Failed to restart NTP sync:', e);
            });
            haveRestartedNtp = true;
          }

          // poll again in 5 seconds
          setTimeout(pollNtp, 5000);
        }
      }
    }).catch((e) => {
      console.error('Error polling NTP status:', e);

      // poll again in 5 seconds
      setTimeout(pollNtp, 5000);
    });
  }

  pollNtp();

  /**
   * Ensure that subdomain is valid:
   * - Contains only a-z, 0-9, and hyphens, but does not start or end with
   *   hyphen.
   * - Is not equal to "api", "www", or "ns\d*", as those are reserved.
   */
  function validateDomain() {
    const val = subdomain.value.toLowerCase();
    const re = new RegExp(/^\s*([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\s*$/);
    const nsRegex = new RegExp(/^ns\d*$/);
    if (!re.test(val) ||
        nsRegex.test(val) ||
        ['api', 'www'].includes(val) ||
        val.length > 63) {
      return false;
    }

    return true;
  }

  /**
   * Ensure that email is at least somewhat valid.
   */
  function validateEmail() {
    const val = email.value;
    // eslint-disable-next-line max-len
    const re = new RegExp(/^\s*[^@\s]+@(([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\.)+[a-z0-9][a-z0-9-]*[a-z0-9]\s*$/, 'i');
    return re.test(val) && val.length <= 254;
  }

  /**
   * Ensure that the reclamation token is valid.
   */
  function validateToken() {
    if (reclamationToken.offsetParent === null) {
      return true;
    }

    const val = reclamationToken.value;
    // eslint-disable-next-line max-len
    const re = new RegExp(/^\s*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\s*$/);
    return re.test(val);
  }

  /**
   * Ensure that all inputs are valid.
   */
  function validateInput() {
    if (!validateDomain()) {
      createDomainButton.disabled = true;
      validationMessage.innerText = fluent.getMessage('invalid-subdomain');
      validationMessage.classList.remove('hidden');
    } else if (!validateEmail()) {
      createDomainButton.disabled = true;
      validationMessage.innerText = fluent.getMessage('invalid-email');
      validationMessage.classList.remove('hidden');
    } else if (!validateToken()) {
      createDomainButton.disabled = true;
      validationMessage.innerText =
        fluent.getMessage('invalid-reclamation-token');
      validationMessage.classList.remove('hidden');
    } else {
      createDomainButton.disabled = !agree.checked;
      validationMessage.classList.add('hidden');
    }
  }

  /**
   * Submit the form if Enter was pressed in one of the inputs and all input is
   * valid.
   */
  function submitOnEnter(evt) {
    if (evt.key === 'Enter' && validateDomain() && validateEmail() &&
        validateToken()) {
      submitForm();
    }
  }

  /**
   * Submit the form.
   */
  function submitForm() {
    createDomainButton.disabled = true;
    displayMessage(fluent.getMessage('processing'), 'message');

    // Call the settings controller to subscribe the domain in the gateway.
    API.setupTunnel(
      email.value.trim(),
      subdomain.value.trim(),
      reclamationToken.value.trim(),
      !optIn.checked,
    ).then(([ok, body]) => {
      if (ok) {
        displayMessage(fluent.getMessage('domain-success'), 'message');
        setTimeout(() => {
          window.location.replace(body.url);
        }, 5000);
      } else {
        createDomainButton.disabled = false;

        if (body.indexOf('UnavailableName') > -1) {
          validateInput();

          if (body.indexOf('ReclamationPossible') > -1) {
            errorMessage.classList.add('hidden');
            reclaimMessage.classList.remove('hidden');
            reclaimMessage.querySelector('a').onclick = () => {
              document.getElementById('opt-in-group').style.display = 'none';
              document.getElementById('agree-group').style.display = 'none';
              reclamationToken.style.display = 'block';
              reclamationToken.focus();

              reclaimMessage.classList.add('hidden');
              errorMessage.textContent =
                fluent.getMessage('check-email-for-token');
              errorMessage.classList.remove('hidden');

              API.reclaimDomain(subdomain.value).catch(() => {
                displayMessage(fluent.getMessage('reclaim-failed'), 'error');
              });
            };
          } else {
            displayMessage(fluent.getMessage('subdomain-already-used'),
                           'error');
          }
        } else if (body.indexOf('ReclamationTokenMismatch') > -1) {
          displayMessage(fluent.getMessage('invalid-reclamation-token'),
                         'error');
        } else {
          displayMessage(fluent.getMessage('issuing-error'), 'error');
        }
      }
    }, () => {});
  }

  subdomain.addEventListener('input', validateInput);
  email.addEventListener('input', validateInput);
  reclamationToken.addEventListener('input', validateInput);
  agree.addEventListener('change', validateInput);

  subdomain.addEventListener('keydown', submitOnEnter);
  email.addEventListener('keydown', submitOnEnter);
  reclamationToken.addEventListener('keydown', submitOnEnter);

  createDomainButton.addEventListener('click', submitForm);

  skipAnchor.addEventListener('click', () => {
    createDomainButton.disabled = true;
    displayMessage(fluent.getMessage('processing'), 'message');

    // call the settings controller to skip the domain subscription
    API.skipTunnel().then(([ok, body]) => {
      if (ok) {
        displayMessage(fluent.getMessage('redirecting'), 'message');
        setTimeout(() => {
          window.location.replace(`http://${window.location.host}`);
        }, 1000);
      } else {
        displayMessage(body, 'error');
      }
    }).catch((error) => {
      displayMessage(error, 'error');
    });

    return false;
  });
}

window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  fluent.load().then(() => {
    fluent.init();
    setupForm();
  });
});
