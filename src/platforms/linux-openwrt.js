/**
 * OpenWrt platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const child_process = require('child_process');
const config = require('config');
const fs = require('fs');
const os = require('os');
const parse = require('csv-parse/lib/sync');

/**
 * Parse a value from `uci show` or `uci get`.
 *
 * If asArray is true, then the result will always be an array, even
 * if there are fewer than 2 objects returned.
 *
 * @param {string} value - Value to parse
 * @param {object} - optional arguments
 * @returns {string|string[]} - parsed value(s)
 */
function parseUciValue(value, {asArray = false} = {}) {
  // uci's quote escaping is weird...
  value = value.replace('\'\\\'\'', '\'\'');

  // parse generates an array of arrays, since it's intended to parse multiple
  // lines of CSV data
  let values = parse(value, {delimiter: '|', quote: '\'', escape: '\''});

  if (asArray) {
    if (values.length === 0) {
      return [];
    }
    return values[0];
  }

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
    ['-d', '|', 'show', key],
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
function uciGet(key, {asArray = false} = {}) {
  const proc = child_process.spawnSync(
    'uci',
    ['-d', '|', 'get', key],
    {encoding: 'utf8'}
  );

  const success = proc.status === 0;
  const value = parseUciValue(proc.stdout, {asArray});

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
  if (Array.isArray(value)) {
    // Failing to delete a nonexistent key is fine.
    child_process.spawnSync('uci', ['delete', key]);
    for (const v of value) {
      const proc = child_process.spawnSync('uci', ['add_list', `${key}=${v}`]);
      if (proc.status !== 0) {
        console.error(`uciSet: failed to add_list: ${key}=${v}`);
        return false;
      }
    }
  } else if (value === null) {
    // Failing to delete a nonexistent key is fine.
    child_process.spawnSync('uci', ['delete', key]);
  } else {
    const proc = child_process.spawnSync('uci', ['set', `${key}=${value}`]);
    if (proc.status !== 0) {
      console.error(`uciSet: failed to set: ${key}=${value}`);
      return false;
    }
  }
  return true;
}

/**
 * Run `uci commit {key}`.
 *
 * @param {string} key - The key to commit
 * @returns {boolean} Whether or not the command was successful
 */
function uciCommit(key) {
  const proc = child_process.spawnSync('uci', ['commit', key]);
  if (proc.status !== 0) {
    console.error(`uci commit ${key} failed`);
    return false;
  }
  return true;
}

/**
 * Runs iptables rules to redirect one port to another.
 *
 * @param {number} add - true to add redirection, false to remove
 * @param {string} ipaddr - IP Address to redirect from
 * @param {number} fromPort - The port to redirect from
 * @param {number} totPort - The port to redirect to
 * @returns {boolean} Whether or not the command was successful
 */
function redirectTcpPort(add, ipaddr, fromPort, toPort) {
  const cmd = 'iptables';
  let args = [
    '-t', 'mangle',
    add ? '-A' : '-D', 'PREROUTING',
    '-p', 'tcp',
    '--dst', ipaddr,
    '--dport', fromPort,
    '-j', 'MARK',
    '--set-mark', '1',
  ];
  let proc = child_process.spawnSync(cmd, args);
  if (proc.status !== 0) {
    console.error(`redirectTcpPort: ${cmd} ${args} failed:`,
                  proc.status);
    return false;
  }

  args = [
    '-t', 'nat',
    add ? '-A' : '-D', 'PREROUTING',
    '-p', 'tcp',
    '--dst', ipaddr,
    '--dport', fromPort,
    '-j', 'REDIRECT',
    '--to-port', toPort,
  ];
  proc = child_process.spawnSync(cmd, args);
  if (proc.status !== 0) {
    console.error(`redirectTcpPort: ${cmd} ${args} failed:`,
                  proc.status);
    return false;
  }

  args = [
    add ? '-I' : '-D', 'INPUT',
    '-m', 'conntrack',
    '--ctstate', 'NEW',
    '-m', 'tcp',
    '-p', 'tcp',
    '--dport', toPort,
    '-m', 'mark',
    '--mark', '1',
    '-j', 'ACCEPT',
  ];
  proc = child_process.spawnSync(cmd, args);
  if (proc.status !== 0) {
    console.error(`redirectTcpPort: ${cmd} ${args} failed:`,
                  proc.status);
    return false;
  }
  return true;
}

/**
 * Tests to see if the iptables redirection rules have been setup or not.
 *
 * @param {string} ipaddr - IP Address to check
 * @param {number} fromPort - The port to redirect from
 * @param {number} totPort - The port to redirect to
 * @returns {boolean} Whether or not the command was successful
 */
function isRedirectedTcpPort(ipaddr, fromPort, toPort) {
  const cmd = 'iptables';
  const args = [
    '-t', 'nat',
    '--list-rules',
  ];
  const proc = child_process.spawnSync(cmd, args, {encoding: 'utf8'});
  if (proc.status !== 0) {
    console.error(`isRedirectedTcpPort: ${cmd} ${args} failed:`, proc.status);
    return false;
  }

  // The line we're looking for should look something like this (note that
  // what's shown below is all on a single line):
  //  -A PREROUTING -p tcp -m tcp --dst 192.168.2.1 --dport 80
  //  -j REDIRECT --to-ports 8080

  const dst = `--dst ${ipaddr}`;
  const dport = `--dport ${fromPort}`;
  const toports = `--to-ports ${toPort}`;

  for (const line of proc.stdout.split('\n')) {
    if (line.indexOf('-j REDIRECT') >= 0 &&
        line.indexOf(dst) >= 0 &&
        line.indexOf(dport) >= 0 &&
        line.indexOf(toports) >= 0) {
      return true;
    }
  }
  return false;
}

/**
 * Get Captive Portal status.
 *
 * @returns {boolean} Boolean indicating whether or not captive portal is
 *                    enabled.
 */

function getCaptivePortalStatus() {
  const result = uciGet('dhcp.@dnsmasq[0].address', {asArray: true});
  if (!result.success) {
    return false;
  }

  for (const value of result.value) {
    if (value.startsWith('/#/')) {
      // The pattern /#/IP-ADDRESS is the make all host names resolve
      // to IP-ADDRESS pattern used in setCaptivePortalStatus.
      return true;
    }
  }
  return false;
}

/**
 * Set Captive Portal status.
 * @param {boolean} enabled - Whether or not to enable the DHCP server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setCaptivePortalStatus(enabled, options = {}) {
  const httpPort = config.get('ports.http');
  const httpsPort = config.get('ports.https');
  if (enabled) {
    if (!isRedirectedTcpPort(options.ipaddr, 80, httpPort)) {
      if (!redirectTcpPort(enabled, options.ipaddr, 80, httpPort)) {
        return false;
      }
    }
    if (!isRedirectedTcpPort(443, httpsPort)) {
      if (!redirectTcpPort(enabled, options.ipaddr, 443, httpsPort)) {
        return false;
      }
    }
  }

  const result = uciGet('dhcp.@dnsmasq[0].address', {asArray: true});
  let addresses = [];
  if (result.success) {
    addresses = result.value;
  } else {
    addresses = [];
  }
  addresses = addresses.filter((value) => {
    return !value.startsWith('/#/');
  });

  if (enabled) {
    addresses.unshift(`/#/${options.ipaddr}`);
  }
  // If addresses is an empty array, then uciSet will wind up deleting
  // the entry.
  if (!uciSet('dhcp.@dnsmasq[0].address', addresses)) {
    return false;
  }

  if (!uciCommit('dhcp')) {
    return false;
  }

  if (options.restart) {
    const cmd = '/etc/init.d/dnsmasq';
    const args = ['reload'];
    const proc = child_process.spawnSync(cmd, args);
    if (proc.status !== 0) {
      console.error(`setCaptivePortalStatus: ${cmd} ${args} failed`);
      return false;
    }
  }

  return true;
}

/**
 * Get DHCP server status.
 *
 * @returns {boolean} Boolean indicating whether or not DHCP is enabled.
 */
function getDhcpServerStatus() {
  const result = uciGet('dhcp.lan.ignore');
  if (!result.success) {
    return false;
  }

  return result.value === '0';
}

/**
 * Set DHCP server status.
 *
 * @param {boolean} enabled - Whether or not to enable the DHCP server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setDhcpServerStatus(enabled, options = {}) {
  if (!uciSet('dhcp.lan.ignore', enabled ? '0' : '1')) {
    return false;
  }

  if (!uciSet('dhcp.lan.dhcpv6', enabled ? 'server' : 'disabled')) {
    return false;
  }

  if (!uciSet('dhcp.lan.ra', enabled ? 'server' : 'disabled')) {
    return false;
  }

  if (!uciSet('dhcp.lan.dhcp_option', [`3,${options.ipaddr}`,
                                       `6,${options.ipaddr}`])) {
    return false;
  }

  if (!uciCommit('dhcp')) {
    return false;
  }

  let cmd = '/etc/init.d/dnsmasq';
  let args = [enabled ? 'start' : 'stop'];
  let proc = child_process.spawnSync(cmd, args);
  if (proc.status !== 0) {
    console.error(`setDhcpServerStatus: ${cmd} ${args} failed`);
    return false;
  }

  args = [enabled ? 'enable' : 'disable'];
  proc = child_process.spawnSync(cmd, args);
  if (proc.status !== 0) {
    console.error(`setDhcpServerStatus: ${cmd} ${args} failed`);
    return false;
  }

  cmd = '/etc/init.d/odhcpd';
  args = [enabled ? 'start' : 'stop'];
  proc = child_process.spawnSync(cmd, args);
  if (proc.status !== 0) {
    console.error(`setDhcpServerStatus: ${cmd} ${args} failed`);
    return false;
  }

  args = [enabled ? 'enable' : 'disable'];
  proc = child_process.spawnSync(cmd, args);
  if (proc.status !== 0) {
    console.error(`setDhcpServerStatus: ${cmd} ${args} failed`);
    return false;
  }
  return true;
}

/**
 * Get the LAN mode and options.
 *
 * @returns {Object} {mode: 'static|dhcp|...', options: {...}}
 */
function getLanMode() {
  let mode = null;
  const options = {};

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
    console.error(`setLanMode: Invalid mode: ${mode}`);
    return false;
  }

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

  const cmd = '/etc/init.d/network';
  const args = ['reload'];
  const proc = child_process.spawnSync(cmd, args);
  if (proc.status !== 0) {
    console.error(`setLanMode: ${cmd} ${args} failed: ${proc.status}`);
    return false;
  }
  return true;
}

