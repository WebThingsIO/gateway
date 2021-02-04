/**
 * Platform-specific utilities.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import child_process from 'child_process';
import fs from 'fs';
import BasePlatform, { NotImplementedError } from './platforms/base';
import DarwinPlatform from './platforms/darwin';
import LinuxArchPlatform from './platforms/linux-arch';
import LinuxDebianPlatform from './platforms/linux-debian';
import LinuxRaspbianPlatform from './platforms/linux-raspbian';
import LinuxUbuntuPlatform from './platforms/linux-ubuntu';
import {
  LanMode,
  NetworkAddresses,
  SelfUpdateStatus,
  WirelessMode,
  WirelessNetwork,
} from './platforms/types';

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
  return (
    fs.existsSync('/.dockerenv') ||
    fs.existsSync('/run/.containerenv') ||
    (fs.existsSync('/proc/1/cgroup') &&
      fs.readFileSync('/proc/1/cgroup').indexOf(':/docker/') >= 0) ||
    fs.existsSync('/pantavisor')
  );
}

/**
 * Get the current node version.
 */
export function getNodeVersion(): number {
  return <number>(process.config.variables as Record<string, unknown>).node_module_version;
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
    const proc = child_process.spawnSync(bin, ['--version'], { encoding: 'utf8' });

    if (proc.status === 0) {
      const output = proc.stdout || proc.stderr;
      parse(output);
    }
  }

  return Array.from(versions).sort();
}

// Wrap platform-specific methods
function wrapPlatform<T>(platform: BasePlatform | null, fn: string): (...params: any[]) => T {
  return (...params: any[]): T => {
    if (platform === null) {
      throw new NotImplementedError(fn);
    }

    return (<(...args: any[]) => T>(<Record<string, unknown>>(<unknown>platform))[fn])(...params);
  };
}

let platform: BasePlatform | null;
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

export const getDhcpServerStatus = wrapPlatform<boolean>(platform, 'getDhcpServerStatus');
export const setDhcpServerStatus = wrapPlatform<boolean>(platform, 'setDhcpServerStatus');
export const getHostname = wrapPlatform<string>(platform, 'getHostname');
export const setHostname = wrapPlatform<boolean>(platform, 'setHostname');
export const getLanMode = wrapPlatform<LanMode>(platform, 'getLanMode');
export const setLanMode = wrapPlatform<boolean>(platform, 'setLanMode');
export const getMacAddress = wrapPlatform<string | null>(platform, 'getMacAddress');
export const getMdnsServerStatus = wrapPlatform<boolean>(platform, 'getMdnsServerStatus');
export const setMdnsServerStatus = wrapPlatform<boolean>(platform, 'setMdnsServerStatus');
export const getNetworkAddresses = wrapPlatform<NetworkAddresses>(platform, 'getNetworkAddresses');
export const getSshServerStatus = wrapPlatform<boolean>(platform, 'getSshServerStatus');
export const setSshServerStatus = wrapPlatform<boolean>(platform, 'setSshServerStatus');
export const getWirelessMode = wrapPlatform<WirelessMode>(platform, 'getWirelessMode');
export const setWirelessMode = wrapPlatform<boolean>(platform, 'setWirelessMode');
export const restartGateway = wrapPlatform<boolean>(platform, 'restartGateway');
export const restartSystem = wrapPlatform<boolean>(platform, 'restartSystem');
export const scanWirelessNetworks = wrapPlatform<WirelessNetwork[]>(
  platform,
  'scanWirelessNetworks'
);
export const getSelfUpdateStatus = wrapPlatform<SelfUpdateStatus>(platform, 'getSelfUpdateStatus');
export const setSelfUpdateStatus = wrapPlatform<boolean>(platform, 'setSelfUpdateStatus');
export const getValidTimezones = wrapPlatform<string[]>(platform, 'getValidTimezones');
export const getTimezone = wrapPlatform<string>(platform, 'getTimezone');
export const setTimezone = wrapPlatform<boolean>(platform, 'setTimezone');
export const getValidWirelessCountries = wrapPlatform<string[]>(
  platform,
  'getValidWirelessCountries'
);
export const getWirelessCountry = wrapPlatform<string>(platform, 'getWirelessCountry');
export const setWirelessCountry = wrapPlatform<boolean>(platform, 'setWirelessCountry');
export const restartNtpSync = wrapPlatform<boolean>(platform, 'restartNtpSync');
export const getNtpStatus = (): boolean => {
  if (isContainer()) {
    return true;
  }

  return wrapPlatform<boolean>(platform, 'getNtpStatus')();
};

export const implemented = (fn: string): boolean => {
  if (platform === null) {
    return false;
  }

  const base = new BasePlatform();
  return (
    <(...args: any[]) => unknown>(<Record<string, unknown>>(<unknown>base))[fn] !=
    <(...args: any[]) => unknown>(<Record<string, unknown>>(<unknown>platform))[fn]
  );
};
