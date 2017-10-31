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
const createDomainButton = document.getElementById('create-domain-button');
// https://github.com/mozilla-iot/gateway/issues/159
//const skipButton = document.getElementById('skip-subdomain-button');
const errorMessage = document.getElementById('error-setup');

function displayMessage(errorMsg, type){
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
 * - Is not equal to "api", as that's reserved.
 */
function validateDomain() {
    const val = subdomain.value.toLowerCase();
    const re = new RegExp(/^([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])$/);
    if (!re.test(val) || val === 'api') {
        return false;
    }

    return true;
}

/**
 * Ensure that all inputs are valid.
 */
function validateInput() {
    if (validateDomain()) {
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
    if (evt.key === 'Enter' && validateDomain()) {
        submitForm();
    }
}

/**
 * Submit the form.
 */
function submitForm() {
    displayMessage('Processing...', 'message');

    // Call the settings controller to subscribe the domain in the gateway.
    var action = {
      'subdomain': subdomain.value
    };
    fetch('/settings/subscribe', {
        method: 'POST',
        body: JSON.stringify(action),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        if (response.statusText.indexOf('UnavailableName') > -1){
            throw new
                Error('This subdomain is already being used. ' +
                'Please choose a different one.');
        } else {
            return response.text();
        }
    }).then(function (body){
        if (body) {
            displayMessage('Success! Please wait while we redirect you...',
                'message');
            setTimeout(function() {
                    window.location.replace(body);
            }, 5000);
        } else {
            displayMessage('Error issuing certificate. Please try again',
                'error');
        }

    }).catch(function(error) {
        displayMessage(error, 'error');
    });
}

subdomain.addEventListener('input', validateInput);
subdomain.addEventListener('keydown', submitOnEnter);
createDomainButton.addEventListener('click', submitForm);

/*
 * https://github.com/mozilla-iot/gateway/issues/159
skipButton.addEventListener('click', function() {
    // call the settings controller to skip the domain subscription
    displayMessage('Processing...', 'message');
    fetch('/settings/skiptunnel', {
        method: 'POST',
    }).then(function (response) {
        if (response.ok) {
            displayMessage('Redirecting..', 'message');
            setTimeout(
                function() {
                    window.location.replace('http://'  +
                        window.location.hostname + ':8080')
                    }, 1000);
        } else {
            displayMessage(response.statusText, 'error');
        }
    }).catch(function(error) {
        displayMessage(error, 'error');
    });
});*/
