/**
 * Settings Model.
 *
 * Manages the getting and setting of settings
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Database from '../db';
import util from 'util';

const DEBUG = false || (process.env.NODE_ENV === 'test');

/**
 * Get a setting.
 *
 * @param {String} key Key of setting to get.
 */
export async function getSetting(key: string): Promise<unknown> {
  try {
    return await Database.getSetting(key);
  } catch (e) {
    console.error('Failed to get', key);
    throw e;
  }
}

/**
 * Set a setting.
 *
 * @param {String} key Key of setting to set.
 * @param value Value to set key to.
 */
export async function setSetting<T>(key: string, value: T): Promise<T> {
  try {
    await Database.setSetting(key, value);

    if (DEBUG) {
      console.log('Set', key, 'to',
                  util.inspect(value, {breakLength: Infinity}));
    }
    return value;
  } catch (e) {
    console.error('Failed to set', key, 'to',
                  util.inspect(value, {breakLength: Infinity}));
    throw e;
  }
}

/**
 * Delete a setting.
 *
 * @param {String} key Key of setting to delete.
 */
export async function deleteSetting(key: string): Promise<void> {
  try {
    await Database.deleteSetting(key);
  } catch (e) {
    console.error('Failed to delete', key);
    throw e;
  }
}

/**
 * Get an object of all tunnel settings
 * @return {string}
 */
export async function getTunnelInfo(): Promise<string> {
  // Check to see if we have a tunnel endpoint first
  const result = await getSetting('tunneltoken');
  let tunnelDomain: string;

  if (typeof result === 'object') {
    const token = <Record<string, unknown>>result!;
    console.log(
      `Tunnel domain found. Tunnel name is: ${token.name} and tunnel domain is: ${token.base}`
    );
    tunnelDomain = `https://${token.name}.${token.base}`;
  } else {
    console.log('Tunnel domain not set.');
    tunnelDomain = 'Not set.';
  }

  return tunnelDomain;
}
