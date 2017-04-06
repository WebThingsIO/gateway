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
    ThingsScreen.init();
    AddThingScreen.init();
    this.views = [];
    this.views['things'] = document.getElementById('things-view');
    this.views['adapters'] = document.getElementById('adapters-view');
    this.views['settings'] = document.getElementById('settings-view');
    this.currentView = 'things';
    Menu.init();
    this.menuButton = document.getElementById('menu-button');
    this.menuButton.addEventListener('click', Menu.toggle.bind(Menu));
  },

  selectView: function(view) {
    if (!this.views[view]) {
      console.error('Tried to select view that didnt exist');
      return;
    }
    this.views[this.currentView].classList.remove('selected');
    this.views[view].classList.add('selected');
    this.currentView = view;
  }
};

/**
  * Start app on page load.
  */
window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  App.init();
});
