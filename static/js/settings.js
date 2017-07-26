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
      const opts = {
        headers: {
          'Accept': 'application/json'
        }
      };
     fetch('/settings/tunnelinfo', opts)
         .then(function (res) {
             return res.text();
         })
         .then(function (body) {
             let msg = '';
             if (body) {
                 msg = 'Your tunnel gateway is:';
             } else {
                 msg = 'You don\'t have a tunnel gateway set.';
             }
             document.getElementById('lblsubdomain').innerHTML = msg;
             document.getElementById('tbxsubdomain').innerHTML = body;
        });
    }
};
