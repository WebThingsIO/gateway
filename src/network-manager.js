/**
 * Network Manager.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const child_process = require('child_process');
const parse = require('csv-parse/lib/sync');
const Platform = require('./platform');

/**
 * Parse a value from `uci show` or `uci get`.
 *
 * @param {string} value - Value to parse
 * @returns {string|string[]} Parsed value
 */
function parseUciValue(value) {
  // uci's quote escaping is weird...
  value = value.replace('\'\\\'\'', '\'\'');

  // parse generates an array of arrays, since it's intended to parse multiple
  // lines of CSV data
  let values = parse(value, {quote: '\'', escape: '\''});

  if (values.length === 0 || values[0].length === 0) {
    return '';
  }

  values = values[0];

  if (values.length === 1) {
    return values[0];
  }

  return values;
}

/**
 * Run `uci show {key}` and parse the output.
 *
 * @param {string} key - The key to show
 * @returns {Object} {success: ..., pairs: {key: value, ...}}
 */
function uciShow(key) {
  let success = false;
  const pairs = {};

  const proc = child_process.spawnSync(
    'uci',
    ['-d', ',', 'show', key],
    {encoding: 'utf8'}
  );

  success = proc.status === 0;

  for (const line of proc.stdout.split('\n')) {
    if (line.indexOf('=') < 0) {
      continue;
    }

    // eslint-disable-next-line prefer-const
    let [k, v] = line.split('=', 2);
    v = parseUciValue(v);

    pairs[k] = v;
  }

  return {success, pairs};
}

/**
 * Run `uci get {key}` and parse the output.
 *
 * @param {string} key - The key to get
 * @returns {Object} {success: ..., value: ...}
 */
function uciGet(key) {
  const proc = child_process.spawnSync(
    'uci',
    ['-d', ',', 'get', key],
    {encoding: 'utf8'}
  );

  const success = proc.status === 0;
  const value = parseUciValue(proc.stdout);

  return {success, value};
}

/**
 * Run `uci set {key}`.
 *
 * @param {string} key - The key to set
 * @param {string|string[]} value - The value(s) to set
 * @returns {boolean} Whether or not the command was successful
 */
function uciSet(key, value) {
  let success = false;

  if (Array.isArray(value)) {
    let proc = child_process.spawnSync('uci', ['delete', key]);
    if (proc.status === 0) {
      for (const v of value) {
        proc = child_process.spawnSync('uci', ['add_list', `${key}=${v}`]);
        if (proc.status !== 0) {
          break;
        }
      }

      success = true;
    }
  } else {
    const proc = child_process.spawnSync('uci', ['set', `${key}=${value}`]);
    success = proc.status === 0;
  }

  return success;
}

/**
 * Run `uci commit {key}`.
 *
 * @param {string} key - The key to commit
 * @returns {boolean} Whether or not the command was successful
 */
function uciCommit(key) {
  const proc = child_process.spawnSync('uci', ['commit', key]);
  return proc.status === 0;
}

/**
 * Get the LAN mode and options.
 *
 * @returns {Object} {mode: 'static|dhcp|...', options: {...}}
 */
function getLanMode() {
  let mode = null;
  const options = {};

  switch (Platform.getOS()) {
    case 'linux-openwrt': {
      const result = uciShow('network.lan');
      if (!result.success) {
        return {mode, options};
      }

      for (const [key, value] of Object.entries(result.pairs)) {
        // discard network.lan=interface
        if (!key.startsWith('network.lan.')) {
          continue;
        }

        const opt = key.split('network.lan.')[1];
        if (opt === 'proto') {
          mode = value;
        } else {
          options[opt] = value;
        }
      }

      return {mode, options};
    }
    default:
      return {mode, options};
  }
}

/**
 * Set the LAN mode and options.
 *
 * @param {string} mode - static, dhcp, ...
 * @param {Object?} options - options specific to LAN mode
 * @returns {boolean} Boolean indicating success.
 */
function setLanMode(mode, options = {}) {
  const valid = ['static', 'dhcp'];
  if (!valid.includes(mode)) {
    return false;
  }

  switch (Platform.getOS()) {
    case 'linux-openwrt': {
      if (!uciSet('network.lan.proto', mode)) {
        return false;
      }

      for (const [key, value] of Object.entries(options)) {
        if (!uciSet(`network.lan.${key}`, value)) {
          return false;
        }
      }

      if (!uciCommit('network')) {
        return false;
      }

      const proc = child_process.spawnSync('/etc/init.d/network', ['reload']);
      return proc.status === 0;
    }
    default:
      return false;
  }
}

/**
 * Get the WAN mode and options.
 *
 * @returns {Object} {mode: 'static|dhcp|pppoe|...', options: {...}}
 */
