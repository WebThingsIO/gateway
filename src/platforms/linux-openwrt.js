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
const countryList = require('country-list');
const fs = require('fs');
const ipRegex = require('ip-regex');
const os = require('os');
const parse = require('csv-parse/lib/sync');

const DEBUG = false;

/**
 * Parses a text file looking for key/value pairs.
 *
 * @param {string} filename - name of the file to read
 * @param {string} key - key value to look for
 * @returns {string} - value that was looked up, or undefined
 */
function readValueFromFile(filename, key) {
  const data = fs.readFileSync(filename, 'utf8');
  const lines = data.split(/\n/);
  for (const line of lines) {
    const fields = line.split('=');
    if (fields.length == 2 && fields[0] == key) {
      let val = fields[1];
      if (val.length >= 2 && val[0] == '\'' && val[val.length - 1] == '\'') {
        // The /etc/openwrt_release file uses single quotes around all of
        // the values, so we strip those off. None of the values we expect
        // to be parsed should have embedded quotes, so we don't bother
        // trying to unescape.
        val = val.substring(1, val.length - 1);
      }
      return val;
    }
  }
}

const DISTRIB_ARCH = readValueFromFile('/etc/openwrt_release', 'DISTRIB_ARCH');

/**
 * Spawns a process, and captures the output.
 *
 * @param {string} label - label to use for debug messages
 * @param {string} cmd - command to execute
 * @param {string[]} args - array of arguments
 * @param {string} log - string to log instead of arguments when arguments
 *                       contains sensitive data
 * @param {string} errOk - true means don't log an error
 * @returns {object} as per child_process.spawnSync
 */
function spawnSync(label, cmd, args, {log = null, errOk = false} = {}) {
  args = args || [];
  if (DEBUG) {
    if (log) {
      console.log(`${label}:`, 'About to run:', cmd, log);
    } else {
      console.log(`${label}:`, 'About to run:', cmd, args.join(' '));
    }
  }
  const proc = child_process.spawnSync(cmd, args, {encoding: 'utf-8'});
  if (proc.status !== 0 && !errOk) {
    if (log) {
      console.error(`${label}:`, cmd, log, 'failed:', proc.status);
    } else {
      console.error(`${label}:`, cmd, args.join(' '), 'failed:', proc.status);
    }
  }
  return proc;
}

/**
 * Determines key values that we shouldn't really log.
 *
 * @param {string} key
 * @returns {boolean} true if the key should be redacted, false otherwise.
 */
function redactKey(key) {
  return (key.startsWith('wireless.') && key.endsWith('.key'));
}

/**
 * Determines key values that we shouldn't really log.
 *
 * @param {string} key
 * @param {string} value
 * @returns {string} Either returns '*** redacted ***' or the value
 *                   depending on the key.
 */
