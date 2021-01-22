/**
 * Platform-specific utilities.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import child_process from 'child_process';
import fs from 'fs';
import * as DarwinPlatform from './platforms/darwin';
import * as LinuxArchPlatform from './platforms/linux-arch';
import * as LinuxDebianPlatform from './platforms/linux-debian';
import * as LinuxRaspbianPlatform from './platforms/linux-raspbian';
import * as LinuxUbuntuPlatform from './platforms/linux-ubuntu';

/**
 * Error to indicate that a method was not implemented for a platform.
 */
export class NotImplementedError extends Error {
  constructor(fn: string) {
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
 *                        * linux-arch
 *                        * linux-debian
 *                        * linux-raspbian
 *                        * linux-ubuntu
 *                        * linux-unknown
 */
export function getOS(): string {
  const platform = process.platform;
  if (platform !== 'linux') {
    return platform;
  }

  const proc = child_process.spawnSync('lsb_release', ['-i', '-s']);
  if (proc.status === 0) {
    const lsb_release = proc.stdout.toString().trim();
    switch (lsb_release) {
      case 'Arch':
        return 'linux-arch';
      case 'Debian':
        return 'linux-debian';
      case 'Raspbian':
        return 'linux-raspbian';
      case 'Ubuntu':
        return 'linux-ubuntu';
      default:
        break;
    }
  }

  return 'linux-unknown';
}

/**
 * Get the current architecture as "os-machine", i.e. darwin-x64.
 */
export function getArchitecture(): string {
  return `${process.platform}-${process.arch}`;
}

/**
 * Determine whether or not we're running inside a container (e.g. Docker).
 */
export function isContainer(): boolean {
  return fs.existsSync('/.dockerenv') ||
    fs.existsSync('/run/.containerenv') ||
    (fs.existsSync('/proc/1/cgroup') &&
     fs.readFileSync('/proc/1/cgroup').indexOf(':/docker/') >= 0) ||
    fs.existsSync('/pantavisor');
}

/**
 * Get the current node version.
 */
export function getNodeVersion(): number {
  return (process.config.variables as any).node_module_version;
}

/**
 * Get a list of installed Python versions.
 */
export function getPythonVersions(): string[] {
  const versions = new Set<string>();
  const parse = (output: string): void => {
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

// Wrap platform-specific methods
function wrapPlatform(platform: any, fn: string): any {
  return (...params: any[]) => {
    if (platform === null) {
      throw new NotImplementedError(fn);
    }

    if (!platform.hasOwnProperty(fn)) {
      throw new NotImplementedError(fn);
    }

    return platform[fn](...params);
  };
}

let platform: any;
switch (getOS()) {
  case 'darwin':
    platform = DarwinPlatform;
    break;
  case 'linux-arch':
    platform = LinuxArchPlatform;
    break;
  case 'linux-debian':
    platform = LinuxDebianPlatform;
    break;
  case 'linux-raspbian':
    platform = LinuxRaspbianPlatform;
    break;
  case 'linux-ubuntu':
    platform = LinuxUbuntuPlatform;
    break;
  default:
    platform = null;
    break;
}

export const getPlatformArchitecture = wrapPlatform(platform, 'getPlatformArchitecture');
export const getDhcpServerStatus = wrapPlatform(platform, 'getDhcpServerStatus');
export const setDhcpServerStatus = wrapPlatform(platform, 'setDhcpServerStatus');
export const getHostname = wrapPlatform(platform, 'getHostname');
export const setHostname = wrapPlatform(platform, 'setHostname');
export const getLanMode = wrapPlatform(platform, 'getLanMode');
export const setLanMode = wrapPlatform(platform, 'setLanMode');
export const getMacAddress = wrapPlatform(platform, 'getMacAddress');
export const getMdnsServerStatus = wrapPlatform(platform, 'getMdnsServerStatus');
export const setMdnsServerStatus = wrapPlatform(platform, 'setMdnsServerStatus');
export const getNetworkAddresses = wrapPlatform(platform, 'getNetworkAddresses');
export const getSshServerStatus = wrapPlatform(platform, 'getSshServerStatus');
export const setSshServerStatus = wrapPlatform(platform, 'setSshServerStatus');
export const getWirelessMode = wrapPlatform(platform, 'getWirelessMode');
export const setWirelessMode = wrapPlatform(platform, 'setWirelessMode');
export const restartGateway = wrapPlatform(platform, 'restartGateway');
export const restartSystem = wrapPlatform(platform, 'restartSystem');
export const scanWirelessNetworks = wrapPlatform(platform, 'scanWirelessNetworks');
export const getSelfUpdateStatus = wrapPlatform(platform, 'getSelfUpdateStatus');
export const setSelfUpdateStatus = wrapPlatform(platform, 'setSelfUpdateStatus');
export const getValidTimezones = wrapPlatform(platform, 'getValidTimezones');
export const getTimezone = wrapPlatform(platform, 'getTimezone');
export const setTimezone = wrapPlatform(platform, 'setTimezone');
export const getValidWirelessCountries = wrapPlatform(platform, 'getValidWirelessCountries');
export const getWirelessCountry = wrapPlatform(platform, 'getWirelessCountry');
export const setWirelessCountry = wrapPlatform(platform, 'setWirelessCountry');
export const restartNtpSync = wrapPlatform(platform, 'restartNtpSync');
export const getNtpStatus = (): boolean => {
  if (isContainer()) {
    return true;
  }

  return wrapPlatform(platform, 'getNtpStatus')();
};

export const implemented = (fn: string): boolean => platform && platform.hasOwnProperty(fn);
