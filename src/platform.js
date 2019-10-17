/**
 * Platform-specific utilities.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const child_process = require('child_process');
const dynamicRequire = require('./dynamic-require');
const fs = require('fs');
const path = require('path');
const process = require('process');

/**
 * Error to indicate that a method was not implemented for a platform.
 */
class NotImplementedError extends Error {
  constructor(fn) {
    super(`Method not implemented for platform: ${fn}`);
  }
}

/**
 * Get the OS the gateway is running on.
 *
 * @returns {string|null} String describing OS. Currently, one of:
 *                        * aix
 *                        * android
 *                        * darwin
 *                        * freebsd
 *                        * openbsd
 *                        * sunos
 *                        * win32
 *                        * linux-raspbian
 *                        * linux-openwrt
 *                        * linux-unknown
 */
function getOS() {
  const platform = process.platform;
  if (platform !== 'linux') {
    return platform;
  }

  const proc = child_process.spawnSync('lsb_release', ['-i', '-s']);
  if (proc.status === 0 && proc.stdout.toString().trim() === 'Raspbian') {
    return 'linux-raspbian';
  }

  if (fs.existsSync('/etc/openwrt_release')) {
    return 'linux-openwrt';
  }

  return 'linux-unknown';
}

/**
 * Get the current architecture as "os-machine", i.e. darwin-x64.
 */
function getArchitecture() {
  const defaultArchitecture = `${process.platform}-${process.arch}`;
  try {
    return platform.getPlatformArchitecture(defaultArchitecture);
  } catch (e) {
    return defaultArchitecture;
  }
}

/**
 * Determine whether or not we're running inside Docker.
 */
function isDocker() {
  return fs.existsSync('/.dockerenv') ||
    (fs.existsSync('/proc/1/cgroup') &&
     fs.readFileSync('/proc/1/cgroup').indexOf(':/docker/') >= 0) ||
    fs.existsSync('/pantavisor');
}

/**
 * Get the current node version.
 */
function getNodeVersion() {
  return process.config.variables.node_module_version;
}

/**
 * Get a list of installed Python versions.
 */
function getPythonVersions() {
  const versions = new Set();
  const parse = (output) => {
    const parts = output.split(' ');
    if (parts.length === 2) {
      const match = parts[1].match(/^\d+\.\d+/);
      if (match) {
        versions.add(match[0]);
      }
    }
  };

  for (const bin of ['python', 'python2', 'python3']) {
    const proc = child_process.spawnSync(
      bin,
      ['--version'],
      {encoding: 'utf8'}
    );

    if (proc.status === 0) {
      const output = proc.stdout || proc.stderr;
      parse(output);
    }
  }

  return Array.from(versions).sort();
}

// Basic exports
module.exports = {
  getArchitecture,
  getNodeVersion,
  getOS,
  getPythonVersions,
  isDocker,
  NotImplementedError,
};

// Wrap platform-specific methods
function wrapPlatform(platform, fn) {
  return (...params) => {
    if (platform === null) {
      throw new NotImplementedError(fn);
    }

    if (!platform.hasOwnProperty(fn)) {
      throw new NotImplementedError(fn);
    }

    return platform[fn](...params);
  };
}

let platform;
try {
  platform = dynamicRequire(path.resolve(path.join(__dirname,
                                                   'platforms',
                                                   getOS())));
} catch (_) {
  console.error(`Failed to import platform utilities for ${getOS()}`);
  platform = null;
}

const wrappedMethods = [
  'getPlatformArchitecture',
  'getCaptivePortalStatus',
  'setCaptivePortalStatus',
  'getDhcpServerStatus',
  'setDhcpServerStatus',
  'getHostname',
  'setHostname',
  'getLanMode',
  'setLanMode',
  'getMacAddress',
  'getMdnsServerStatus',
  'setMdnsServerStatus',
  'getNetworkAddresses',
  'getSshServerStatus',
  'setSshServerStatus',
  'getWanMode',
  'setWanMode',
  'getWirelessMode',
  'setWirelessMode',
  'checkConnection',
  'restartGateway',
  'restartSystem',
  'scanWirelessNetworks',
  'update',
  'getValidTimezones',
  'getTimezone',
  'setTimezone',
  'getValidWirelessCountries',
  'getWirelessCountry',
  'setWirelessCountry',
];

for (const method of wrappedMethods) {
  module.exports[method] = wrapPlatform(platform, method);
}

module.exports.implemented = (fn) => platform && platform.hasOwnProperty(fn);
