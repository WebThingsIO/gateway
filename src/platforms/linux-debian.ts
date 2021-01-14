/**
 * Debian platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as LinuxRaspbian from './linux-raspbian';
import {SelfUpdateStatus} from './types';

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

export const getDhcpServerStatus = LinuxRaspbian.getDhcpServerStatus;
export const getHostname = LinuxRaspbian.getHostname;
export const getLanMode = LinuxRaspbian.getLanMode;
export const getMacAddress = LinuxRaspbian.getMacAddress;
export const getMdnsServerStatus = LinuxRaspbian.getMdnsServerStatus;
export const getNetworkAddresses = LinuxRaspbian.getNetworkAddresses;
export const getWirelessMode = LinuxRaspbian.getWirelessMode;
export const getValidTimezones = LinuxRaspbian.getValidTimezones;
export const getTimezone = LinuxRaspbian.getTimezone;
export const getValidWirelessCountries = LinuxRaspbian.getValidWirelessCountries;
export const getNtpStatus = LinuxRaspbian.getNtpStatus;
