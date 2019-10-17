/**
 * Raspbian platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const child_process = require('child_process');
const fs = require('fs');
const ipRegex = require('ip-regex');
const os = require('os');

/**
 * Get DHCP server status.
 *
 * @returns {boolean} Boolean indicating whether or not DHCP is enabled.
 */
function getDhcpServerStatus() {
  const proc = child_process.spawnSync(
    'sudo',
    ['systemctl', 'is-active', 'dnsmasq.service']
  );
  return proc.status === 0;
}

/**
 * Set DHCP server status.
 *
 * @param {boolean} enabled - Whether or not to enable the DHCP server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setDhcpServerStatus(enabled) {
  let proc = child_process.spawnSync(
    'sudo',
    ['systemctl', enabled ? 'start' : 'stop', 'dnsmasq.service']
  );
  if (proc.status !== 0) {
    return false;
  }

  proc = child_process.spawnSync(
    'sudo',
    ['systemctl', enabled ? 'enable' : 'disable', 'dnsmasq.service']
  );
  return proc.status === 0;
}

/**
 * Get the LAN mode and options.
 *
 * @returns {Object} {mode: 'static|dhcp|...', options: {...}}
 */
function getLanMode() {
  let mode = 'static';
  const options = {};

  if (!fs.existsSync('/etc/network/interfaces.d/eth0')) {
    mode = 'dhcp';
    return {mode, options};
  }

  const data = fs.readFileSync('/etc/network/interfaces.d/eth0', 'utf8');
  for (const line of data.trim().split('\n')) {
    const parts = line.trim().split(' ').filter((s) => s.length > 0);

    switch (parts[0]) {
      case 'iface':
        mode = parts[3];
        break;
      case 'address':
        options.ipaddr = parts[1];
        break;
      case 'netmask':
        options.netmask = parts[1];
        break;
      case 'gateway':
        options.gateway = parts[1];
        break;
      case 'dns-nameservers':
        options.dns = parts.slice(1);
        break;
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
    return false;
  }

  const regex = ipRegex({exact: true});
  if ((options.ipaddr && !regex.test(options.ipaddr)) ||
      (options.netmask && !regex.test(options.netmask)) ||
      (options.gateway && !regex.test(options.gateway)) ||
      (options.dns && options.dns.filter((d) => !regex.test(d)).length > 0)) {
    return false;
  }

  let entry = `auto eth0\niface eth0 inet ${mode}\n`;
  if (options.ipaddr) {
    entry += `    address ${options.ipaddr}\n`;
  }
  if (options.netmask) {
    entry += `    netmask ${options.netmask}\n`;
  }
  if (options.gateway) {
    entry += `    gateway ${options.gateway}\n`;
  }
  if (options.dns) {
    entry += `    dns-nameservers ${options.dns.join(' ')}\n`;
  }

  fs.writeFileSync('/tmp/eth0', entry);

  let proc = child_process.spawnSync(
    'sudo',
    ['mv', '/tmp/eth0', '/etc/network/interfaces.d/']
  );

  if (proc.status !== 0) {
    return false;
  }

  proc = child_process.spawnSync(
    'sudo',
    ['systemctl', 'restart', 'networking.service']
  );
  return proc.status === 0;
}

/**
 * Get the wireless mode and options.
 *
 * @returns {Object} {enabled: true|false, mode: 'ap|sta|...', options: {...}}
 */
function getWirelessMode() {
  let enabled = false, mode = '', cipher = '', mgmt = '';
  const options = {};

  let proc = child_process.spawnSync(
    'sudo',
    ['systemctl', 'is-active', 'hostapd.service']
  );
  if (proc.status === 0) {
    mode = 'ap';
    enabled = true;

    const data = fs.readFileSync('/etc/hostapd/hostapd.conf', 'utf8');
    if (data) {
      for (const line of data.split('\n')) {
        if (line.startsWith('#')) {
          continue;
        }

        const [key, value] = line.split('=', 2);
        switch (key) {
          case 'ssid':
            options.ssid = value;
            break;
          case 'wpa':
            switch (value) {
              case '0':
                mgmt = 'none';
                break;
              case '1':
                mgmt = 'psk';
                break;
              case '2':
                mgmt = 'psk2';
                break;
            }
            break;
          case 'wpa_passphrase':
            options.key = value;
            break;
          case 'wpa_pairwise':
            if (value.indexOf('TKIP') >= 0) {
              cipher += '+tkip';
            }
            if (value.indexOf('CCMP') >= 0) {
              cipher += '+ccmp';
            }
            break;
        }
      }
    }
  } else {
    mode = 'sta';
    proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'status'],
      {encoding: 'utf8'}
    );

    if (proc.status !== 0) {
      return {enabled, mode, options};
    }

    for (const line of proc.stdout.split('\n')) {
      const [key, value] = line.split('=', 2);
      switch (key) {
        case 'wpa_state':
          enabled = line.split('=')[1] === 'COMPLETED';
          break;
        case 'ssid':
          options.ssid = line.substring(5);
          break;
        case 'key_mgmt':
          switch (value) {
            case 'WPA2-PSK':
              mgmt = 'psk2';
              break;
            default:
              mgmt = value.toLowerCase();
              break;
          }
          break;
        case 'pairwise_cipher':
          if (value.indexOf('TKIP') >= 0) {
            cipher += '+tkip';
          }
          if (value.indexOf('CCMP') >= 0) {
            cipher += '+ccmp';
          }
          break;
      }
    }

    proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'list_networks'],
      {encoding: 'utf8'}
    );
    if (proc.status !== 0) {
      return {enabled, mode, options};
    }

    options.networks = [];
    for (const line of proc.stdout.trim().split('\n')) {
      if (line.startsWith('network')) {
        continue;
      }

      const ssid = line.split('\t')[1];
      if (ssid) {
        options.networks.push(ssid);
      }
    }
  }

  if (mgmt) {
    options.encryption = mgmt;

    if (mgmt !== 'none' && cipher) {
      options.encryption += cipher;
    }
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

  const regex = ipRegex({exact: true});
  if (options.ipaddr && !regex.test(options.ipaddr)) {
    return false;
  }

  // First, remove existing networks
  let proc = child_process.spawnSync(
    'wpa_cli',
    ['-i', 'wlan0', 'list_networks'],
    {encoding: 'utf8'}
  );
  if (proc.status === 0) {
    const networks = proc.stdout.split('\n')
      .filter((l) => !l.startsWith('network'))
      .map((l) => l.split(' ')[0])
      .reverse();

    for (const id of networks) {
      proc = child_process.spawnSync(
        'wpa_cli',
        ['-i', 'wlan0', 'remove_network', id]
      );
      if (proc.status !== 0) {
        console.log('Failed to remove network with id:', id);
      }
    }
  }

  // Then, stop hostapd. It will either need to be off or reconfigured, so
  // this is valid in both modes.
  proc = child_process.spawnSync(
    'sudo',
    ['systemctl', 'stop', 'hostapd.service']
  );
  if (proc.status !== 0) {
    return false;
  }

  if (!enabled) {
    proc = child_process.spawnSync(
      'sudo',
      ['systemctl', 'disable', 'hostapd.service']
    );
    return proc.status === 0;
  }

  // Now, set the IP address back to a sane state
  proc = child_process.spawnSync(
    'sudo',
    ['ifconfig', 'wlan0', '0.0.0.0']
  );
  if (proc.status !== 0) {
    return false;
  }

  if (mode === 'sta') {
    proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'add_network'],
      {encoding: 'utf8'}
    );
    if (proc.status !== 0) {
      return false;
    }

    const id = proc.stdout.trim();

    options.ssid = options.ssid.replace('"', '\\"');
    proc = child_process.spawnSync(
      'wpa_cli',
      // the ssid argument MUST be quoted
      ['-i', 'wlan0', 'set_network', id, 'ssid', `"${options.ssid}"`]
    );
    if (proc.status !== 0) {
      return false;
    }

    if (options.key) {
      options.key = options.key.replace('"', '\\"');
      proc = child_process.spawnSync(
        'wpa_cli',
        // the psk argument MUST be quoted
        ['-i', 'wlan0', 'set_network', id, 'psk', `"${options.key}"`]
      );
    } else {
      proc = child_process.spawnSync(
        'wpa_cli',
        ['-i', 'wlan0', 'set_network', id, 'key_mgmt', 'NONE']
      );
    }

    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'enable_network', id]
    );
    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync(
      'wpa_cli',
      ['-i', 'wlan0', 'save_config']
    );
    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync(
      'sudo',
      ['systemctl', 'disable', 'hostapd.service']
    );
    if (proc.status !== 0) {
      return false;
    }
  } else {
    let config = 'interface=wlan0\n';
    config += 'driver=nl80211\n';
    config += 'hw_mode=g\n';
    config += 'channel=6\n';
    config += `ssid=${options.ssid}\n`;

    if (options.key) {
      config += 'wpa=2\n';
      config += `wpa_passphrase=${options.key}\n`;
      config += 'wpa_pairwise=CCMP\n';
    }

    fs.writeFileSync('/tmp/hostapd.conf', config);

    proc = child_process.spawnSync(
      'sudo',
      ['mv', '/tmp/hostapd.conf', '/etc/hostapd/hostapd.conf']
    );

    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync(
      'sudo',
      ['systemctl', 'start', 'hostapd.service']
    );
    if (proc.status !== 0) {
      return false;
    }

    proc = child_process.spawnSync(
      'sudo',
      ['systemctl', 'enable', 'hostapd.service']
    );
    if (proc.status !== 0) {
      return false;
    }
  }

  if (options.ipaddr) {
    proc = child_process.spawnSync(
      'sudo',
      ['ifconfig', 'wlan0', options.ipaddr]
    );
    if (proc.status !== 0) {
      return false;
    }

    if (mode === 'ap') {
      // set up a default route when running in AP mode. ignore errors here and
      // just try to move on.
      child_process.spawnSync(
        'sudo',
        ['ip', 'route', 'add', 'default', 'via', options.ipaddr, 'dev', 'wlan0']
      );
    }
  }

  return true;
}

