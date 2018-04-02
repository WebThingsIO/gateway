/**
 * Context Menu.
 *
 * A menu of functions to perform on a Thing.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
 'use strict';

// eslint-disable-next-line no-unused-vars
var ContextMenu = {

  /**
   * Initialise Add Thing Screen.
   */
  init: function() {
    this.element = document.getElementById('context-menu');
    this.backButton = document.getElementById('context-menu-back-button');
    this.heading = document.getElementById('context-menu-heading');
    this.removeButton = document.getElementById('remove-thing-button');
    this.logoutForm = document.getElementById('logout');
    this.thingUrl = '';
    // Add event listeners
    window.addEventListener('_contextmenu', this.show.bind(this));
    this.backButton.addEventListener('click', this.hide.bind(this));
    this.removeButton.addEventListener('click', this.handleRemove.bind(this));
    this.logoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.API.logout().then(() => {
        window.location.href = '/login';
      });
    });
  },

  /**
   * Show Context Menu.
   */
  show: function(e) {
    this.heading.textContent = e.detail.thingName;
    this.thingUrl = e.detail.thingUrl;
    this.element.classList.remove('hidden');
  },

  /**
   * Hide Context Menu.
   */
  hide: function() {
    this.element.classList.add('hidden');
    this.heading.textContent = '';
    this.thingUrl = '';
  },

  /**
   * Handle click on remove option.
   */
  handleRemove: function() {
    fetch(this.thingUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((function(response) {
      if (response.ok) {
        var newEvent = new CustomEvent('_thingchange');
        window.dispatchEvent(newEvent);
        console.log('Successfully removed Thing.');
      } else {
        console.error('Error removing thing ' +
          response.statusText);
      }
      this.hide();
    }).bind(this))
    .catch((function(error) {
      console.error('Error removing thing ' + error);
      this.hide();
    }).bind(this));
  },
};
