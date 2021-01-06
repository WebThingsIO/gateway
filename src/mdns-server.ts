/*
 * mDNS service handler.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import config from 'config';
import * as Settings from './models/settings';

/**
 * Get the current domain of the mDNS service.
 */
export async function getmDNSdomain(): Promise<string> {
  let mDNSserviceDomain = config.get('settings.defaults.mdns.domain');

  try {
    const domain = await Settings.getSetting('localDNSname');
    if (domain) {
      mDNSserviceDomain = domain;
    }
  } catch (_) {
    // pass
  }

  return `${mDNSserviceDomain}`;
}

/**
 * Get the current enablement state of the mDNS service.
 */
export async function getmDNSstate(): Promise<boolean> {
  let mDNSstate = config.get('settings.defaults.mdns.enabled');
  try {
    const state = await Settings.getSetting('multicastDNSstate');
    if (typeof state !== 'undefined') {
      mDNSstate = state;
    }
  } catch (_) {
    // pass
  }

  return <boolean>mDNSstate;
}
