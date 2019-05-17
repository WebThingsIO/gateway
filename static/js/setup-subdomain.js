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

const subdomain = document.getElementById('subdomain');
const email = document.getElementById('email');
const optIn = document.getElementById('opt-in');
const reclamationToken = document.getElementById('reclamation-token');
const createDomainButton = document.getElementById('create-domain-button');
const skipAnchor = document.getElementById('skip-subdomain-anchor');
const errorMessage = document.getElementById('error-setup');

function displayMessage(errorMsg, type) {
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
  if (validateDomain() && validateEmail() && validateToken()) {
    createDomainButton.disabled = false;
  } else {
    createDomainButton.disabled = true;
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
  displayMessage('Processing...', 'message');

  // Call the settings controller to subscribe the domain in the gateway.
  const action = {
    email: email.value.trim(),
    subdomain: subdomain.value.trim(),
    reclamationToken: reclamationToken.value.trim(),
    optout: !optIn.checked,
  };
  fetch('/settings/subscribe', {
    method: 'POST',
    body: JSON.stringify(action),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.statusText.indexOf('UnavailableName') > -1) {
      validateInput();

      if (response.statusText.indexOf('ReclamationPossible') > -1) {
        const text1 = document.createTextNode(
          'It looks like you\'ve already registered that subdomain. ');
        const text2 = document.createTextNode(' to reclaim it.');
        const reclaim = document.createElement('a');
        reclaim.innerText = 'Click here';
        reclaim.href = '#';
        reclaim.onclick = () => {
          document.getElementById('opt-in-group').style.display = 'none';
          reclamationToken.style.display = 'inline-block';
          reclamationToken.focus();
          errorMessage.innerHTML = 'Please check your email for a ' +
            'reclamation token and paste it above.';

          fetch('/settings/reclaim', {
            method: 'POST',
            body: JSON.stringify({subdomain: subdomain.value}),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }).catch(() => {
            displayMessage('Could not reclaim domain.', 'error');
          });
        };

        errorMessage.innerHTML = '';
        errorMessage.appendChild(text1);
        errorMessage.appendChild(reclaim);
        errorMessage.appendChild(text2);

        errorMessage.classList.remove('hidden');
        errorMessage.classList.remove('message');
        errorMessage.classList.add('error');
        return Promise.reject();
      } else {
        displayMessage('This subdomain is already being used. ' +
                       'Please choose a different one.',
                       'error');
        createDomainButton.disabled = false;
        return Promise.reject();
      }
    } else if (response.statusText.indexOf('ReclamationTokenMismatch') > -1) {
      displayMessage('Invalid reclamation token.', 'error');
      createDomainButton.disabled = false;
      return Promise.reject();
    } else {
      return response.text();
    }
  }).then((body) => {
    if (body) {
      displayMessage('Success! Please wait while we redirect you...',
                     'message');
      setTimeout(() => {
        window.location.replace(body);
      }, 5000);
    } else {
      displayMessage('Error issuing certificate. Please try again.',
                     'error');
      createDomainButton.disabled = false;
    }
  }, () => {});
}

subdomain.addEventListener('input', validateInput);
email.addEventListener('input', validateInput);
reclamationToken.addEventListener('input', validateInput);

subdomain.addEventListener('keydown', submitOnEnter);
email.addEventListener('keydown', submitOnEnter);
reclamationToken.addEventListener('keydown', submitOnEnter);

createDomainButton.addEventListener('click', submitForm);

skipAnchor.addEventListener('click', () => {
  createDomainButton.disabled = true;
  displayMessage('Processing...', 'message');

  // call the settings controller to skip the domain subscription
  fetch('/settings/skiptunnel', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      displayMessage('Redirecting...', 'message');
      setTimeout(() => {
        window.location.replace(`http://${window.location.host}`);
      }, 1000);
    } else {
      displayMessage(response.statusText, 'error');
    }
  }).catch((error) => {
    displayMessage(error, 'error');
  });

  return false;
});
