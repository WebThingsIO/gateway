const child_process = require('child_process');
const config = require('config');
const os = require('os');
const platform = require('../platform');
const Settings = require('../models/settings');

const preliminaryScanResults = [];

/**
 * Get wifi connection status.
 *
 * @returns {object} {enabled: true|false, mode: 'ap|sta', options{...}}
 */
function getStatus() {
  return platform.getWirelessMode();
}

/**
 * Scan for available wifi networks.
 *
 * @param {number?} numAttempts - Number of previous attempts to scan
 * @returns {Promise<Object[]>} Promise which resolves to the list of networks:
 *                              [
 *                                {
 *                                  ssid: '...',
 *                                  quality: ...,
 *                                  encryption: true|false
 *                                },
 *                                ...
 *                              ]
 */
function scan(numAttempts) {
  numAttempts = numAttempts || 1;
  return new Promise(function(resolve) {
    let attempts = 0;

    function tryScan() {
      attempts++;

      const results = _scan();
      if (results.length > 0) {
        resolve(results);
      } else {
        console.log('wifi-setup: scan: Scan attempt', attempts, 'failed');

        if (attempts >= numAttempts) {
          console.error(
            'wifi-setup: scan: Giving up. No scan results available.'
          );
          resolve([]);
        } else {
          console.log('wifi-setup: scan: Will try again in 3 seconds.');
          setTimeout(tryScan, 3000);
        }
      }
    }

    tryScan();
  });
}

function _scan() {
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

  const cells = [];
  let cell = {};

  for (const line of lines) {
    // New cell, start over
    if (line.startsWith('Cell ')) {
      if (cell.hasOwnProperty('ssid') &&
          cell.hasOwnProperty('quality') &&
          cell.hasOwnProperty('encryption') &&
          cell.ssid.length > 0) {
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

  return cells;
}

function _getKnownNetworks() {
  const proc = child_process.spawnSync(
    'wpa_cli',
    ['-i', 'wlan0', 'list_networks'],
    {encoding: 'utf8'}
  );
  if (proc.status !== 0) {
    return [];
  }

  const networks = [];
  for (const line of proc.stdout.trim().split('\n')) {
    if (line.startsWith('network')) {
      continue;
    }

    const ssid = line.split('\t')[1];
    if (ssid) {
      networks.push(ssid);
    }
  }

  return networks;
}

/**
 * Enable an access point that users can connect to to configure the device.
 *
 * This requires that hostapd and udhcpd are installed on the system but not
 * enabled, so that they do not automatically run when the device boots up.
 * This also requires that hostapd and udhcpd have appropriate config files
 * that define the SSID for the wifi network to be created, for example.
 * Also, the udhcpd config file should be set up to work with the IP address
 * of the device.
 *
 * @returns {boolean} Boolean indicating success of the command.
 */
function startAP(ip) {
  if (!platform.setWirelessMode(true,
                                'ap',
                                {ssid: 'Mozilla IoT Gateway', ipaddr: ip})) {
    return false;
  }

  return platform.setDhcpServerStatus(true);
}

/**
 * Stop the running access point.
 *
 * @returns {boolean} Boolean indicating success of the command.
 */
function stopAP() {
  if (!platform.setWirelessMode(false, 'ap')) {
    return false;
  }

  return platform.setDhcpServerStatus(false);
}

/**
 * Define a new network and connect to it.
 *
 * @param {string} ssid - SSID to configure
 * @param {string?} psk - PSK to configure
 * @returns {boolean} Boolean indicating success of the command.
 */
function defineNetwork(ssid, password) {
  return platform.setWirelessMode(true, 'sta', {ssid, key: password});
}

/**
 * Determine whether or not we already have a connection.
 *
 * @returns {Promise} Promise which resolves to true/false, indicating whether
 *                    or not we have a connection.
 */
function checkConnection() {
  return Settings.get('wifiskip').catch(() => false).then((skipped) => {
    if (skipped) {
      return Promise.resolve(true);
    }

    // Wait until we have a working wifi connection. Retry every 3 seconds up
    // to 20 times. If we never get a wifi connection, go into AP mode.
    return waitForWiFi(20, 3000).then(() => {
      return true;
    }).catch((err) => {
      if (err) {
        console.error('wifi-setup: checkConnection: Error waiting:', err);
      }

      // Scan for wifi networks now because we can't always scan once
      // the AP is being broadcast, retrying up to 10 times
      scan(10).then((ssids) => {
        // Update the existing preliminaryScanResults reference
        preliminaryScanResults.splice(0, preliminaryScanResults.length);
        Array.prototype.push.apply(preliminaryScanResults, ssids);

        console.log(
          'wifi-setup: checkConnection: No wifi connection found, starting AP'
        );

        if (!startAP(config.get('wifi.ap_ip'))) {
          console.error('wifi-setup: checkConnection: failed to start AP');
        }
      });

      return false;
    });
  });
}

/**
 * Wait for a wifi connection.
 *
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} interval - Interval at which to check, in milliseconds
 * @returns {Promise} Promise which resolves when we're connected. If we
 *                    aren't connected after maxAttempts attempts, then the
 *                    promise is rejected.
 */
function waitForWiFi(maxAttempts, interval) {
  return new Promise(function(resolve, reject) {
    let attempts = 0;

    // first, see if any networks are already configured
    const networks = _getKnownNetworks();
    if (networks.length > 0) {
      // there's at least one wifi network configured. Let's wait to see if it
      // will connect.
      console.log('wifi-setup: waitForWiFi: networks exist:', networks);
      check();
    } else {
      // No wifi network configured. Let's skip the wait and start the setup
      // immediately.
      reject();
    }

    function check() {
      attempts++;
      const status = getStatus();
      if (status.enabled && status.mode === 'sta') {
        console.log('wifi-setup: waitForWifi: connection found');
        checkForAddress();
      } else {
        console.log(
          'wifi-setup: waitForWifi: No wifi connection on attempt', attempts
        );
        retryOrGiveUp();
      }
    }

    function checkForAddress() {
      const ifaces = os.networkInterfaces();

      if (ifaces.hasOwnProperty('wlan0')) {
        for (const addr of ifaces.wlan0) {
          if (addr.family !== 'IPv4' || addr.internal) {
            continue;
          }

          resolve();
          return;
        }
      }

      retryOrGiveUp();
    }

    function retryOrGiveUp() {
      if (attempts >= maxAttempts) {
        console.error('wifi-setup: waitForWiFi: No wifi available, giving up.');
        reject();
      } else {
        setTimeout(check, interval);
      }
    }
  });
}

module.exports = {
  getStatus,
  scan,
  startAP,
  stopAP,
  defineNetwork,
  checkConnection,
  waitForWiFi,
  preliminaryScanResults,
};
