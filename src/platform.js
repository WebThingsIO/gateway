/**
 * Platform-specific utilities.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const child_process = require('child_process');
const fs = require('fs');
const process = require('process');

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
 *                        * linux-raspbian
 *                        * linux-openwrt
 *                        * linux-unknown
 */
function getOS() {
  const platform = process.platform;
  if (platform !== 'linux') {
    return platform;
  }

  const proc = child_process.spawnSync('lsb_release', ['-i', '-s']);
  if (proc.status === 0 && proc.stdout.toString().trim() === 'Raspbian') {
    return 'linux-raspbian';
  }

  if (fs.existsSync('/etc/openwrt_release')) {
    return 'linux-openwrt';
  }

  return 'linux-unknown';
}

/**
 * Get the current architecture as "os-machine", i.e. darwin-x64.
 */
function getArchitecture() {
  return `${process.platform}-${process.arch}`;
}

/**
 * Get the current node version.
 */
function getNodeVersion() {
  return process.config.variables.node_module_version;
}

/**
 * Get a list of installed Python versions.
 */
function getPythonVersions() {
  const versions = new Set();
  const parse = (output) => {
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

/**
 * Determine whether or not the SSH toggle is implemented.
 *
 * @return {Boolean} indicating implementation status
 */
function isToggleSshImplemented() {
  switch (getOS()) {
    case 'linux-raspbian':
    case 'linux-openwrt':
      return true;
    default:
      return false;
  }
}

/**
 * Determine whether or not SSH is enabled.
 *
 * @return {Boolean} indicating enablement status
 */
function isSshEnabled() {
  switch (getOS()) {
    case 'linux-raspbian': {
      const proc = child_process.spawnSync(
        'sudo', ['raspi-config', 'nonint', 'get_ssh']);

      if (proc.status !== 0) {
        return false;
      }

      return proc.stdout.toString().trim() === '0';
    }
    case 'linux-openwrt': {
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
    default:
      return false;
  }
}

/**
 * Enable/disable SSH, if possible.
 *
 * @param {Boolean} enable Whether or not SSH should be enabled.
 * @return {Boolean} indicating success
 */
function toggleSsh(enable) {
  switch (getOS()) {
    case 'linux-raspbian': {
      const arg = enable ? '1' : '0';
      const proc = child_process.spawnSync(
        'sudo', ['raspi-config', 'nonint', 'do_ssh', arg]);
      return proc.status === 0;
    }
    case 'linux-openwrt': {
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

      let proc = child_process.spawnSync(service, [enable ? 'start' : 'stop']);
      if (proc.status !== 0) {
        return false;
      }

      proc = child_process.spawnSync(service, [enable ? 'enable' : 'disable']);
      return proc.status === 0;
    }
    default:
      return false;
  }
}

/**
 * Enable/disable the system's mDNS server, if possible.
 *
 * @param {Boolean} enable Whether or not mDNS should be enabled.
 * @return {Boolean} indicating success
 */
function togglemDns(enable) {
  switch (getOS()) {
    case 'linux-raspbian': {
      const command = enable ? 'start' : 'stop';
      const proc = child_process.spawnSync(
        'sudo', ['systemctl', command, 'avahi-daemon.service']);
      return proc.status === 0;
    }
    case 'linux-openwrt': {
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

      let proc = child_process.spawnSync(service, [enable ? 'start' : 'stop']);
      if (proc.status !== 0) {
        return false;
      }

      proc = child_process.spawnSync(service, [enable ? 'enable' : 'disable']);
      return proc.status === 0;
    }
    default:
      return false;
  }
}

/**
 * Set the system's hostname, if possible.
 *
 * @param {String} hostname The hostname to set
 * @returns {Boolean} indicating success
 */
function setHostname(hostname) {
  hostname = hostname.toLowerCase();
  const re = new RegExp(/^([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])$/);
  const valid = re.test(hostname) && hostname.length <= 63;
  if (!valid) {
    return false;
  }

  switch (getOS()) {
    case 'linux-raspbian': {
      // Read in the current hostname
      let original = fs.readFileSync('/etc/hostname', 'utf8');
      if (original) {
        original = original.trim();
      }

      // Do this with sed, as it's the easiest way to write the file as root.
      let proc = child_process.spawnSync(
        'sudo', ['sed', '-i', '-e', `s/^.*$/${hostname}/`, '/etc/hostname']);
      if (proc.status !== 0) {
        return false;
      }

      proc = child_process.spawnSync('sudo', ['hostname', hostname]);
      if (proc.status !== 0) {
        // Set the original hostname back
        child_process.spawnSync(
          'sudo', ['sed', '-i', '-e', `s/^.*$/${original}/`, '/etc/hostname']);

        return false;
      }

      proc = child_process.spawnSync(
        'sudo', ['systemctl', 'restart', 'avahi-daemon.service']);
      if (proc.status !== 0) {
        // Set the original hostname back
        child_process.spawnSync(
          'sudo', ['sed', '-i', '-e', `s/^.*$/${original}/`, '/etc/hostname']);
        child_process.spawnSync('sudo', ['hostname', original]);

        return false;
      }

      return true;
    }
    case 'linux-openwrt': {
      let proc = child_process.spawnSync(
        'uci',
        ['set', `system.@system[0].hostname='${hostname}'`]
      );
      if (proc.status !== 0) {
        return false;
      }

      proc = child_process.spawnSync('uci', ['commit', 'system']);
      if (proc.status !== 0) {
        return false;
      }

      proc = child_process.spawnSync('/etc/init.d/system', ['reload']);
      if (proc.status !== 0) {
        return false;
      }

      proc = child_process.spawnSync(
        'uci',
        ['set', `network.lan.hostname='${hostname}'`]
      );
      if (proc.status !== 0) {
        return false;
      }

      proc = child_process.spawnSync('uci', ['commit', 'network']);
      if (proc.status !== 0) {
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
    default:
      return false;
  }
}

/**
 * Determine whether or not gateway restart is implemented.
 *
 * @return {Boolean} indicating implementation status
 */
function isRestartGatewayImplemented() {
  switch (getOS()) {
    case 'linux-raspbian':
    case 'linux-openwrt':
      return true;
    default:
      return false;
  }
}

/**
 * Restart the gateway process.
 *
 * @return {Boolean} indicating success
 */
function restartGateway() {
  switch (getOS()) {
    case 'linux-raspbian': {
      const proc = child_process.spawnSync(
        'sudo', ['systemctl', 'restart', 'mozilla-iot-gateway.service']);

      // This will probably not fire, but just in case.
      return proc.status === 0;
    }
    case 'linux-openwrt': {
      const proc = child_process.spawnSync(
        '/etc/init.d/mozilla-iot-gateway',
        ['restart']
      );

      // This will probably not fire, but just in case.
      return proc.status === 0;
    }
    default:
      return false;
  }
}

/**
 * Determine whether or not system restart is implemented.
 *
 * @return {Boolean} indicating implementation status
 */
function isRestartSystemImplemented() {
  switch (getOS()) {
    case 'linux-raspbian':
    case 'linux-openwrt':
      return true;
    default:
      return false;
  }
}

/**
 * Restart the system.
 *
 * @return {Boolean} indicating success
 */
function restartSystem() {
  switch (getOS()) {
    case 'linux-raspbian': {
      const proc = child_process.spawnSync('sudo', ['reboot']);

      // This will probably not fire, but just in case.
      return proc.status === 0;
    }
    case 'linux-openwrt': {
      const proc = child_process.spawnSync('reboot');

      // This will probably not fire, but just in case.
      return proc.status === 0;
    }
    default:
      return false;
  }
}

module.exports = {
  getArchitecture,
  getNodeVersion,
  getOS,
  getPythonVersions,
  isToggleSshImplemented,
  isSshEnabled,
  toggleSsh,
  togglemDns,
  setHostname,
  isRestartGatewayImplemented,
  restartGateway,
  isRestartSystemImplemented,
  restartSystem,
};
