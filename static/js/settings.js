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

/* globals App, Menu */

// eslint-disable-next-line no-unused-vars
var SettingsScreen = {

  /**
  * Initialise Settings Screen.
  */
  init: function() {
    this.menu = document.getElementById('settings-menu');
    this.domainSettings = document.getElementById('domain-settings');
    this.userSettings = document.getElementById('user-settings');
    this.experimentSettings = document.getElementById('experiment-settings');
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
    this.userSettings.classList.add('hidden');
    this.experimentSettings.classList.add('hidden');
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
      case 'users':
        this.showUserSettings();
        break;
      case 'experiments':
        this.showExperimentSettings();
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
    fetch('/settings/tunnelinfo', opts).then(function (response) {
      return response.text();
    }).then(function (body) {
      if (body) {
        document.getElementById('current-domain').innerText = body;
      } else {
        document.getElementById('current-domain').innerText = 'Not set.';
      }
    });
  },

  showUserSettings: function() {
    this.userSettings.classList.remove('hidden');
    window.API.getUserInfo().then(function (response) {
     if (response.name) {
       document.getElementById('current-user-name').innerText = response.name;
     } else {
       document.getElementById('current-user-name').innerText = '';
     }
     if (response.email) {
       document.getElementById('current-user-email').innerText = response.email;
     } else {
       document.getElementById('current-user-email').innerText = '';
     }
    });
  },

  showExperimentCheckbox: function(experiment, checkboxId) {
    var checkbox = document.getElementById(checkboxId);
    window.API.getExperimentSetting(experiment)
    .then(function(value) {
      checkbox.checked = value;
    })
    .catch(function(e) {
      console.error('Error getting ' + experiment + ' experiment setting ' + e);
    });

    checkbox.addEventListener('change', function(e) {
      var value = e.target.checked ? true : false;
      window.API.setExperimentSetting(experiment, value).then(function() {
        if (value) {
          Menu.showItem(experiment);
        } else {
          Menu.hideItem(experiment);
        }
      }).catch(function(e) {
        console.error('Failed to enable ' + experiment + ' experiment: ' + e);
      });
    });
  },

  showExperimentSettings: function() {
    this.experimentSettings.classList.remove('hidden');
    this.showExperimentCheckbox('floorplan', 'floorplan-experiment-checkbox');
    this.showExperimentCheckbox('speech', 'speech-experiment-checkbox');
    this.showExperimentCheckbox('rulesEngine',
      'rules-engine-experiment-checkbox');
  }
};
