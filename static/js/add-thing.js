/**
 * Add Thing Screen.
 *
 * UI for adding Things to the gateway.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
var AddThingScreen = {
  /**
   * Initialise Add Thing Screen.
   */
  init: function() {
    this.element = document.getElementById('add-thing-screen');
    this.backButton = document.getElementById('add-thing-back-button');
    this.cancelButton = document.getElementById('add-thing-cancel-button');
    // Add event listeners
    this.backButton.addEventListener('click', this.hide.bind(this));
    this.cancelButton.addEventListener('click', this.hide.bind(this));
  },

  /**
   * Show Add Thing Screen.
   */
  show: function() {
    this.element.classList.remove('hidden');
  },

  /**
   * Hide Add Thing Screen.
   */
  hide: function() {
    this.element.classList.add('hidden');
  }
}
