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

const config = require('config');
const Database = require('../db');
const util = require('util');

const DEBUG = false || (process.env.NODE_ENV === 'test');

const Settings = {

  /**
   * Get a setting.
   *
   * @param {String} key Key of setting to get.
   */
  get: (key) => Database.getSetting(key).catch((e) => {
    console.error('Failed to get', key);
    throw e;
  }),

  /**
   * Set a setting.
   *
   * @param {String} key Key of setting to set.
   * @param value Value to set key to.
   */
  set: (key, value) => Database.setSetting(key, value).then(() => {
    if (DEBUG) {
      console.log('Set', key, 'to',
                  util.inspect(value, {breakLength: Infinity}));
    }
    return value;
  }).catch((e) => {
    console.error('Failed to set', key, 'to',
                  util.inspect(value, {breakLength: Infinity}));
    throw e;
  }),

  /**
   * Delete a setting.
   *
   * @param {String} key Key of setting to delete.
   */
  delete: (key) => Database.deleteSetting(key).catch((e) => {
    console.error('Failed to delete', key);
    throw e;
  }),

  /**
   * Get an object of all add-on-related settings.
   */
  getAddonSettings: () => Database.getAddonSettings().catch((e) => {
    console.error('Failed to get add-on settings');
    throw e;
  }),

  /**
   * Get an object of all tunnel settings
   * @return {localDomain, mDNSstate, tunnelDomain}
   */
  getTunnelInfo: async () => {
    // Check to see if we have a tunnel endpoint first
    const result = await Settings.get('tunneltoken');
    let localDomain;
    let mDNSstate;
    let tunnelEndpoint;

    if (typeof result === 'object') {
      console.log(`Tunnel domain found. Tunnel name is: ${result.name} and`,
                  `tunnel domain is: ${config.get('ssltunnel.domain')}`);
      tunnelEndpoint =
        `https://${result.name}.${config.get('ssltunnel.domain')}`;
    } else {
      tunnelEndpoint = 'Not set.';
    }

    // Find out our default local DNS name Check for a previous name in the
    // DB, if that does not exist use the default.
    try {
      mDNSstate = await Settings.get('multicastDNSstate');
      localDomain = await Settings.get('localDNSname');
      // If our DB is empty use defaults
      if (typeof mDNSstate === 'undefined') {
        mDNSstate = config.get(
          'settings.defaults.domain.localAccess');
      }
      if (typeof localDomain === 'undefined') {
        localDomain = config.get(
          'settings.defaults.domain.localControl.mdnsServiceDomain');
      }
    } catch (err) {
      // Catch this DB error. Since we don't know what state the mDNS process
      // should be in make sure it's off
      console.error(`Error getting DB entry for multicast from the DB: ${err}`);
      localDomain = config.get(
        'settings.defaults.domain.localControl.mdnsServiceDomain');
    }

    console.log(`Tunnel name is set to: ${tunnelEndpoint}`);
    console.log(`Local mDNS Service Domain Name is: ${localDomain}`);
    return {
      localDomain,
      mDNSstate,
      tunnelDomain: tunnelEndpoint,
    };
  },
};

module.exports = Settings;