function getWanMode() {
  let mode = null;
  const options = {};

  switch (Platform.getOS()) {
    case 'linux-openwrt': {
      const result = uciShow('network.wan');
      if (!result.success) {
        return {mode, options};
      }

      for (const [key, value] of Object.entries(result.pairs)) {
        // discard network.wan=interface
        if (!key.startsWith('network.wan.')) {
          continue;
        }

        const opt = key.split('network.wan.')[1];
        if (opt === 'proto') {
          mode = value;
        } else {
          options[opt] = value;
        }
      }

      return {mode, options};
    }
    default:
      return {mode, options};
  }
}

/**
 * Set the WAN mode and options.
 *
 * @param {string} mode - static, dhcp, pppoe, ...
 * @param {Object?} options - options specific to WAN mode
 * @returns {boolean} Boolean indicating success.
 */
function setWanMode(mode, options = {}) {
  const valid = ['static', 'dhcp', 'pppoe'];
  if (!valid.includes(mode)) {
    return false;
  }

  switch (Platform.getOS()) {
    case 'linux-openwrt': {
      if (!uciSet('network.wan.proto', mode)) {
        return false;
      }

      for (const [key, value] of Object.entries(options)) {
        if (!uciSet(`network.wan.${key}`, value)) {
          return false;
        }
      }

      if (!uciCommit('network')) {
        return false;
      }

      const proc = child_process.spawnSync('/etc/init.d/network', ['reload']);
      return proc.status === 0;
    }
    default:
      return false;
  }
}

/**
 * Get the wireless mode and options.
 *
 * @returns {Object} {enabled: true|false, mode: 'ap|sta|...', options: {...}}
 */
function getWirelessMode() {
  let enabled = false;
  let mode = null;
  const options = {};

  switch (Platform.getOS()) {
    case 'linux-openwrt': {
      let result = uciShow('wireless');
      if (!result.success) {
        return {enabled, mode, options};
      }

      let device = null;
      let iface = null;
      for (const [key, value] of Object.entries(result.pairs)) {
        // we're just looking for things like wireless.@wifi-iface[1].device
        if (key.endsWith('.device')) {
          iface = key.split('.device')[0];
          device = value;
          break;
        }
      }

      if (!iface) {
        return {enabled, mode, options};
      }

      const key = `wireless.${device}.disabled`;
      result = uciGet(key);
      if (!result.success) {
        return {enabled, mode, options};
      }

      enabled = result.value === '0';

      result = uciShow(iface);
      if (!result.success) {
        return {enabled, mode, options};
      }

      for (const [key, value] of Object.entries(result.pairs)) {
        // discard wireless.wifi-iface[0]=wifi-iface
        if (key.split('.').length <= 2) {
          continue;
        }

        const opt = key.split('.')[2];
        if (opt === 'mode') {
          mode = value;
        } else {
          options[opt] = value;
        }
      }

      return {enabled, mode, options};
    }
    default:
      return {enabled, mode, options};
  }
}

/**
 * Set the wireless mode and options.
 *
 * @param {boolean} enabled - whether or not wireless is enabled
 * @param {string} mode - ap, sta, ...
 * @param {Object?} options - options specific to wireless mode
 * @returns {boolean} Boolean indicating success.
 */
function setWirelessMode(enabled, mode = 'ap', options = {}) {
  const valid = ['ap', 'sta'];
  if (enabled && !valid.includes(mode)) {
    return false;
  }

  switch (Platform.getOS()) {
    case 'linux-openwrt': {
      const result = uciShow('wireless');
      if (!result.success) {
        return false;
      }

      const ifaces = new Map();
      for (const [key, value] of Object.entries(result.pairs)) {
        // we're just looking for things like wireless.@wifi-iface[1].device
        if (!key.endsWith('.device')) {
          continue;
        }

        ifaces.set(key.split('.device')[0], value);
      }

      for (const iface of ifaces.keys()) {
        const device = ifaces.get(iface);
        if (!uciSet(`wireless.${device}.disabled`, enabled ? '0' : '1')) {
          return false;
        }

        if (enabled) {
          if (!uciSet(`${iface}.mode`, mode)) {
            return false;
          }

          for (const [key, value] of Object.entries(options)) {
            if (!uciSet(`${iface}.${key}`, value)) {
              return false;
            }
          }
        }
      }

      if (!uciCommit('wireless')) {
        return false;
      }

      let proc;
      if (enabled) {
        proc = child_process.spawnSync('wifi');
      } else {
        proc = child_process.spawnSync('wifi', ['down']);
      }
      return proc.status === 0;
    }
    default:
      return false;
  }
}

module.exports = {
  getLanMode,
  setLanMode,
  getWanMode,
  setWanMode,
  getWirelessMode,
  setWirelessMode,
};
