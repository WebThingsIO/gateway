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

// eslint-disable-next-line prefer-const
let ThingsScreen;
// eslint-disable-next-line prefer-const
let AddThingScreen;
// eslint-disable-next-line prefer-const
let Menu;
// eslint-disable-next-line prefer-const
let ContextMenu;
// eslint-disable-next-line prefer-const
let SettingsScreen;
// eslint-disable-next-line prefer-const
let FloorplanScreen;
// eslint-disable-next-line prefer-const
let Router;
// eslint-disable-next-line prefer-const
let RulesScreen;
// eslint-disable-next-line prefer-const
let RuleScreen;
// eslint-disable-next-line prefer-const
let Speech;

const App = {
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
    ThingsScreen.init();
    SettingsScreen.init();
    FloorplanScreen.init();
    Speech.init(this);
    RulesScreen.init();
    RuleScreen.init();

    this.views = [];
    this.views.things = document.getElementById('things-view');
    this.views.floorplan = document.getElementById('floorplan-view');
    this.views.settings = document.getElementById('settings-view');
    this.views.rules = document.getElementById('rules-view');
    this.views.rule = document.getElementById('rule-view');
    this.currentView = 'things';
    this.menuButton = document.getElementById('menu-button');
    this.menuButton.addEventListener('click', Menu.toggle.bind(Menu));
    this.overflowButton = document.getElementById('overflow-button');
    this.overflowButton.addEventListener('click',
                                         this.toggleOverflowMenu.bind(this));
    this.overflowMenu = document.getElementById('overflow-menu');
    this.messageArea = document.getElementById('message-area');
    this.messageTimeout = null;
    Menu.init();
    Router.init();
  },

  showThings: function(context) {
    ThingsScreen.show(context.params.thingId || null,
                      context.params.actionName || null);
    this.selectView('things');
  },

  showSettings: function(context) {
    SettingsScreen.show(context.params.section || null,
                        context.params.subsection || null,
                        context.params.id || null);
    this.selectView('settings');
  },

  showFloorplan: function() {
    FloorplanScreen.show();
    this.selectView('floorplan');
  },

  showRules: function() {
    RulesScreen.show();
    this.selectView('rules');
  },

  showRule: function(context) {
    RuleScreen.show(context.params.rule);
    this.selectView('rule');
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
  },

  showMenuButton: function() {
    this.menuButton.classList.remove('hidden');
  },

  hideMenuButton: function() {
    this.menuButton.classList.add('hidden');
  },

  showOverflowButton: function() {
    this.overflowButton.classList.remove('hidden');
  },

  hideOverflowButton: function() {
    this.overflowMenu.classList.add('hidden');
    this.overflowButton.classList.add('hidden');
  },

  buildOverflowMenu: function(links) {
    let items = '';

    for (const link of links) {
      items += `<a href="${link.href}">${link.name}</a>`;
    }

    this.overflowMenu.innerHTML = items;
  },

  toggleOverflowMenu: function() {
    if (this.overflowMenu.classList.contains('hidden')) {
      this.overflowMenu.classList.remove('hidden');
    } else {
      this.overflowMenu.classList.add('hidden');
    }
  },

  showMessageArea: function() {
    this.messageArea.classList.remove('hidden');
  },

  hideMessageArea: function() {
    this.messageArea.classList.add('hidden');
  },

  showMessage: function(message, duration) {
    if (this.messageTimeout !== null) {
      clearTimeout(this.messageTimeout);
      this.messageTimeout = null;
    }

    this.messageArea.innerHTML = message;
    this.showMessageArea();

    if (typeof duration === 'number') {
      this.messageTimeout = setTimeout(() => {
        this.messageTimeout = null;
        this.hideMessageArea();
      }, duration);
    }
  },
};

module.exports = App;

// avoid circular dependency
ThingsScreen = require('./things');
AddThingScreen = require('./add-thing');
Menu = require('./menu');
ContextMenu = require('./context-menu');
SettingsScreen = require('./settings');
FloorplanScreen = require('./floorplan');
Router = require('./router');
RulesScreen = require('./rules-screen');
RuleScreen = require('./rule-screen');
Speech = require('./speech');

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js', {
    scope: '/',
  });
}

/**
  * Start app on page load.
  */
window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  App.init();
});
