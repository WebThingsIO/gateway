/**
 * Settings Model.
 *
 * Manages the getting and setting of settings using ../storage.js
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const config = require('config');
const storage = require('../storage');

const Settings = {

  /**
   * Initialise setting storage.
   */
  init: function() {
    return storage.init({
      dir: config.get('settings.directory')
    });
  },

  /**
   * Get a setting.
   *
   * @param {String} key Key of setting to get.
   */
  get: function(key) {
    return new Promise((resolve, reject) => {
      this.init()
      .then(function() {
        storage.getItem(key)
        .then(function(value) {
          resolve(value);
        }).catch(function(e) {
          console.error('Failed to get ' + key);
          reject(e);
        })
      }).catch(function(e) {
        console.error('settings.js: Failed to init');
        console.error(e);
        reject(e);
      });
    });
  },

  /**
   * Set a setting.
   *
   * @param {String} key Key of setting to set.
   * @param value Value to set key to.
   */
  set: function(key, value) {
    return new Promise((resolve, reject) => {
      this.init()
      .then(function() {
        storage.setItem(key, value)
        .then(function() {
          return storage.getItem(key);
        })
        .then(function(returnedValue) {
          console.log('Set ' + key + ' to ' + value);
          resolve(returnedValue);
        }).catch(function(e) {
          console.error('Failed to set ' + key + ' to ' + value);
          reject(e);
        })
      });
    });
  }
};

module.exports = Settings;
