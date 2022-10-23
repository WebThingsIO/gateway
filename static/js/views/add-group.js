/**
 * Add Group Screen.
 *
 * UI for adding Groups to the gateway.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const App = require('../app');

const AddGroupScreen = {
  /**
   * Initialise Add Gruop Screen.
   */
  init: function () {
    this.element = document.getElementById('add-group-screen');
    this.backButton = document.getElementById('add-group-back-button');
    this.addGroupContainer = document.getElementById('add-group');
    this.addGroupInput = document.getElementById('add-group-title-input');
    this.addGroupButton = document.getElementById('add-group-add-button');
    // Add event listeners
    this.backButton.addEventListener('click', this.hide.bind(this));
    this.addGroupButton.addEventListener('click', this.addGroup.bind(this));
    this.closing = false;
  },

  /**
   * Show Add Group Screen.
   */
  show: function () {
    this.element.classList.remove('hidden');
  },

  /**
   * Hide Add Gruop Screen.
   */
  hide: function () {
    this.element.classList.add('hidden');
    this.addGroupInput.value = '';
  },

  addGroup: function () {
    App.gatewayModel
      .addGroup({
        title: this.addGroupInput.value,
      })
      .then(() => {
        this.hide();
      });
  },
};

module.exports = AddGroupScreen;
