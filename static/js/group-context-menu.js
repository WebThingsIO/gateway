/**
 * Context Menu.
 *
 * A menu of functions to perform on a Group.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const App = require('./app');
const page = require('page');
const fluent = require('./fluent');

const GroupContextMenu = {
  /**
   * Initialise Add Group Screen.
   */
  init: function () {
    this.element = document.getElementById('group-context-menu');
    this.editContent = document.getElementById('group-context-menu-content-edit');
    this.removeContent = document.getElementById('group-context-menu-content-remove');
    this.backButton = document.getElementById('group-context-menu-back-button');
    this.headingText = document.getElementById('group-context-menu-heading-text');
    this.saveButton = document.getElementById('edit-group-save-button');
    this.titleInput = document.getElementById('edit-group-title');
    this.removeButton = document.getElementById('remove-group-button');
    this.groupId = '';

    // Add event listeners
    window.addEventListener('_groupcontextmenu', this.show.bind(this));
    this.backButton.addEventListener('click', this.hide.bind(this));
    this.saveButton.addEventListener('click', this.handleEdit.bind(this));
    this.removeButton.addEventListener('click', this.handleRemove.bind(this));
  },

  /**
   * Show Context Menu.
   */
  show: function (e) {
    this.headingText.textContent = e.detail.groupTitle;
    this.groupId = e.detail.groupId;
    this.element.classList.remove('hidden');

    this.editContent.classList.add('hidden');
    this.removeContent.classList.add('hidden');

    switch (e.detail.action) {
      case 'edit': {
        this.titleInput.disabled = false;
        this.saveButton.disabled = false;
        this.titleInput.value = e.detail.groupTitle;
        this.editContent.classList.remove('hidden');
        break;
      }
      case 'remove':
        this.removeContent.classList.remove('hidden');
        break;
    }
  },

  /**
   * Hide Context Menu.
   */
  hide: function () {
    this.element.classList.add('hidden');
    this.headingText.textContent = '';
    this.groupId = '';
  },

  /**
   * Handle click on edit option.
   */
  handleEdit: function () {
    this.titleInput.disabled = true;
    this.saveButton.disabled = true;

    const title = this.titleInput.value.trim();
    if (title.length === 0) {
      return;
    }

    App.gatewayModel
      .updateGroup(this.groupId, { title })
      .then(() => {
        this.hide();
        this.saveButton.disabled = false;
      })
      .catch((error) => {
        console.error(`Error updating group: ${error}`);
        this.label.innerText = fluent.getMessage('failed-save');
        this.label.classList.add('error');
        this.label.classList.remove('hidden');
        this.titleInput.disabled = false;
        this.saveButton.disabled = false;
      });
  },

  /**
   * Handle click on remove option.
   */
  handleRemove: function () {
    App.gatewayModel
      .removeGroup(this.groupId)
      .then(() => {
        page('/things');
        this.hide();
      })
      .catch((error) => {
        console.error(`Error removing group: ${error}`);
        this.hide();
      });
  },
};

module.exports = GroupContextMenu;