/**
 * Get the WAN mode and options.
 *
 * @returns {Object} {mode: 'static|dhcp|pppoe|...', options: {...}}
 */
function getWanMode() {
  let mode = null;
  const options = {};

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

  const result = uciGet('network.wan');
  if (!result.success) {
    if (!uciSet('network.wan', 'interface')) {
      return false;
    }
  }

  if (!uciSet('network.wan.proto', mode)) {
    return false;
  }

  // TODO: Setting ifname to eth0 is RPi specific. This will change based
  //       on the router. For example, on the Turris Omnia, eth1 is the WAN
  //       port.
  if (!options.hasOwnProperty('ifname')) {
    options.ifname = 'eth0';
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

/**
 * Get the wireless mode and options.
 *
 * @returns {Object} {enabled: true|false, mode: 'ap|sta|...', options: {...}}
 */
function getWirelessMode() {
  let enabled = false;
  let mode = null;
  const options = {};

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
    enabled = true;
  } else {
    enabled = result.value === '0';
  }

  result = uciShow(iface);
  if (!result.success) {
    return {enabled, mode, options};
  }

  const networks = [];
  for (const [key, value] of Object.entries(result.pairs)) {
    // discard wireless.wifi-iface[0]=wifi-iface
    if (key.split('.').length <= 2) {
      continue;
    }

    const opt = key.split('.')[2];
    if (opt === 'mode') {
      mode = value;
    } else if (opt === 'disabled') {
      enabled = enabled && (value === '0');
    } else {
      options[opt] = value;

      if (opt === 'ssid') {
        networks.push(value);
      }
    }
  }

  if (mode === 'sta') {
    options.networks = networks;
  }

  return {enabled, mode, options};
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

    if (!uciSet(`${iface}.disabled`, enabled ? '0' : '1')) {
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

/**
 * Get SSH server status.
 *
 * @returns {boolean} Boolean indicating whether or not SSH is enabled.
 */
function getSshServerStatus() {
  let service = null;
  for (const svc of ['/etc/init.d/dropbear',
                     '/etc/init.d/sshd']) {
    if (fs.existsSync(svc)) {
      service = svc;
      break;
    }
  }

  if (service === null) {
    return false;
  }

  const proc = child_process.spawnSync(service, ['enabled']);
  return proc.status === 0;
}

/**
 * Set SSH server status.
 *
 * @param {boolean} enabled - Whether or not to enable the SSH server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setSshServerStatus(enabled) {
  let service = null;
  for (const svc of ['/etc/init.d/dropbear',
                     '/etc/init.d/sshd']) {
    if (fs.existsSync(svc)) {
      service = svc;
      break;
    }
  }

  if (service === null) {
    return false;
  }

  let proc = child_process.spawnSync(service, [enabled ? 'start' : 'stop']);
  if (proc.status !== 0) {
    return false;
  }

  proc = child_process.spawnSync(service, [enabled ? 'enable' : 'disable']);
  return proc.status === 0;
}

/**
 * Get mDNS server status.
 *
 * @returns {boolean} Boolean indicating whether or not mDNS is enabled.
 */
function getMdnsServerStatus() {
  let service = null;
  for (const svc of ['/etc/init.d/mdnsd',
                     '/etc/init.d/avahi-daemon',
                     '/etc/init.d/mDNSResponder']) {
    if (fs.existsSync(svc)) {
      service = svc;
      break;
    }
  }

  if (service === null) {
    return false;
  }

  const proc = child_process.spawnSync(service, ['enabled']);
  return proc.status === 0;
}

/**
 * Set mDNS server status.
 *
 * @param {boolean} enabled - Whether or not to enable the mDNS server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setMdnsServerStatus(enabled) {
  let service = null;
  for (const svc of ['/etc/init.d/mdnsd',
                     '/etc/init.d/avahi-daemon',
                     '/etc/init.d/mDNSResponder']) {
    if (fs.existsSync(svc)) {
      service = svc;
      break;
    }
  }

  if (service === null) {
    return false;
  }

  let proc = child_process.spawnSync(service, [enabled ? 'start' : 'stop']);
  if (proc.status !== 0) {
    return false;
  }

  proc = child_process.spawnSync(service, [enabled ? 'enable' : 'disable']);
  return proc.status === 0;
}

/**
 * Get the system's hostname.
 *
 * @returns {string} The hostname.
 */
function getHostname() {
  const result = uciGet('system.@system[0].hostname');
  if (!result.success) {
    return '';
  }

  return result.value;
}

/**
 * Set the system's hostname.
 *
 * @param {string} hostname - The hostname to set
 * @returns {boolean} Boolean indicating success of the command.
 */
function setHostname(hostname) {
  hostname = hostname.toLowerCase();
  const re = new RegExp(/^([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])$/);
  const valid = re.test(hostname) && hostname.length <= 63;
  if (!valid) {
    return false;
  }

  if (!uciSet('system.@system[0].hostname', hostname)) {
    return false;
  }

  if (!uciCommit('system')) {
    return false;
  }

  let proc = child_process.spawnSync('/etc/init.d/system', ['reload']);
  if (proc.status !== 0) {
    return false;
  }

  if (!uciSet('network.lan.hostname', hostname)) {
    return false;
  }

  if (!uciCommit('network')) {
    return false;
  }

  proc = child_process.spawnSync('/etc/init.d/network', ['reload']);
  if (proc.status !== 0) {
    return false;
  }

  let service = null;
  for (const svc of ['/etc/init.d/mdnsd',
                     '/etc/init.d/avahi-daemon',
                     '/etc/init.d/mDNSResponder']) {
    if (fs.existsSync(svc)) {
      service = svc;
      break;
    }
  }

  if (service === null) {
    // no need to restart mDNS, so we're fine
    return true;
  }

  proc = child_process.spawnSync(service, ['restart']);
  return proc.status === 0;
}

/**
 * Restart the gateway process.
 *
 * @returns {boolean} Boolean indicating success of the command.
 */
function restartGateway() {
  const proc = child_process.spawnSync(
    '/etc/init.d/mozilla-iot-gateway',
    ['restart']
  );

  // This will probably not fire, but just in case.
  return proc.status === 0;
}

/**
 * Restart the system.
 *
 * @returns {boolean} Boolean indicating success of the command.
 */
function restartSystem() {
  const proc = child_process.spawnSync('reboot');

  // This will probably not fire, but just in case.
  return proc.status === 0;
}

/**
 * Get the MAC address of a network device.
 *
 * @param {string} device - The network device, e.g. wlan0
 * @returns {string|null} MAC address, or null on error
 */
function getMacAddress(device) {
  const addrFile = `/sys/class/net/${device}/address`;
  if (!fs.existsSync(addrFile)) {
    return null;
  }

  return fs.readFileSync(addrFile, 'utf8').trim();
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
function scanWirelessNetworks() {
  const status = getWirelessMode();

  const proc = child_process.spawnSync(
    'iwlist',
    ['scanning'],
    {encoding: 'utf8'}
  );

  if (proc.status !== 0) {
    return [];
  }

  const lines = proc.stdout
    .split('\n')
    .filter((l) => l.startsWith(' '))
    .map((l) => l.trim());

  const cells = [];
  let cell = {};

  for (const line of lines) {
    // New cell, start over
    if (line.startsWith('Cell ')) {
      if (cell.hasOwnProperty('ssid') &&
          cell.hasOwnProperty('quality') &&
          cell.hasOwnProperty('encryption') &&
          cell.ssid.length > 0) {
        if (status.mode === 'sta' && status.options.networks &&
            status.options.networks.includes(cell.ssid)) {
          cell.configured = true;
          cell.connected = status.enabled;
        } else {
          cell.configured = false;
          cell.connected = false;
        }

        cells.push(cell);
      }

      cell = {};
    }

    if (line.startsWith('ESSID:')) {
      cell.ssid = line.substring(7, line.length - 1);
    }

    if (line.startsWith('Quality=')) {
      cell.quality = parseInt(line.split(' ')[0].split('=')[1].split('/')[0]);
    }

    if (line.startsWith('Encryption key:')) {
      cell.encryption = line.split(':')[1] === 'on';
    }
  }

  return cells.sort((a, b) => b.quality - a.quality);
}

/**
 * Get the current addresses for wifi, LAN, and WAN.
 *
 * @returns {Object} Address object:
 *                   {
 *                     wan: '...',
 *                     lan: '...',
 *                     wlan: {
 *                       ip: '...',
 *                       ssid: '...',
 *                     }
 *                   }
 */
function getNetworkAddresses() {
  const result = {
    wan: '',
    lan: '',
    wlan: {
      ip: '',
      ssid: '',
    },
  };

  const interfaces = os.networkInterfaces();
  const res = uciShow('network.lan');
  if (!res.success) {
    return res;
  }

  const lanType = res.pairs['network.lan.type'];
  let lanIface = res.pairs['network.lan.ifname'];
  if (lanType && lanType[1] === 'bridge') {
    lanIface = 'br-lan';
  }

  if (lanIface && interfaces[lanIface]) {
    for (const addr of interfaces[lanIface]) {
      if (!addr.internal && addr.family === 'IPv4') {
        result.lan = addr.address;
        break;
      }
    }
  }

  const wanType = res.pairs['network.wan.type'];
  let wanIface = res.pairs['network.wan.ifname'];
  if (wanType && wanType[1] === 'bridge') {
    wanIface = 'br-wan';
  }

  if (wanIface && interfaces[wanIface]) {
    for (const addr of interfaces[wanIface]) {
      if (!addr.internal && addr.family === 'IPv4') {
        result.wan = addr.address;
        break;
      }
    }
  }

  if (interfaces.wlan0) {
    for (const addr of interfaces.wlan0) {
      if (!addr.internal && addr.family === 'IPv4') {
        result.wlan.ip = addr.address;
        break;
      }
    }
  }

  const status = getWirelessMode();
  if (status.enabled && status.options) {
    result.wlan.ssid = status.options.ssid;
  }

  return result;
}

/**
 * Update the gateway and the system.
 *
 * @returns {Promise} Promise which resolves when the update is complete.
 */
function update() {
  return new Promise((resolve, reject) => {
    let proc = child_process.spawnSync('opkg', ['update']);

    if (proc.status !== 0) {
      reject('opkg update failed');
      return;
    }

    proc = child_process.spawnSync(
      'opkg',
      ['list-upgradable'],
      {encoding: 'utf8'}
    );

    if (proc.status !== 0) {
      reject('opkg list-upgradable failed');
      return;
    }

    const packages = proc.stdout
      .split('\n')
      .map((l) => l.split(' ')[0]);

    if (packages.length === 0) {
      // nothing to update
      resolve({
        rebootRequired: false,
        gatewayRestartRequired: false,
      });
      return;
    }

    packages.unshift('upgrade');

    proc = child_process.spawnSync('opkg', packages);

    if (proc.status !== 0) {
      reject('opkg upgrade failed');
      return;
    }

    const rebootRequired = packages.filter((p) => {
      return p === 'kernel' || p.startsWith('kmod-');
    }).length > 0;

    const gatewayRestartRequired = packages.filter((p) => {
      return [
        'node-mozilla-iot-gateway',
        'node',
      ].includes(p);
    }).length > 0;

    resolve({
      rebootRequired,
      gatewayRestartRequired,
    });
  });
}

module.exports = {
  getCaptivePortalStatus,
  setCaptivePortalStatus,
  getDhcpServerStatus,
  setDhcpServerStatus,
  getHostname,
  setHostname,
  getLanMode,
  setLanMode,
  getMacAddress,
  getMdnsServerStatus,
  setMdnsServerStatus,
  getNetworkAddresses,
  getSshServerStatus,
  setSshServerStatus,
  getWanMode,
  setWanMode,
  getWirelessMode,
  setWirelessMode,
  restartGateway,
  restartSystem,
  scanWirelessNetworks,
  update,
};
