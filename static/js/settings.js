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

/* globals App */

// eslint-disable-next-line no-unused-vars
var SettingsScreen = {

    /**
    * Initialise Settings Screen.
    */
    init: function() {
      this.menu = document.getElementById('settings-menu');
      this.domainSettings = document.getElementById('domain-settings');
      this.backButton = document.getElementById('settings-back-button');
    },

    show: function(section) {
      if (section) {
        this.showSection(section);
      } else {
        this.showMenu();
      }
    },

    showMenu: function() {
      App.showMenuButton();
      this.hideBackButton();
      this.menu.classList.remove('hidden');
      this.domainSettings.classList.add('hidden');
    },

    hideMenu: function() {
      this.menu.classList.add('hidden');
    },

    showBackButton: function() {
      this.backButton.classList.remove('hidden');
    },

    hideBackButton: function() {
      this.backButton.classList.add('hidden');
    },

    showSection: function(section) {
      switch(section) {
        case 'domain':
          this.showDomainSettings();
          break;
        default:
          console.error('Tried to display undefined section');
          return;
      }
      this.hideMenu();
      App.hideMenuButton();
      this.showBackButton();
    },

    showDomainSettings: function() {
      this.domainSettings.classList.remove('hidden');
      const opts = {
        headers: {
          'Accept': 'application/json'
        }
      };
     fetch('/settings/tunnelinfo', opts)
       .then(function (response) {
           return response.text();
       })
       .then(function (body) {
         if (body) {
           document.getElementById('current-domain').innerText = body;
         } else {
           document.getElementById('current-domain').innerText = 'Not set.';
         }
      });
    },
};