/**
 * Get SSH server status.
 *
 * @returns {boolean} Boolean indicating whether or not SSH is enabled.
 */
function getSshServerStatus() {
  const proc = child_process.spawnSync(
    'sudo',
    ['raspi-config', 'nonint', 'get_ssh'],
    {encoding: 'utf8'}
  );

  if (proc.status !== 0) {
    return false;
  }

  return proc.stdout.trim() === '0';
}

/**
 * Set SSH server status.
 *
 * @param {boolean} enabled - Whether or not to enable the SSH server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setSshServerStatus(enabled) {
  const arg = enabled ? '0' : '1';
  const proc = child_process.spawnSync(
    'sudo',
    ['raspi-config', 'nonint', 'do_ssh', arg]
  );
  return proc.status === 0;
}

/**
 * Get mDNS server status.
 *
 * @returns {boolean} Boolean indicating whether or not mDNS is enabled.
 */
function getMdnsServerStatus() {
  const proc = child_process.spawnSync(
    'sudo',
    ['systemctl', 'is-active', 'avahi-daemon.service']
  );
  return proc.status === 0;
}

/**
 * Set mDNS server status.
 *
 * @param {boolean} enabled - Whether or not to enable the mDNS server
 * @returns {boolean} Boolean indicating success of the command.
 */
