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
  init: function() {
    HomeScreen.init();
    AddThingScreen.init();
  }
};

/**
  * Start app on page load.
  */
window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  App.init();
});
