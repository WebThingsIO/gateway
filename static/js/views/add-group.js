/**
 * Add Group Screen.
 *
 * UI for adding a group of things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const App = require('../app');

const AddGroupScreen = {
  /**
   * Initialise Add Group Screen.
   */
  init: function () {
    this.element = document.getElementById('add-group-screen');
    this.backButton = document.getElementById('add-group-back-button');
    this.form = document.getElementById('add-group-form');
    this.titleInput = document.getElementById('add-group-title-input');
    // Add event listeners
    this.backButton.addEventListener('click', this.hide.bind(this));
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
  },

  /**
   * Show Add Group Screen.
   */
  show: function () {
    this.element.classList.remove('hidden');
  },

  /**
   * Hide Add Group Screen.
   */
  hide: function () {
    this.element.classList.add('hidden');
    this.titleInput.value = '';
  },

  /**
   * Handle submission of the add group form.
   *
   * @param {Event} event A submit event.
   */
  handleFormSubmit: function (event) {
    event.preventDefault();

    App.gatewayModel
      .addGroup({
        title: this.titleInput.value,
      })
      .then(() => {
        this.hide();
      });
    // TODO: Handle errors
  },
};

module.exports = AddGroupScreen;