function setMdnsServerStatus(enabled) {
  let proc = child_process.spawnSync(
    'sudo',
    ['systemctl', enabled ? 'start' : 'stop', 'avahi-daemon.service']
  );
  if (proc.status !== 0) {
    return false;
  }

  proc = child_process.spawnSync(
    'sudo',
    ['systemctl', enabled ? 'enable' : 'disable', 'avahi-daemon.service']
  );
  return proc.status === 0;
}

/**
 * Get the system's hostname.
 *
 * @returns {string} The hostname.
 */
function getHostname() {
  return fs.readFileSync('/etc/hostname', 'utf8').trim();
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

  // Read in the current hostname
  let original = fs.readFileSync('/etc/hostname', 'utf8');
  if (original) {
    original = original.trim();
  }

  // Do this with sed, as it's the easiest way to write the file as root.
  let proc = child_process.spawnSync(
    'sudo',
    ['sed', '-i', '-e', `s/^.*$/${hostname}/`, '/etc/hostname']
  );
  if (proc.status !== 0) {
    return false;
  }

  proc = child_process.spawnSync('sudo', ['hostname', hostname]);
  if (proc.status !== 0) {
    // Set the original hostname back
    child_process.spawnSync(
      'sudo',
      ['sed', '-i', '-e', `s/^.*$/${original}/`, '/etc/hostname']
    );

    return false;
  }

  proc = child_process.spawnSync(
    'sudo',
    ['systemctl', 'restart', 'avahi-daemon.service']
  );
  if (proc.status !== 0) {
    // Set the original hostname back
    child_process.spawnSync(
      'sudo',
      ['sed', '-i', '-e', `s/^.*$/${original}/`, '/etc/hostname']
    );
    child_process.spawnSync('sudo', ['hostname', original]);

    return false;
  }

  proc = child_process.spawnSync(
    'sudo',
    [
      'sed',
      '-i',
      '-E',
      '-e',
      `s/(127\\.0\\.1\\.1[ \\t]+)${original}/\\1${hostname}/g`,
      '/etc/hosts',
    ]
  );
  return proc.status === 0;
}

/**
 * Restart the gateway process.
 *
 * @returns {boolean} Boolean indicating success of the command.
 */
