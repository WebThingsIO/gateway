/**
 * Arch Linux platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BasePlatform from './base';
import child_process from 'child_process';
import fs from 'fs';
import { SelfUpdateStatus } from './types';

class LinuxArchPlatform extends BasePlatform {
  /**
   * Get the system's hostname.
   *
   * @returns {string} The hostname.
   */
  getHostname(): string {
    return fs.readFileSync('/etc/hostname', 'utf8').trim();
  }

  /**
   * Get the MAC address of a network device.
   *
   * @param {string} device - The network device, e.g. wlan0
   * @returns {string|null} MAC address, or null on error
   */
  getMacAddress(device: string): string | null {
    const addrFile = `/sys/class/net/${device}/address`;
    if (!fs.existsSync(addrFile)) {
      return null;
    }

    return fs.readFileSync(addrFile, 'utf8').trim();
  }

  /**
   * Determine whether or not the gateway can auto-update itself.
   *
   * @returns {Object} {available: <bool>, enabled: <bool>}
   */
  getSelfUpdateStatus(): SelfUpdateStatus {
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
  getValidTimezones(): string[] {
    const tzdata = '/usr/share/zoneinfo/zone.tab';
    if (!fs.existsSync(tzdata)) {
      return [];
    }

    try {
      const data = fs.readFileSync(tzdata, 'utf8');
      const zones = data
        .split('\n')
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
  getTimezone(): string {
    const proc = child_process.spawnSync('timedatectl', ['status'], { encoding: 'utf8' });

    if (proc.status !== 0) {
      return '';
    }

    const lines = proc.stdout.split('\n').map((l) => l.trim());
    const zone = lines.find((l) => l.startsWith('Time zone:'));

    if (!zone) {
      return '';
    }

    return zone.split(':')[1].split('(')[0].trim();
  }

  /**
   * Get a list of all valid wi-fi countries for the system.
   *
   * @returns {string[]} List of countries.
   */
  getValidWirelessCountries(): string[] {
    const fname = '/usr/share/zoneinfo/iso3166.tab';
    if (!fs.existsSync(fname)) {
      return [];
    }

    try {
      const data = fs.readFileSync(fname, 'utf8');
      const zones = data
        .split('\n')
        .filter((l) => !l.startsWith('#') && l.length > 0)
        .map((l) => l.split('\t')[1])
        .sort();

      return zones;
    } catch (e) {
      console.error('Failed to read zone file:', e);
    }

    return [];
  }

  /**
   * Get the NTP synchronization status.
   *
   * @returns {boolean} Boolean indicating whether or not the time has been
   *                    synchronized.
   */
  getNtpStatus(): boolean {
    const proc = child_process.spawnSync('timedatectl', ['status'], { encoding: 'utf8' });

    if (proc.status !== 0) {
      return false;
    }

    const lines = proc.stdout.split('\n').map((l) => l.trim());
    const status = lines.find((l) => l.startsWith('System clock synchronized:'));

    if (!status) {
      return false;
    }

    return status.split(':')[1].trim() === 'yes';
  }
}

export default new LinuxArchPlatform();
