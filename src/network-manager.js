/**
 * Network Manager.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const child_process = require('child_process');
const Platform = require('./platform');

function stripQuotes(str) {
  return str.replace(/^'+/, '').replace(/'+$/, '');
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
      const proc = child_process.spawnSync(
        'uci',
        ['show', 'network.wan'],
        {encoding: 'utf8'}
      );
      if (proc.status !== 0) {
        return {mode, options};
      }

      for (const line of proc.stdout.split('\n')) {
        if (line.indexOf('=') < 0) {
          continue;
        }

        const [key, value] = line.split('=', 2).map((s) => stripQuotes(s));

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
      let proc = child_process.spawnSync(
        'uci',
        ['set', `network.wan.proto=${mode}`]
      );
      if (proc.status !== 0) {
        return false;
      }

      for (const [key, value] of Object.entries(options)) {
        proc = child_process.spawnSync(
          'uci',
          ['set', `network.wan.${key}=${value}`]
        );
        if (proc.status !== 0) {
          return false;
        }
      }

      proc = child_process.spawnSync('uci', ['commit', 'network']);
      if (proc.status !== 0) {
        return false;
      }

      proc = child_process.spawnSync('/etc/init.d/network', ['reload']);
      return proc.status === 0;
    }
    default:
      return false;
  }
}

function getWirelessMode() {
  let enabled = false;
  let mode = null;
  const options = {};

  switch (Platform.getOS()) {
    case 'linux-openwrt': {
      let proc = child_process.spawnSync(
        'uci',
        ['show', 'wireless'],
        {encoding: 'utf8'}
      );
      if (proc.status !== 0) {
        return {enabled, mode, options};
      }

      let device = null;
      let iface = null;
      for (const line of proc.stdout.split('\n')) {
        if (line.indexOf('=') < 0) {
          continue;
        }

        const [key, value] = line.split('=', 2).map((s) => stripQuotes(s));

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

      proc = child_process.spawnSync(
        'uci',
        ['show', `wireless.${device}.disabled`],
        {encoding: 'utf8'}
      );
      if (proc.status !== 0) {
        return {enabled, mode, options};
      }

      enabled = proc.stdout.split('\n')[0].split('=')[1] === 0;

      proc = child_process.spawnSync(
        'uci',
        ['show', iface],
        {encoding: 'utf8'}
      );
      if (proc.status !== 0) {
        return {enabled, mode, options};
      }

      for (const line of proc.stdout.split('\n')) {
        if (line.indexOf('=') < 0) {
          continue;
        }

        const [key, value] = line.split('=', 2).map((s) => stripQuotes(s));

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

function setWirelessMode(enabled, mode = 'ap', options = {}) {
  const valid = ['ap', 'sta'];
  if (enabled && !valid.includes(mode)) {
    return false;
  }

  switch (Platform.getOS()) {
    case 'linux-openwrt': {
      let proc = child_process.spawnSync(
        'uci',
        ['show', 'wireless'],
        {encoding: 'utf8'}
      );
      if (proc.status !== 0) {
        return false;
      }

      const ifaces = new Map();
      for (const line of proc.stdout.split('\n')) {
        if (line.indexOf('=') < 0) {
          continue;
        }

        const [key, value] = line.split('=', 2).map((s) => stripQuotes(s));

        // we're just looking for things like wireless.@wifi-iface[1].device
        if (!key.endsWith('.device')) {
          continue;
        }

        ifaces.set(key.split('.device')[0], value);
      }

      for (const iface of ifaces.keys()) {
        const device = ifaces.get(iface);
        proc = child_process.spawnSync(
          'uci',
          ['set', `wireless.${device}.disabled=${enabled ? '0' : '1'}`]
        );
        if (proc.status !== 0) {
          return false;
        }

        if (enabled) {
          proc = child_process.spawnSync(
            'uci',
            ['set', `${iface}.mode=${mode}`]
          );
          if (proc.status !== 0) {
            return false;
          }

          for (const [key, value] of Object.entries(options)) {
            proc = child_process.spawnSync(
              'uci',
              ['set', `${iface}.${key}=${value}`]
            );
            if (proc.status !== 0) {
              return false;
            }
          }
        }
      }

      proc = child_process.spawnSync('uci', ['commit', 'wireless']);
      if (proc.status !== 0) {
        return false;
      }

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
  getWanMode,
  setWanMode,
  getWirelessMode,
  setWirelessMode,
};