function restartGateway() {
  const proc = child_process.spawnSync(
    'sudo',
    ['systemctl', 'restart', 'mozilla-iot-gateway.service']
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
  const proc = child_process.spawnSync('sudo', ['reboot']);

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
    'sudo',
    ['iwlist', 'scanning'],
    {encoding: 'utf8'}
  );

  if (proc.status !== 0) {
    return [];
  }

  const lines = proc.stdout
    .split('\n')
    .filter((l) => l.startsWith(' '))
    .map((l) => l.trim());

  const cells = new Map();
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

        // If there are two networks with the same SSID, but one is encrypted
        // and the other is not, we need to keep both.
        const key = `${cell.ssid}-${cell.encryption}`;
        if (cells.has(key)) {
          const stored = cells.get(key);
          stored.quality = Math.max(stored.quality, cell.quality);
        } else {
          cells.set(key, cell);
        }
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

  return Array.from(cells.values()).sort((a, b) => b.quality - a.quality);
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

  if (interfaces.eth0) {
    for (const addr of interfaces.eth0) {
      if (!addr.internal && addr.family === 'IPv4') {
        result.lan = addr.address;
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
  // TODO: replace external update mechanism with this function, if possible
  return Promise.resolve({
    rebootRequired: false,
    gatewayRestartRequired: false,
  });
}

/**
 * Get a list of all valid timezones for the system.
 *
 * @returns {string[]} List of timezones.
 */
function getValidTimezones() {
  const tzdata = '/usr/share/zoneinfo/zone.tab';
  if (!fs.existsSync(tzdata)) {
    return [];
  }

  try {
    const data = fs.readFileSync(tzdata, 'utf8');
    const zones = data.split('\n')
      .filter((l) => !l.startsWith('#') && l.length > 0)
      .map((l) => l.split(/\s+/g)[2])
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
  const tzdata = '/etc/timezone';
  if (!fs.existsSync(tzdata)) {
    return '';
  }

  try {
    const data = fs.readFileSync(tzdata, 'utf8');
    return data.trim();
  } catch (e) {
    console.error('Failed to read timezone:', e);
  }

  return '';
}

/**
 * Set the current timezone.
 *
 * @param {string} zone - The timezone to set
 * @returns {boolean} Boolean indicating success of the command.
 */
function setTimezone(zone) {
  const proc = child_process.spawnSync(
    'sudo',
    ['raspi-config', 'nonint', 'do_change_timezone', zone]
  );
  return proc.status === 0;
}

/**
 * Get a list of all valid wi-fi countries for the system.
 *
 * @returns {string[]} List of countries.
 */
function getValidWirelessCountries() {
  const fname = '/usr/share/zoneinfo/iso3166.tab';
  if (!fs.existsSync(fname)) {
    return [];
  }

  try {
    const data = fs.readFileSync(fname, 'utf8');
    const zones = data.split('\n')
      .filter((l) => !l.startsWith('#') && l.length > 0)
      .map((l) => l.split('\t')[1])
      .sort();

    return zones;
  } catch (e) {
    console.error('Failed to read zone file:', e);
  }

  return [];
}

/**
 * Get the wi-fi country code.
 *
 * @returns {string} Country.
 */
function getWirelessCountry() {
  const proc = child_process.spawnSync(
    'sudo',
    ['raspi-config', 'nonint', 'get_wifi_country'],
    {encoding: 'utf8'}
  );

  if (proc.status !== 0) {
    return '';
  }

  const code = proc.stdout.trim();

  const fname = '/usr/share/zoneinfo/iso3166.tab';
  if (!fs.existsSync(fname)) {
    return '';
  }

  let countries;
  try {
    const data = fs.readFileSync(fname, 'utf8');
    countries = data.split('\n')
      .filter((l) => !l.startsWith('#') && l.length > 0)
      .map((l) => l.split('\t'));
  } catch (e) {
    console.error('Failed to read country file:', e);
    return '';
  }

  const data = countries.find((c) => c[0] === code);
  if (!data) {
    return '';
  }

  return data[1];
}

/**
 * Set the wi-fi country code.
 *
 * @param {string} country - The country to set
 * @returns {boolean} Boolean indicating success of the command.
 */
function setWirelessCountry(country) {
  const fname = '/usr/share/zoneinfo/iso3166.tab';
  if (!fs.existsSync(fname)) {
    return false;
  }

  let countries;
  try {
    const data = fs.readFileSync(fname, 'utf8');
    countries = data.split('\n')
      .filter((l) => !l.startsWith('#') && l.length > 0)
      .map((l) => l.split('\t'));
  } catch (e) {
    console.error('Failed to read country file:', e);
    return false;
  }

  const data = countries.find((c) => c[1] === country);
  if (!data) {
    return false;
  }

  const proc = child_process.spawnSync(
    'sudo',
    ['raspi-config', 'nonint', 'do_wifi_country', data[0]]
  );
  return proc.status === 0;
}

module.exports = {
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
  getWirelessMode,
  setWirelessMode,
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
