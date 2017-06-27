/**
 * Settings Screen.
 *
 * UI for gateway settings.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

// eslint-disable-next-line no-unused-vars
var SettingsScreen = {

    /**
    * Initialise Settings Screen.
    */
    init: function() {
     this.addDomain = document.getElementById('add-domain');
     this.addDomain.addEventListener('click', this.register.bind(this));
    },

    register: function() {
      let subdomain = document.getElementById('tbxsubdomain');
      fetch('/settings/subscribe/' + subdomain, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((function(response) {
        return response.json();
      }).bind(this)).then((function(json) {
        console.log('Success registering domains:', json);
      }).bind(this))
      .catch(function(error) {
        console.error('Failed to register domain:', error);
      });
    }
};