function redactedValue(key, value) {
  return redactKey(key) ? '*** redacted ***' : value;
}

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
function uciShow(label, key, {errOk = false} = {}) {
  let success = false;
  const pairs = {};

  const proc = spawnSync(label, 'uci', ['-d', '|', 'show', key], {errOk});
  success = proc.status === 0;

  for (const line of proc.stdout.split('\n')) {
    if (line.indexOf('=') < 0) {
      continue;
    }

    // eslint-disable-next-line prefer-const
    let [k, v] = line.split('=', 2);
    v = parseUciValue(v);
    DEBUG && console.log('  ', k, '=', redactedValue(k, v));
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
function uciGet(label, key, {asArray = false, errOk = false} = {}) {
  const proc = spawnSync(label, 'uci', ['-d', '|', 'get', key], {errOk});
  const success = proc.status === 0;
  const stdout = proc.stdout;
  if (DEBUG) {
    if (success) {
      console.error(`${label}`, '  ', redactedValue(key, stdout.trim()));
    } else {
      console.error(`${label}`, '  ', proc.stderr.trim());
    }
  }
  const value = parseUciValue(stdout, {asArray});
  return {success, value};
}

/**
 * Run `uci set {key}`.
 *
 * @param {string} key - The key to set
 * @param {string|string[]} value - The value(s) to set
 * @returns {boolean} Whether or not the command was successful
 */
function uciSet(label, key, value) {
  if (Array.isArray(value)) {
    // Failing to delete a nonexistent key is fine.
    spawnSync(label, 'uci', ['delete', key], {errOk: true});
    for (const v of value) {
      const proc = spawnSync(label, 'uci', ['add_list', `${key}=${v}`]);
      if (proc.status !== 0) {
        return false;
      }
    }
  } else if (value === null) {
    // Failing to delete a nonexistent key is fine.
    spawnSync(label, 'uci', ['delete', key], {errOk: true});
  } else {
    const proc = spawnSync(label, 'uci', ['set', `${key}=${value}`],
                           {log: `set ${key}=${redactedValue(key, value)}`});
    return proc.status === 0;
  }
  return true;
}

/**
 * Run `uci commit {key}`.
 *
 * @param {string} key - The key to commit
 * @returns {boolean} Whether or not the command was successful
 */
function uciCommit(label, key) {
  const proc = spawnSync(label, 'uci', ['commit', key]);
  return proc.status === 0;
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
  const action = add ? 'Redirecting' : 'Removing redirection';
  console.log(`${action} from ${fromPort} to ${toPort} (for ${ipaddr})`);

  const label = 'redirectTcpPort';

  let proc = spawnSync(label, 'iptables', [
    '-t', 'mangle',
    add ? '-A' : '-D', 'PREROUTING',
    '-p', 'tcp',
    '--dst', ipaddr,
    '--dport', fromPort,
    '-j', 'MARK',
    '--set-mark', '1',
  ]);
  if (proc.status !== 0) {
    return false;
  }

  proc = spawnSync(label, 'iptables', [
    '-t', 'nat',
    add ? '-A' : '-D', 'PREROUTING',
    '-p', 'tcp',
    '--dst', ipaddr,
    '--dport', fromPort,
    '-j', 'REDIRECT',
    '--to-port', toPort,
  ]);
  if (proc.status !== 0) {
    return false;
  }

  proc = spawnSync(label, 'iptables', [
    add ? '-I' : '-D', 'INPUT',
    '-m', 'conntrack',
    '--ctstate', 'NEW',
    '-m', 'tcp',
    '-p', 'tcp',
    '--dport', toPort,
    '-m', 'mark',
    '--mark', '1',
    '-j', 'ACCEPT',
  ]);
  return proc.status === 0;
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
  const label = 'isRedirectedTcpPort';
  const cmd = 'iptables';
  const args = [
    '-t', 'nat',
    '--list-rules',
  ];
  const proc = spawnSync(label, cmd, args);
  if (proc.status !== 0) {
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
      DEBUG && console.log(`${label}: returning true`);
      return true;
    }
  }
  DEBUG && console.log(`${label}: returning false`);
  return false;
}

/**
 * Get Architecture
 *
 * @param {string} default architecture detected by the gateway.
 * @returns {string} Architecture to use.
 */

function getPlatformArchitecture(_defaultArchitecture) {
  if (DISTRIB_ARCH) {
    return `openwrt-linux-${DISTRIB_ARCH}`;
  }
  return `openwrt-linux-unknown`;
}

/**
 * Get Captive Portal status.
 *
 * @returns {boolean} Boolean indicating whether or not captive portal is
 *                    enabled.
 */

function getCaptivePortalStatus() {
  const label = 'getCaptivePortalStatus';
  const result = uciGet(label, 'dhcp.@dnsmasq[0].address', {asArray: true});
  if (!result.success) {
    return false;
  }

  for (const value of result.value) {
    if (value.startsWith('/#/')) {
      // The pattern /#/IP-ADDRESS is the make all host names resolve
      // to IP-ADDRESS pattern used in setCaptivePortalStatus.
      DEBUG && console.log(`${label}: returning true`);
      return true;
    }
  }
  DEBUG && console.log(`${label}: returning true`);
  return false;
}

/**
 * Set Captive Portal status.
 * @param {boolean} enabled - Whether or not to enable the DHCP server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setCaptivePortalStatus(enabled, options = {}) {
  const regex = ipRegex({exact: true});
  if (options.ipaddr && !regex.test(options.ipaddr)) {
    return false;
  }

  const label = 'setCaptivePortalStatus';
  DEBUG && console.log(`${label}: enabled`, enabled, 'options:', options);
  const httpSrcPort = 80;
  const httpDstPort = config.get('ports.http');
  const httpsSrcPort = 443;
  const httpsDstPort = config.get('ports.https');
  if (enabled) {
    if (!isRedirectedTcpPort(options.ipaddr, httpSrcPort, httpDstPort)) {
      if (!redirectTcpPort(enabled, options.ipaddr, httpSrcPort, httpDstPort)) {
        return false;
      }
    }
    if (!isRedirectedTcpPort(httpsSrcPort, httpsDstPort)) {
      if (!redirectTcpPort(enabled, options.ipaddr,
                           httpsSrcPort, httpsDstPort)) {
        return false;
      }
    }
  }

  const result = uciGet(label, 'dhcp.@dnsmasq[0].address',
                        {asArray: true, errOk: true});
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
  if (!uciSet(label, 'dhcp.@dnsmasq[0].address', addresses)) {
    return false;
  }

  if (!uciCommit(label, 'dhcp')) {
    return false;
  }

  if (options.restart) {
    const proc = spawnSync(label, '/etc/init.d/dnsmasq', ['restart']);
    if (proc.status !== 0) {
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
  const label = 'getDhcpServerStatus';
  const result = uciGet(label, 'dhcp.lan.ignore');
  if (!result.success) {
    DEBUG && console.log(`${label}: returning false`);
    return false;
  }

  DEBUG && console.log(`${label}: returning`, result.value === '0');
  return result.value === '0';
}

/**
 * Set DHCP server status.
 *
 * @param {boolean} enabled - Whether or not to enable the DHCP server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setDhcpServerStatus(enabled, options = {}) {
  const label = 'setDhcpServerStatus';
  DEBUG && console.log(`${label}: enabled:`, enabled,
                       'options:', options);
  if (!uciSet(label, 'dhcp.lan.ignore', enabled ? '0' : '1')) {
    return false;
  }

  if (!uciSet(label, 'dhcp.lan.dhcpv6', enabled ? 'server' : 'disabled')) {
    return false;
  }

  if (!uciSet(label, 'dhcp.lan.ra', enabled ? 'server' : 'disabled')) {
    return false;
  }

  if (!uciSet(label, 'dhcp.lan.dhcp_option',
              [`3,${options.ipaddr}`, `6,${options.ipaddr}`])) {
    return false;
  }

  if (!uciCommit(label, 'dhcp')) {
    return false;
  }

  // Use restart instead of start to cover the case where the server
  // is already running.
  let proc = spawnSync(label, '/etc/init.d/dnsmasq',
                       [enabled ? 'restart' : 'stop']);
  if (proc.status !== 0) {
    return false;
  }

  proc = spawnSync(label, '/etc/init.d/dnsmasq',
                   [enabled ? 'enable' : 'disable']);
  if (proc.status !== 0) {
    return false;
  }

  proc = spawnSync(label, '/etc/init.d/odhcpd',
                   [enabled ? 'restart' : 'stop']);
  if (proc.status !== 0) {
    return false;
  }

  proc = spawnSync(label, '/etc/init.d/odhcpd',
                   [enabled ? 'enable' : 'disable']);
  return proc.status === 0;
}

/**
 * Get the LAN mode and options.
 *
 * @returns {Object} {mode: 'static|dhcp|...', options: {...}}
 */
function getLanMode() {
  const label = 'getLanMode';
  let mode = null;
  const options = {};

  const result = uciShow(label, 'network.lan');
  if (!result.success) {
    DEBUG && console.log(`${label}: returning`, {mode, options});
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

  DEBUG && console.log(`${label}: returning`, {mode, options});
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
  const label = 'setLanMode';
  DEBUG && console.log('setLanMode: mode:', mode, 'options:', options);
  const valid = ['static', 'dhcp'];
  if (!valid.includes(mode)) {
    console.error(`setLanMode: Invalid mode: ${mode}`);
    return false;
  }

  const regex = ipRegex({exact: true});
  if ((options.ipaddr && !regex.test(options.ipaddr)) ||
      (options.netmask && !regex.test(options.netmask)) ||
      (options.gateway && !regex.test(options.gateway)) ||
      (options.dns && options.dns.filter((d) => !regex.test(d)).length > 0)) {
    return false;
  }

  if (!uciSet(label, 'network.lan.proto', mode)) {
    return false;
  }

  for (const [key, value] of Object.entries(options)) {
    if (!uciSet(label, `network.lan.${key}`, value)) {
      return false;
    }
  }

  if (!uciCommit(label, 'network')) {
    return false;
  }

  const proc = spawnSync(label, '/etc/init.d/network', ['reload']);
  return proc.status === 0;
}

/**
 * Get the WAN mode and options.
 *
 * @returns {Object} {mode: 'static|dhcp|pppoe|...', options: {...}}
 */
function getWanMode() {
  const label = 'getWanMode';
  let mode = null;
  const options = {};

  const result = uciShow(label, 'network.wan', {errOk: true});
  if (!result.success) {
    DEBUG && console.log(`${label}: returning`, {mode, options});
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

  DEBUG && console.log(`${label}: returning`, {mode, options});
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
  const label = 'setWanMode';
  DEBUG && console.log('setWanMode: mode:', mode, 'options:', options);
  const valid = ['static', 'dhcp', 'pppoe'];
  if (!valid.includes(mode)) {
    return false;
  }

  const regex = ipRegex({exact: true});
  if ((options.ipaddr && !regex.test(options.ipaddr)) ||
      (options.netmask && !regex.test(options.netmask)) ||
      (options.gateway && !regex.test(options.gateway)) ||
      (options.dns && options.dns.filter((d) => !regex.test(d)).length > 0)) {
    return false;
  }

  const result = uciGet(label, 'network.wan', {errOk: true});
  if (!result.success) {
    if (!uciSet(label, 'network.wan', 'interface')) {
      return false;
    }
  }

  if (!uciSet(label, 'network.wan.proto', mode)) {
    return false;
  }

  // TODO: Setting ifname to eth0 is RPi specific. This will change based
  //       on the router. For example, on the Turris Omnia, eth1 is the WAN
  //       port.
  if (!options.hasOwnProperty('ifname')) {
    options.ifname = 'eth0';
  }

  for (const [key, value] of Object.entries(options)) {
    if (!uciSet(label, `network.wan.${key}`, value)) {
      return false;
    }
  }

  if (!uciCommit(label, 'network')) {
    return false;
  }

  const proc = spawnSync(label, '/etc/init.d/network', ['reload']);
  return proc.status === 0;
}

/**
 * Get the wireless mode and options.
 *
 * @returns {Object} {enabled: true|false, mode: 'ap|sta|...', options: {...}}
 */
function getWirelessMode() {
  const label = 'getWirelessMode';
  let enabled = false;
  let mode = null;
  const options = {};

  let result = uciShow(label, 'wireless');
  if (!result.success) {
    DEBUG && console.log(`${label}: returning`, {enabled, mode});
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
    DEBUG && console.log(`${label}: returning`, {enabled, mode});
    return {enabled, mode, options};
  }

  const key = `wireless.${device}.disabled`;
  result = uciGet(label, key);
  if (!result.success) {
    enabled = true;
  } else {
    enabled = result.value === '0';
  }

  result = uciShow(label, iface);
  if (!result.success) {
    DEBUG && console.log(`${label}: returning`, {enabled, mode});
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

  DEBUG && console.log(`${label}: returning`, {enabled, mode});
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
  const label = 'setWirelessMode';
  DEBUG && console.log(`${label}: enabled:`, enabled, 'mode:', mode);
  const valid = ['ap', 'sta'];
  if (enabled && !valid.includes(mode)) {
    return false;
  }

  const regex = ipRegex({exact: true});
  if (options.ipaddr && !regex.test(options.ipaddr)) {
    return false;
  }

  const result = uciShow(label, 'wireless');
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
    if (!uciSet(label, `wireless.${device}.disabled`, enabled ? '0' : '1')) {
      return false;
    }

    if (!uciSet(label, `${iface}.disabled`, enabled ? '0' : '1')) {
      return false;
    }

    if (enabled) {
      if (!uciSet(label, `${iface}.mode`, mode)) {
        return false;
      }

      for (const [key, value] of Object.entries(options)) {
        if (!uciSet(label, `${iface}.${key}`, value)) {
          return false;
        }
      }
    }
  }

  if (!uciCommit(label, 'wireless')) {
    return false;
  }

  let proc;
  if (enabled) {
    proc = spawnSync(label, 'wifi');
  } else {
    proc = spawnSync(label, 'wifi', ['down']);
  }
  return proc.status === 0;
}

/**
 * Get SSH server status.
 *
 * @returns {boolean} Boolean indicating whether or not SSH is enabled.
 */
function getSshServerStatus() {
  const label = 'getSshServerStatus';
  let service = null;
  for (const svc of ['/etc/init.d/dropbear',
                     '/etc/init.d/sshd']) {
    if (fs.existsSync(svc)) {
      service = svc;
      break;
    }
  }

  if (service === null) {
    DEBUG && console.log(`${label}: returning false`);
    return false;
  }

  const proc = spawnSync(label, service, ['enabled']);
  DEBUG && console.log(`${label}: returning`, proc.status === 0);
  return proc.status === 0;
}

/**
 * Set SSH server status.
 *
 * @param {boolean} enabled - Whether or not to enable the SSH server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setSshServerStatus(enabled) {
  const label = 'setSshServerStatus';
  DEBUG && console.log(`${label}: enabled:`, enabled);
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

  let proc = spawnSync(label, service, [enabled ? 'start' : 'stop']);
  if (proc.status !== 0) {
    return false;
  }

  proc = spawnSync(label, service, [enabled ? 'enable' : 'disable']);
  return proc.status === 0;
}

/**
 * Get mDNS server status.
 *
 * @returns {boolean} Boolean indicating whether or not mDNS is enabled.
 */
function getMdnsServerStatus() {
  const label = 'getMdnsServerStatus';
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
    DEBUG && console.log(`${label}: returning false`);
    return false;
  }

  const proc = spawnSync(label, service, ['enabled']);
  DEBUG && console.log(`${label}: returning`, proc.status === 0);
  return proc.status === 0;
}

/**
 * Set mDNS server status.
 *
 * @param {boolean} enabled - Whether or not to enable the mDNS server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setMdnsServerStatus(enabled) {
  const label = 'setMdnsServerStatus';
  DEBUG && console.log(`${label}: enabled:`, enabled);
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

  let proc = spawnSync(label, service, [enabled ? 'start' : 'stop']);
  if (proc.status !== 0) {
    return false;
  }

  proc = spawnSync(label, service, [enabled ? 'enable' : 'disable']);
  return proc.status === 0;
}

/**
 * Get the system's hostname.
 *
 * @returns {string} The hostname.
 */
function getHostname() {
  const label = 'getHostName';
  const result = uciGet(label, 'system.@system[0].hostname');
  if (!result.success) {
    DEBUG && console.log(`${label}: getHostname returning ''`);
    return '';
  }

  DEBUG && console.log(`${label}: getHostname returning '${result.value}'`);
  return result.value;
}

/**
 * Set the system's hostname.
 *
 * @param {string} hostname - The hostname to set
 * @returns {boolean} Boolean indicating success of the command.
 */
function setHostname(hostname) {
  const label = 'setHostname';
  DEBUG && console.log(`${label}: hostname:`, hostname);
  hostname = hostname.toLowerCase();
  const re = new RegExp(/^([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])$/);
  const valid = re.test(hostname) && hostname.length <= 63;
  if (!valid) {
    return false;
  }

  if (!uciSet(label, 'system.@system[0].hostname', hostname)) {
    return false;
  }

  if (!uciCommit(label, 'system')) {
    return false;
  }

  let proc = spawnSync(label, '/etc/init.d/system', ['reload']);
  if (proc.status !== 0) {
    return false;
  }

  if (!uciSet(label, 'network.lan.hostname', hostname)) {
    return false;
  }

  if (!uciCommit(label, 'network')) {
    return false;
  }

  proc = spawnSync(label, '/etc/init.d/network', ['reload']);
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

  proc = spawnSync(label, service, ['restart']);
  return proc.status === 0;
}

/**
 * This function is called when not performing router setup. It
 * performs any non-static configuration that's needed.
 *
 * @returns {Promise} Promise which resolves to true/false, indicating whether
 *                    or not we have a connection.
 */

function checkConnection() {
  // The iptables configuration is not persisted across a reboot, so
  // we do it here.
  return new Promise((resolve, reject) => {
    const httpSrcPort = 80;
    const httpDstPort = config.get('ports.http');
    const httpsSrcPort = 443;
    const httpsDstPort = config.get('ports.https');
    const ipaddr = config.get('wifi.ap.ipaddr');

    if (!isRedirectedTcpPort(ipaddr, httpSrcPort, httpDstPort)) {
      if (!redirectTcpPort(true, ipaddr, httpSrcPort, httpDstPort)) {
        reject('Failed to redirect port ${httpSrcPort} to ${httpDstPort}');
      }
    }
    if (!isRedirectedTcpPort(httpsSrcPort, httpsDstPort)) {
      if (!redirectTcpPort(true, ipaddr, httpsSrcPort, httpsDstPort)) {
        reject('Failed to redirect port ${httpsSrcPort} to ${httpsDstPort}');
      }
    }
    resolve(true);
  });
}

/**
 * Restart the gateway process.
 *
 * @returns {boolean} Boolean indicating success of the command.
 */
function restartGateway() {
  const label = 'restartGateway';
  const proc = spawnSync(
    label,
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
  const label = 'restartSystem';
  const proc = spawnSync(label, 'reboot');

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
    DEBUG && console.log('getMacAddress: returning null');
    return null;
  }

  const macAddr = fs.readFileSync(addrFile, 'utf8').trim();
  DEBUG && console.log('getMacAddress: returning', macAddr);
  return macAddr;
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
  const label = 'scanWirelessNetworks';
  const status = getWirelessMode();

  const proc = spawnSync(
    label,
    'iwlist',
    ['scanning']
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

  const result = cells.sort((a, b) => b.quality - a.quality);
  DEBUG && console.log(`${label}: returning`, result);
  return result;
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
  const label = 'getNetworkAddresses';
  const result = {
    wan: '',
    lan: '',
    wlan: {
      ip: '',
      ssid: '',
    },
  };

  const interfaces = os.networkInterfaces();
  const res = uciShow(label, 'network');
  if (!res.success) {
    return res;
  }

  const lanType = res.pairs['network.lan.type'];
  let lanIface = res.pairs['network.lan.ifname'];
  if (lanType === 'bridge') {
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
  if (wanType === 'bridge') {
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

  DEBUG && console.log(`${label}: returning`, result);
  return result;
}

/**
 * Update the gateway and the system.
 *
 * @returns {Promise} Promise which resolves when the update is complete.
 */
function update() {
  const label = 'update';
  return new Promise((resolve, reject) => {
    let proc = spawnSync(label, 'opkg', ['update']);

    if (proc.status !== 0) {
      reject('opkg update failed');
      return;
    }

    proc = spawnSync(
      label,
      'opkg',
      ['list-upgradable']
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

    proc = spawnSync(label, 'opkg', packages);

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

/**
 * Get a list of all valid timezones for the system.
 *
 * @returns {string[]} List of timezones.
 */
function getValidTimezones() {
  const tzdata = '/usr/lib/lua/luci/sys/zoneinfo/tzdata.lua';
  if (!fs.existsSync(tzdata)) {
    return [];
  }

  try {
    const data = fs.readFileSync(tzdata, 'utf8');
    const zones = data.split('\n')
      .filter((l) => l.startsWith('\t{'))
      .map((l) => l.split('\'')[1])
      .sort();

    return zones;
  } catch (e) {
    console.error('Failed to read zone file:', e);
  }

  return [];
}

/**
 * Get the current timezone.
 *
 * @returns {string} Name of timezone.
 */
function getTimezone() {
  const label = 'getTimezone';
  const result = uciGet(label, 'system.@system[0].zonename');
  if (!result.success) {
    DEBUG && console.log(`${label}: getTimezone returning ''`);
    return '';
  }

  DEBUG && console.log(`${label}: getTimezone returning '${result.value}'`);
  return result.value;
}

/**
 * Set the current timezone.
 *
 * @param {string} zone - The timezone to set
 * @returns {boolean} Boolean indicating success of the command.
 */
function setTimezone(zone) {
  const label = 'setTimezone';

  const tzdata = '/usr/lib/lua/luci/sys/zoneinfo/tzdata.lua';
  if (!fs.existsSync(tzdata)) {
    return [];
  }

  let zones;
  try {
    const data = fs.readFileSync(tzdata, 'utf8');
    zones = data.split('\n')
      .filter((l) => l.startsWith('\t{'))
      .map((l) => {
        const fields = l.split('\'');
        return [fields[1], fields[3]];
      });
  } catch (e) {
    console.error('Failed to read zone file:', e);
    return false;
  }

  const data = zones.find((z) => z[0] === zone);
  if (!data) {
    return false;
  }

  if (!uciSet(label, 'system.@system[0].zonename', data[0])) {
    return false;
  }

  if (!uciSet(label, 'system.@system[0].timezone', data[1])) {
    return false;
  }

  if (!uciCommit(label, 'system')) {
    return false;
  }

  const proc = spawnSync(label, '/etc/init.d/system', ['reload']);
  return proc.status === 0;
}

/**
 * Get a list of all valid wi-fi countries for the system.
 *
 * @returns {string[]} list of countries.
 */
function getValidWirelessCountries() {
  const label = 'getValidWirelessCountries';
  const proc = spawnSync(label, 'iwinfo', ['wlan0', 'countrylist']);

  if (proc.status !== 0) {
    return [];
  }

  return proc.stdout.split('\n')
    .map((l) => l.split(/\s+/g)[1])
    .filter((l) => typeof l === 'string' && l !== '00')
    .map((l) => countryList.getName(l))
    .sort();
}

/**
 * Get the wi-fi country code.
 *
 * @returns {string} Country.
 */
function getWirelessCountry() {
  const label = 'getWirelessCountry';
  const proc = spawnSync(label, 'iwinfo', ['wlan0', 'countrylist']);

  if (proc.status !== 0) {
    return '';
  }

  const selected = proc.stdout.split('\n').find((l) => l.startsWith('*'));
  if (!selected) {
    return '';
  }

  const code = selected.split(/\s+/g)[1];
  return countryList.getName(code) || '';
}

/**
 * Set the wi-fi country code.
 *
 * @param {string} country - The country code to set
 * @returns {boolean} Boolean indicating success of the command.
 */
function setWirelessCountry(country) {
  const label = 'setWirelessCountry';
  let proc = spawnSync(label, 'iwinfo', ['wlan0', 'countrylist']);

  if (proc.status !== 0) {
    return false;
  }

  const countries = proc.stdout.split('\n')
    .map((l) => l.split(/\s+/g)[1])
    .filter((l) => typeof l === 'string' && l !== '00')
    .map((l) => [l, countryList.getName(l)]);

  const data = countries.find((c) => c[1] === country);
  if (!data) {
    return false;
  }

  proc = spawnSync(label, 'iw', ['reg', 'set', data[0]]);
  return proc.status === 0;
}

module.exports = {
  getPlatformArchitecture,
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
  checkConnection,
  restartGateway,
  restartSystem,
  scanWirelessNetworks,
  update,
  getValidTimezones,
  getTimezone,
  setTimezone,
  getValidWirelessCountries,
  getWirelessCountry,
  setWirelessCountry,
};
