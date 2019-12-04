/**
 * Debian platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Raspbian = require('./linux-raspbian');

module.exports = {
  getDhcpServerStatus: Raspbian.getDhcpServerStatus,
  setDhcpServerStatus: Raspbian.setDhcpServerStatus,
  getHostname: Raspbian.getHostname,
  setHostname: Raspbian.setHostname,
  getLanMode: Raspbian.getLanMode,
  setLanMode: Raspbian.setLanMode,
  getMacAddress: Raspbian.getMacAddress,
  // getSshServerStatus,
  // setSshServerStatus,
  getMdnsServerStatus: Raspbian.getMdnsServerStatus,
  setMdnsServerStatus: Raspbian.setMdnsServerStatus,
  getNetworkAddresses: Raspbian.getNetworkAddresses,
  getWirelessMode: Raspbian.getWirelessMode,
  setWirelessMode: Raspbian.setWirelessMode,
  restartGateway: Raspbian.restartGateway,
  restartSystem: Raspbian.restartSystem,
  scanWirelessNetworks: Raspbian.scanWirelessNetworks,
  update: Raspbian.update,
  getValidTimezones: Raspbian.getValidTimezones,
  getTimezone: Raspbian.getTimezone,
  // setTimezone,
  getValidWirelessCountries: Raspbian.getValidWirelessCountries,
  // getWirelessCountry,
  // setWirelessCountry,
  getNtpStatus: Raspbian.getNtpStatus,
  restartNtpSync: Raspbian.restartNtpSync,
};
