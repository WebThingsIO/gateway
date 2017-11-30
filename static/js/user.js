/**
 * User.
 *
 * Represents an individual user.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* globals page */

/**
 * User constructor.
 *
 * @param Object description User metadata object.
 */
var User = function(metadata) {
  this.email = metadata.email;
  this.name = metadata.name;
  this.id = metadata.id;
  this.loggedIn = metadata.loggedIn;
  this.container = document.getElementById('users-list');
  this.render();
};

/**
 * HTML view for User.
 */
User.prototype.view = function() {
  return `
    <li id="user-item-${this.id}" class="user-item">
      <div class="user-settings-header">
        <span class="user-settings-name">${this.name}</span>
        <span class="user-settings-description">${this.email}</span>
      </div>
      <div class="user-settings-controls">
        <button id="user-remove-${this.id}"
          class="text-button user-settings-remove">
          Remove
        </button>
        <button id="user-edit-${this.id}"
          class="text-button user-settings-edit">
          Edit
        </button>
      </div>
    </li>`;
};

/**
 * Render User view and add to DOM.
 */
User.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());

  const removeButton = document.getElementById(`user-remove-${this.id}`);
  removeButton.addEventListener('click', this.handleRemove.bind(this));

  const editButton = document.getElementById(`user-edit-${this.id}`);
  editButton.addEventListener('click', this.handleEdit.bind(this));
};

/**
 * Handle a click on the remove button.
 */
User.prototype.handleRemove = function() {
  window.API.deleteUser(this.id)
    .then(() => {
      const el = document.getElementById(`user-item-${this.id}`);
      el.parentNode.removeChild(el);

      if (this.loggedIn) {
        window.API.logout().then(() => {
          window.location.href = '/login';
        });
      }
    })
    .catch((err) => {
      console.error(`Failed to delete user: ${this.email}\n${err}`);
    });
};

/**
 * Handle a click on the edit button.
 */
User.prototype.handleEdit = function() {
  page(`/settings/users/edit/${this.id}`);
};
