/**
 * Context Menu.
 *
 * A menu of functions to perform on a Directory.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const App = require('./app');
const page = require('page');
const fluent = require('./fluent');

const DirectoryContextMenu = {
  /**
   * Initialise Add Directory Screen.
   */
  init: function () {
    this.element = document.getElementById('directory-context-menu');
    this.editContent = document.getElementById('directory-context-menu-content-edit');
    this.removeContent = document.getElementById('directory-context-menu-content-remove');
    this.backButton = document.getElementById('directory-context-menu-back-button');
    this.headingText = document.getElementById('directory-context-menu-heading-text');
    this.saveButton = document.getElementById('edit-directory-save-button');
    this.titleInput = document.getElementById('edit-directory-title');
    this.removeButton = document.getElementById('remove-directory-button');
    this.directoryId = '';

    // Add event listeners
    window.addEventListener('_directorycontextmenu', this.show.bind(this));
    this.backButton.addEventListener('click', this.hide.bind(this));
    this.saveButton.addEventListener('click', this.handleEdit.bind(this));
    this.removeButton.addEventListener('click', this.handleRemove.bind(this));
  },

  /**
   * Show Context Menu.
   */
  show: function (e) {
    this.headingText.textContent = e.detail.directoryTitle;
    this.directoryId = e.detail.directoryId;
    this.element.classList.remove('hidden');

    this.editContent.classList.add('hidden');
    this.removeContent.classList.add('hidden');

    switch (e.detail.action) {
      case 'edit': {
        this.titleInput.disabled = false;
        this.saveButton.disabled = false;
        this.titleInput.value = e.detail.directoryTitle;
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
    this.directoryId = '';
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
      .updateDirectory(this.directoryId, { title })
      .then(() => {
        this.hide();
        this.saveButton.disabled = false;
      })
      .catch((error) => {
        console.error(`Error updating directory: ${error}`);
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
      .removeDirectory(this.directoryId)
      .then(() => {
        page('/things');
        this.hide();
      })
      .catch((error) => {
        console.error(`Error removing directory: ${error}`);
        this.hide();
      });
  },
};

module.exports = DirectoryContextMenu;
