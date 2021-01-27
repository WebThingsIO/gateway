/**
 * Raspbian platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  LanMode,
  NetworkAddresses,
  SelfUpdateStatus,
  WirelessMode,
  WirelessNetwork,
} from './types';

export class NotImplementedError extends Error {
  constructor(fn: string) {
    super(`Method not implemented for platform: ${fn}`);
  }
}

export default class BasePlatform {
  /**
   * Get DHCP server status.
   *
   * @returns {boolean} Boolean indicating whether or not DHCP is enabled.
   */
  getDhcpServerStatus(): boolean {
    throw new NotImplementedError('getDhcpServerStatus');
  }

  /**
   * Set DHCP server status.
   *
   * @param {boolean} enabled - Whether or not to enable the DHCP server
   * @returns {boolean} Boolean indicating success of the command.
   */
  setDhcpServerStatus(_enabled: boolean): boolean {
    throw new NotImplementedError('setDhcpServerStatus');
  }

  /**
   * Get the LAN mode and options.
   *
   * @returns {Object} {mode: 'static|dhcp|...', options: {...}}
   */
  getLanMode(): LanMode {
    throw new NotImplementedError('getLanMode');
  }

  /**
   * Set the LAN mode and options.
   *
   * @param {string} mode - static, dhcp, ...
   * @param {Object?} options - options specific to LAN mode
   * @returns {boolean} Boolean indicating success.
   */
  setLanMode(_mode: 'static' | 'dhcp', _options: Record<string, unknown> = {}): boolean {
    throw new NotImplementedError('setLanMode');
  }

  /**
   * Get the wireless mode and options.
   *
   * @returns {Object} {enabled: true|false, mode: 'ap|sta|...', options: {...}}
   */
  getWirelessMode(): WirelessMode {
    throw new NotImplementedError('getWirelessMode');
  }

  /**
   * Set the wireless mode and options.
   *
   * @param {boolean} enabled - whether or not wireless is enabled
   * @param {string} mode - ap, sta, ...
   * @param {Object?} options - options specific to wireless mode
   * @returns {boolean} Boolean indicating success.
   */
  setWirelessMode(_enabled: string, _mode = 'ap', _options: Record<string, unknown> = {}): boolean {
    throw new NotImplementedError('setWirelessMode');
  }

  /**
   * Get SSH server status.
   *
   * @returns {boolean} Boolean indicating whether or not SSH is enabled.
   */
  getSshServerStatus(): boolean {
    throw new NotImplementedError('getSshServerStatus');
  }

  /**
   * Set SSH server status.
   *
   * @param {boolean} enabled - Whether or not to enable the SSH server
   * @returns {boolean} Boolean indicating success of the command.
   */
  setSshServerStatus(_enabled: boolean): boolean {
    throw new NotImplementedError('setSshServerStatus');
  }

  /**
   * Get mDNS server status.
   *
   * @returns {boolean} Boolean indicating whether or not mDNS is enabled.
   */
  getMdnsServerStatus(): boolean {
    throw new NotImplementedError('getMdnsServerStatus');
  }

  /**
   * Set mDNS server status.
   *
   * @param {boolean} enabled - Whether or not to enable the mDNS server
   * @returns {boolean} Boolean indicating success of the command.
   */
  setMdnsServerStatus(_enabled: boolean): boolean {
    throw new NotImplementedError('setMdnsServerStatus');
  }

  /**
   * Get the system's hostname.
   *
   * @returns {string} The hostname.
   */
  getHostname(): string {
    throw new NotImplementedError('getHostname');
  }

  /**
   * Set the system's hostname.
   *
   * @param {string} hostname - The hostname to set
   * @returns {boolean} Boolean indicating success of the command.
   */
  setHostname(_hostname: string): boolean {
    throw new NotImplementedError('setHostname');
  }

  /**
   * Restart the gateway process.
   *
   * @returns {boolean} Boolean indicating success of the command.
   */
  restartGateway(): boolean {
    throw new NotImplementedError('restartGateway');
  }

  /**
   * Restart the system.
   *
   * @returns {boolean} Boolean indicating success of the command.
   */
  restartSystem(): boolean {
    throw new NotImplementedError('restartSystem');
  }

  /**
   * Get the MAC address of a network device.
   *
   * @param {string} device - The network device, e.g. wlan0
   * @returns {string|null} MAC address, or null on error
   */
  getMacAddress(_device: string): string | null {
    throw new NotImplementedError('getMacAddress');
  }

  /**
   * Scan for visible wireless networks.
   *
   * @returns {Object[]} List of networks as objects:
   *                     [
   *                       {
   *                         ssid: '...',
   *                         quality: <number>,
   *                         encryption: true|false,
   *                       },
   *                       ...
   *                     ]
   */
  scanWirelessNetworks(): WirelessNetwork[] {
    throw new NotImplementedError('scanWirelessNetworks');
  }

  /**
   * Get the current addresses for Wi-Fi and LAN.
   *
   * @returns {Object} Address object:
   *                   {
   *                     lan: '...',
   *                     wlan: {
   *                       ip: '...',
   *                       ssid: '...',
   *                     }
   *                   }
   */
  getNetworkAddresses(): NetworkAddresses {
    throw new NotImplementedError('getNetworkAddresses');
  }

  /**
   * Determine whether or not the gateway can auto-update itself.
   *
   * @returns {Object} {available: <bool>, enabled: <bool>}
   */
  getSelfUpdateStatus(): SelfUpdateStatus {
    throw new NotImplementedError('getSelfUpdateStatus');
  }

  /**
   * Enable/disable auto-updates.
   *
   * @param {boolean} enabled - Whether or not to enable auto-updates.
   * @returns {boolean} Boolean indicating success of the command.
   */
  setSelfUpdateStatus(_enabled: boolean): boolean {
    throw new NotImplementedError('setSelfUpdateStatus');
  }

  /**
   * Get a list of all valid timezones for the system.
   *
   * @returns {string[]} List of timezones.
   */
  getValidTimezones(): string[] {
    throw new NotImplementedError('getValidTimezones');
  }

  /**
   * Get the current timezone.
   *
   * @returns {string} Name of timezone.
   */
  getTimezone(): string {
    throw new NotImplementedError('getTimezone');
  }

  /**
   * Set the current timezone.
   *
   * @param {string} zone - The timezone to set
   * @returns {boolean} Boolean indicating success of the command.
   */
  setTimezone(_zone: string): boolean {
    throw new NotImplementedError('setTimezone');
  }

  /**
   * Get a list of all valid wi-fi countries for the system.
   *
   * @returns {string[]} List of countries.
   */
  getValidWirelessCountries(): string[] {
    throw new NotImplementedError('getValidWirelessCountries');
  }

  /**
   * Get the wi-fi country code.
   *
   * @returns {string} Country.
   */
  getWirelessCountry(): string {
    throw new NotImplementedError('getWirelessCountry');
  }

  /**
   * Set the wi-fi country code.
   *
   * @param {string} country - The country to set
   * @returns {boolean} Boolean indicating success of the command.
   */
  setWirelessCountry(_country: string): boolean {
    throw new NotImplementedError('setWirelessCountry');
  }

  /**
   * Get the NTP synchronization status.
   *
   * @returns {boolean} Boolean indicating whether or not the time has been
   *                    synchronized.
   */
  getNtpStatus(): boolean {
    throw new NotImplementedError('getNtpStatus');
  }

  /**
   * Restart the NTP sync service.
   *
   * @returns {boolean} Boolean indicating success of the command.
   */
  restartNtpSync(): boolean {
    throw new NotImplementedError('restartNtpSync');
  }
}
