/**
 * Things Gateway App.
 *
 * Front end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* globals ThingsScreen, AdaptersScreen,
AddThingScreen, Menu, ContextMenu, SettingsScreen, Router */

var App = {
  /**
   * Current server host.
   */
  HOST: window.location.host,

  /**
   * Current server origin.
   */
  ORIGIN: window.location.origin,

  /**
   * Start Things Gateway app.
   */
  init: function() {
    AddThingScreen.init();
    ContextMenu.init();
    this.views = [];
    this.views.things = document.getElementById('things-view');
    this.views.adapters = document.getElementById('adapters-view');
    this.views.settings = document.getElementById('settings-view');
    this.currentView = 'things';
    Menu.init();
    Router.init();
    this.menuButton = document.getElementById('menu-button');
    this.menuButton.addEventListener('click', Menu.toggle.bind(Menu));
  },

  showThings: function(context) {
    ThingsScreen.init(context.params.thingId || null);
    this.selectView('things');
  },

  showAdapters: function() {
    AdaptersScreen.init();
    this.selectView('adapters');
  },

  showSettings: function() {
    SettingsScreen.init();
    this.selectView('settings');
  },

  selectView: function(view) {
    if (!this.views[view]) {
      console.error('Tried to select view that didnt exist');
      return;
    }
    this.views[this.currentView].classList.remove('selected');
    this.views[view].classList.add('selected');
    Menu.selectItem(view);
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
