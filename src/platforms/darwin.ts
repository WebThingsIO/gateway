/**
 * Darwin (macOS) platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import child_process from 'child_process';
import fs from 'fs';
import {SelfUpdateStatus} from './types';

/**
 * Get mDNS server status.
 *
 * @returns {boolean} Boolean indicating whether or not mDNS is enabled.
 */
export function getMdnsServerStatus(): boolean {
  // mDNS is always enabled
  return true;
}

/**
 * Set mDNS server status.
 *
 * @param {boolean} enabled - Whether or not to enable the mDNS server
 * @returns {boolean} Boolean indicating success of the command.
 */
export function setMdnsServerStatus(enabled: boolean): boolean {
  if (enabled) {
    return true;
  }

  // can't disable
  return false;
}

/**
 * Get the system's hostname.
 *
 * @returns {string} The hostname.
 */
export function getHostname(): string {
  const proc = child_process.spawnSync('hostname', {encoding: 'utf8'});
  if (proc.status !== 0) {
    return '';
  }

  return proc.stdout.trim();
}

/**
 * Determine whether or not the gateway can auto-update itself.
 *
 * @returns {Object} {available: <bool>, enabled: <bool>}
 */
export function getSelfUpdateStatus(): SelfUpdateStatus {
  return {
    available: false,
    enabled: false,
  };
}

/**
 * Get a list of all valid timezones for the system.
 *
 * @returns {string[]} List of timezones.
 */
export function getValidTimezones(): string[] {
  const tzdata = '/usr/share/zoneinfo/zone.tab';
  if (!fs.existsSync(tzdata)) {
    return [];
  }

  try {
    const data = fs.readFileSync(tzdata, 'utf8');
    const zones = data.split('\n')
      .filter((l) => !l.startsWith('#') && l.length > 0)
      .map((l) => l.split(/\s+/g)[2])
      .sort();

    return zones;
  } catch (e) {
    console.error('Failed to read zone file:', e);
  }

  return [];
}

/**
 * Get the current timezone.
 *
 * @returns {string} Name of timezone.
 */
export function getTimezone(): string {
  const tzdata = '/etc/localtime';
  if (!fs.existsSync(tzdata)) {
    return '';
  }

  try {
    const data = fs.readlinkSync(tzdata);
    return data.substring(data.indexOf('zoneinfo/') + 'zoneinfo/'.length);
  } catch (e) {
    console.error('Failed to read timezone:', e);
  }

  return '';
}

/**
 * Get a list of all valid wi-fi countries for the system.
 *
 * @returns {string[]} List of countries.
 */
export function getValidWirelessCountries(): string[] {
  const fname = '/usr/share/zoneinfo/iso3166.tab';
  if (!fs.existsSync(fname)) {
    return [];
  }

  try {
    const data = fs.readFileSync(fname, 'utf8');
    const zones = data.split('\n')
      .filter((l) => !l.startsWith('#') && l.length > 0)
      .map((l) => l.split('\t')[1])
      .sort();

    return zones;
  } catch (e) {
    console.error('Failed to read zone file:', e);
  }

  return [];
}
