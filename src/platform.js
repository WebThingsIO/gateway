/**
 * Platform-specific utilities.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const child_process = require('child_process');
const process = require('process');

/**
 * Get the current architecture as "os-machine", i.e. darwin-x64.
 */
function getArchitecture() {
  return `${process.platform}-${process.arch}`;
}

/**
 * Determine whether or not the SSH toggle is implemented.
 *
 * @return {Boolean} indicating implementation status
 */
function isToggleSshImplemented() {
  return isRaspberryPi();
}

/**
 * Determine whether or not SSH is enabled.
 *
 * @return {Boolean} indicating enablement status
 */
function isSshEnabled() {
  if (isRaspberryPi()) {
    const proc = child_process.spawnSync(
      'sudo', ['raspi-config', 'nonint', 'get_ssh']);

    if (proc.status !== 0) {
      return false;
    }

    return proc.stdout.toString().trim() === '0';
  }

  return false;
}

/**
 * Enable/disable SSH, if possible.
 *
 * @param {Boolean} enable Whether or not SSH should be enabled.
 * @return {Boolean} indicating success
 */
function toggleSsh(enable) {
  if (isRaspberryPi()) {
    let arg = '1';
    if (enable) {
      arg = '0';
    }

    const proc = child_process.spawnSync(
      'sudo', ['raspi-config', 'nonint', 'do_ssh', arg]);
    return proc.status === 0;
  }

  return false;
}

/**
 * Determine whether or not gateway restart is implemented.
 *
 * @return {Boolean} indicating implementation status
 */
function isRestartGatewayImplemented() {
  return isRaspberryPi();
}

/**
 * Restart the gateway process.
 *
 * @return {Boolean} indicating success
 */
function restartGateway() {
  if (isRaspberryPi()) {
    const proc = child_process.spawnSync(
      'sudo', ['systemctl', 'restart', 'mozilla-iot-gateway.service']);

    // This will probably not fire, but just in case.
    return proc.status === 0;
  }

  return false;
}

/**
 * Determine whether or not system restart is implemented.
 *
 * @return {Boolean} indicating implementation status
 */
function isRestartSystemImplemented() {
  return isRaspberryPi();
}

/**
 * Restart the system.
 *
 * @return {Boolean} indicating success
 */
function restartSystem() {
  if (isRaspberryPi()) {
    const proc = child_process.spawnSync('sudo', ['reboot']);

    // This will probably not fire, but just in case.
    return proc.status === 0;
  }

  return false;
}

/**
 * Determine whether or not we're running on the Raspberry Pi.
 */
function isRaspberryPi() {
  const proc = child_process.spawnSync('lsb_release', ['-i', '-s']);
  return proc.status === 0 && proc.stdout.toString().trim() === 'Raspbian';
}

module.exports = {
  getArchitecture,
  isToggleSshImplemented,
  isSshEnabled,
  toggleSsh,
  isRestartGatewayImplemented,
  restartGateway,
  isRestartSystemImplemented,
  restartSystem,
  isRaspberryPi,
};
