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

const API = require('../api');
const page = require('page');
const Utils = require('../utils');

class User {
  /**
   * User constructor.
   *
   * @param Object description User metadata object.
   */
  constructor(metadata) {
    this.email = metadata.email;
    this.name = metadata.name;
    this.id = metadata.id;
    this.loggedIn = metadata.loggedIn;
    this.container = document.getElementById('users-list');
    this.render();
  }

  /**
   * HTML view for User.
   */
  view() {
    return `
      <li id="user-item-${Utils.escapeHtml(this.id)}" class="user-item">
        <div class="user-settings-header">
          <span class="user-settings-name">${Utils.escapeHtml(this.name)}</span>
          <span class="user-settings-description">
            ${Utils.escapeHtml(this.email)}
          </span>
        </div>
        <div class="user-settings-controls">
          <button id="user-remove-${Utils.escapeHtml(this.id)}"
            class="text-button user-settings-remove">
            Remove
          </button>
          <button id="user-edit-${Utils.escapeHtml(this.id)}"
            class="text-button user-settings-edit">
            Edit
          </button>
        </div>
      </li>`;
  }

  /**
   * Render User view and add to DOM.
   */
  render() {
    this.container.insertAdjacentHTML('beforeend', this.view());

    const removeButton = document.getElementById(
      `user-remove-${Utils.escapeHtml(this.id)}`);
    removeButton.addEventListener('click', this.handleRemove.bind(this));

    const editButton = document.getElementById(
      `user-edit-${Utils.escapeHtml(this.id)}`);
    editButton.addEventListener('click', this.handleEdit.bind(this));
  }

  /**
   * Handle a click on the remove button.
   */
  handleRemove() {
    API.deleteUser(this.id)
      .then(() => {
        const el = document.getElementById(
          `user-item-${Utils.escapeHtml(this.id)}`);
        el.parentNode.removeChild(el);

        if (this.loggedIn) {
          API.logout().then(() => {
            window.location.href = '/login';
          });
        }
      })
      .catch((err) => {
        console.error(`Failed to delete user: ${this.email}\n${err}`);
      });
  }

  /**
   * Handle a click on the edit button.
   */
  handleEdit() {
    page(`/settings/users/edit/${encodeURIComponent(this.id)}`);
  }
}

module.exports = User;
