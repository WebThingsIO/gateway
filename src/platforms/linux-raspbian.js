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

/**
 * Get SSH server status.
 *
 * @returns {boolean} Boolean indicating whether or not SSH is enabled.
 */
function getSshStatus() {
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
function setSshStatus(enabled) {
  const arg = enabled ? '1' : '0';
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
function getMdnsStatus() {
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
function setMdnsStatus(enabled) {
  const command = enabled ? 'start' : 'stop';
  const proc = child_process.spawnSync(
    'sudo',
    ['systemctl', command, 'avahi-daemon.service']
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

  return true;
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

module.exports = {
  getHostname,
  setHostname,
  getMdnsStatus,
  setMdnsStatus,
  getSshStatus,
  setSshStatus,
  restartGateway,
  restartSystem,
};
