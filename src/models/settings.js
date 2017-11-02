/**
 * Settings Model.
 *
 * Manages the getting and setting of settings
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Database = require('../db');

const Settings = {

  /**
   * Get a setting.
   *
   * @param {String} key Key of setting to get.
   */
  get: function(key) {
    return Database.getSetting(key).catch(function(e) {
      console.error('Failed to get ' + key);
      throw e;
    });
  },

  /**
   * Set a setting.
   *
   * @param {String} key Key of setting to set.
   * @param value Value to set key to.
   */
  set: function(key, value) {
    return Database.setSetting(key, value).then(function() {
      console.log('Set ' + key + ' to ' + value);
      return value;
    }).catch(function(e) {
      console.error('Failed to set ' + key + ' to ' + value);
      throw e;
    });
  },

  /**
   * Delete a setting.
   *
   * @param {String} key Key of setting to delete.
   */
  delete: function(key) {
    return Database.deleteSetting(key).catch(function(e) {
      console.error('Failed to delete ' + key);
      throw e;
    });
  },

  /**
   * Get an object of all adapter-related settings.
   */
  getAdapterSettings: function() {
    return Database.getAdapterSettings().catch(function(e) {
      console.error('Failed to get adapter settings');
      throw e;
    });
  },
};

module.exports = Settings;
