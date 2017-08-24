/**
 * Floorplan Screen.
 *
 * Represents things on a floorplan of your home.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

// eslint-disable-next-line no-unused-vars
var FloorplanScreen = {


  /**
  * Initialise Floorplan Screen.
  */
  init: function() {
    this.view = document.getElementById('floorplan-view');
    this.floorplan = document.getElementById('floorplan');
    this.editButton = document.getElementById('floorplan-edit-button');
    this.saveButton = document.getElementById('floorplan-save-button');
    this.uploadForm = document.getElementById('floorplan-upload-form');
    this.uploadButton = document.getElementById('floorplan-upload-button');
    this.fileInput = document.getElementById('floorplan-file-input');

    this.editButton.addEventListener('click', this.edit.bind(this));
    this.saveButton.addEventListener('click', this.save.bind(this));
    this.uploadButton.addEventListener('click', this.requestFile.bind(this));
    this.uploadForm.addEventListener('submit', this.blackHole);
    this.fileInput.addEventListener('change', this.upload.bind(this));
  },

  show: function() {

  },

 /**
  * Put floorplan in edit mode.
  */
  edit: function() {
    this.view.classList.add('edit');
    this.editButton.classList.add('hidden');
    this.saveButton.classList.remove('hidden');
    this.uploadForm.classList.remove('hidden');
  },

  /**
   * Save changes and take floorplan out of edit mode.
   */
  save: function() {
    this.view.classList.remove('edit');
    this.saveButton.classList.add('hidden');
    this.editButton.classList.remove('hidden');
    this.uploadForm.classList.add('hidden');
  },

  /**
   * Request a file from the user.
   */
  requestFile: function() {
    this.fileInput.click();
  },

  /**
   * Upload a file.
   *
   * @param {Event} e A change event on the file input.
   */
  upload: function(e) {
    var file = e.target.files[0];
    var formData = new FormData();
    formData.append('file', file);
    this.uploadButton.classList.add('loading');
    fetch('/uploads', {
      method: 'POST',
      body: formData,
      headers: {
         'Authorization': `Bearer ${window.API.jwt}`,
      }
    }).then((response) => {
      this.uploadButton.classList.remove('loading');
      if (response.ok) {
        console.log('Successfully uploaded floorplan');
        // Add a timestamp to the background image to force image reload
        var timestamp = Date.now();
        this.floorplan.setAttribute('style',
          'background-image: url(/uploads/floorplan.svg?t=' + timestamp + ')');
      } else {
        console.error('Failed to upload floorplan');
      }
    }).catch((error) => {
      this.uploadButton.classList.remove('loading');
      console.error('Failed to upload floorplan ' + error);
    });
  },

  /*
   * Send an event into a black hole, never to be seen again.
   *
   * @param {Event} e Event to black hole.
   */
  blackHole: function(e) {
    e.preventDefault();
    return false;
  }
};
