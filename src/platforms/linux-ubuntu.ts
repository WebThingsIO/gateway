/**
 * Ubuntu platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as LinuxDebian from './linux-debian';

export const getSelfUpdateStatus = LinuxDebian.getSelfUpdateStatus;
export const getNtpStatus = LinuxDebian.getNtpStatus;
export const getDhcpServerStatus = LinuxDebian.getDhcpServerStatus;
export const getHostname = LinuxDebian.getHostname;
export const getLanMode = LinuxDebian.getLanMode;
export const getMacAddress = LinuxDebian.getMacAddress;
export const getMdnsServerStatus = LinuxDebian.getMdnsServerStatus;
export const getNetworkAddresses = LinuxDebian.getNetworkAddresses;
export const getWirelessMode = LinuxDebian.getWirelessMode;
export const getValidTimezones = LinuxDebian.getValidTimezones;
export const getTimezone = LinuxDebian.getTimezone;
export const getValidWirelessCountries = LinuxDebian.getValidWirelessCountries;
