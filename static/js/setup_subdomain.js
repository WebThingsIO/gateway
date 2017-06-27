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
const createDomainButton = document.getElementById('create-domain-button');
const skipButton = document.getElementById('skip-subdomain-button');
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

createDomainButton.addEventListener('click', function() {
    displayMessage('Processing...', 'message');
    // call the settings controller to subscribe the domain in the gateway
    var action = {
      'email': email.value,
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
        return response.text();
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
});

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
});