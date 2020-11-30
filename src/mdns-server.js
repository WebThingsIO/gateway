/*
 * mDNS service handler.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const config = require('config');
const Settings = require('./models/settings');

/**
 * Get the current domain of the mDNS service.
 */
async function getmDNSdomain() {
  let mDNSserviceDomain = config.get('settings.defaults.mdns.domain');

  try {
    const domain = await Settings.get('localDNSname');
    if (domain) {
      mDNSserviceDomain = domain;
    }
  } catch (_) {
    // pass
  }

  return mDNSserviceDomain;
}

/**
 * Get the current enablement state of the mDNS service.
 */
async function getmDNSstate() {
  let mDNSstate = config.get('settings.defaults.mdns.enabled');
  try {
    const state = await Settings.get('multicastDNSstate');
    if (typeof state !== 'undefined') {
      mDNSstate = state;
    }
  } catch (_) {
    // pass
  }

  return mDNSstate;
}

module.exports = {
  getmDNSdomain,
  getmDNSstate,
};
