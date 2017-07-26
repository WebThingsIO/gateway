/**
 * Adapters Screen.
 *
 * UI for showing installed/connected adapters.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* globals Adapter */

// eslint-disable-next-line no-unused-vars
var AdaptersScreen = {
  /**
   * Initialise Adapters Screen.
   */
  init: function() {
    this.adaptersElement = document.getElementById('adapters');
    this.showAdapters();
  },

  /**
   * Display all installed/connected adapters.
   */
  showAdapters: function() {
    var opts = {
      headers: {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json'
      }
    };
    // Fetch a list of adapters from the server
    fetch('/adapters', opts).then((function(response) {
      return response.json();
    }).bind(this)).then((function(adapters) {
      if (adapters.length > 0) {
        this.adaptersElement.innerHTML = '';
      }
      // Create a new Thing for each thing description
      adapters.forEach(function(metadata) {
        // eslint-disable-next-line no-unused-vars
        var newAdapter = new Adapter(metadata);
      });
    }).bind(this));
  },
};
