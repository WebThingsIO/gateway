/**
 * Debian platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BasePlatform from './base';
import LinuxRaspbianPlatform from './linux-raspbian';
import { LanMode, NetworkAddresses, SelfUpdateStatus, WirelessMode } from './types';

export class LinuxDebianPlatform extends BasePlatform {
  /**
   * Determine whether or not the gateway can auto-update itself.
   *
   * @returns {Object} {available: <bool>, enabled: <bool>}
   */
  getSelfUpdateStatus(): SelfUpdateStatus {
    return {
      available: false,
      enabled: false,
      configurable: false,
      triggerable: false,
    };
  }

  getDhcpServerStatus(): boolean {
    return LinuxRaspbianPlatform.getDhcpServerStatus();
  }

  getHostname(): string {
    return LinuxRaspbianPlatform.getHostname();
  }

  getLanMode(): LanMode {
    return LinuxRaspbianPlatform.getLanMode();
  }

  getMacAddress(device: string): string | null {
    return LinuxRaspbianPlatform.getMacAddress(device);
  }

  getMdnsServerStatus(): boolean {
    return LinuxRaspbianPlatform.getMdnsServerStatus();
  }

  getNetworkAddresses(): NetworkAddresses {
    return LinuxRaspbianPlatform.getNetworkAddresses();
  }

  getWirelessMode(): WirelessMode {
    return LinuxRaspbianPlatform.getWirelessMode();
  }

  getValidTimezones(): string[] {
    return LinuxRaspbianPlatform.getValidTimezones();
  }

  getTimezone(): string {
    return LinuxRaspbianPlatform.getTimezone();
  }

  getValidWirelessCountries(): string[] {
    return LinuxRaspbianPlatform.getValidWirelessCountries();
  }

  getNtpStatus(): boolean {
    return LinuxRaspbianPlatform.getNtpStatus();
  }
}

export default new LinuxDebianPlatform();
