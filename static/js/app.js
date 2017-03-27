/**
 * MozIoT Gateway App.
 *
 * Front end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
var App = {
  /**
   * Domain name web app is hosted at.
   */
  DOMAIN: 'http://localhost:8080',

  /**
   * Start MozIoT gateway app.
   */
  start: function() {
    this.thingsElement = document.getElementById('things');
    this.showThings();
  },

  /**
   * Display all connected web things.
   */
  showThings: function(things) {
    // Fetch a list of things from the server
    fetch(this.DOMAIN + '/things').then((function(response) {
      return response.json();
    }).bind(this)).then((function(things) {
      if (things.length > 0) {
        this.thingsElement.innerHTML = '';
      };
      // Create a new Thing for each thing description
      things.forEach(function(description) {
        var newThing = new Thing(description);
      });
    }).bind(this));
  },
};

/**
  * Start app on page load.
  */
window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  App.start();
});
