const config = require('config');
const fs = require('fs');
const os = require('os');
const path = require('path');
const platform = require('./platform');

module.exports = {
  getStatus,
  scan,
  startAP,
  stopAP,
  defineNetwork,
  removeNetwork,
  getKnownNetworks,
  checkConnection,
  waitForWiFi,
  preliminaryScanResults: [],
};

/**
 * Get wifi connection status.
 *
 * @returns {object} {connected: true|false, ssid: '...'}
 */
function getStatus() {
  return platform.getStatus();
}

/**
 * Scan for available wifi networks.
 *
 * @param {number?} numAttempts - Number of previous attempts to scan
 * @returns {Object[]} List of networks:
 *                     [
 *                       {
 *                         ssid: '...',
 *                         quality: ...,
 *                         encryption: true|false
 *                       },
 *                       ...
 *                     ]
 */
function scan(numAttempts) {
  numAttempts = numAttempts || 1;
  return new Promise(function(resolve) {
    let attempts = 0;

    function tryScan() {
      attempts++;

      const results = platform.scan();
      if (results.length > 0) {
        resolve(results);
      } else {
        console.error('Scan attempt', attempts, 'failed');

        if (attempts >= numAttempts) {
          console.error('Giving up. No scan results available.');
          resolve([]);
        } else {
          console.error('Will try again in 3 seconds.');
          setTimeout(tryScan, 3000);
        }
      }
    }

    tryScan();
  });
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
  return platform.startAP(ip);
}

/**
 * Stop the running access point.
 *
 * @returns {boolean} Boolean indicating success of the command.
 */
function stopAP() {
  return platform.stopAP();
}

/**
 * Define a new network and connect to it.
 *
 * @param {string} ssid - SSID to configure
 * @param {string?} psk - PSK to configure
 * @returns {boolean} Boolean indicating success of the command.
 */
function defineNetwork(ssid, password) {
  return platform.defineNetwork(ssid, password);
}

/**
 * Remove a configured network.
 *
 * @param {number} id - ID of network
 * @returns {boolean} Boolean indicating success of the command.
 */
function removeNetwork(id) {
  return platform.removeNetwork(id);
}

/**
 * Get a list of configured networks.
 *
 * @returns {String[]} List of network names.
 */
function getKnownNetworks() {
  return platform.getKnownNetworks();
}

function checkConnection() {
  const profileDir = process.env.MOZIOT_HOME || config.get('profileDir');
  const wifiskipPath = path.join(profileDir, 'config', 'wifiskip');

  if (fs.existsSync(wifiskipPath)) {
    return Promise.resolve(true);
  }

  // Wait until we have a working wifi connection. Retry every 3 seconds up
  // to 20 times. If we are connected, then start the Gateway client.
  // If we never get a wifi connection, go into AP mode.
  return waitForWiFi(20, 3000).then(() => {
    return true;
  }).catch((err) => {
    console.log('No wifi connection found. Starting the AP...', err);
    // Scan for wifi networks now because we can't always scan once
    // the AP is being broadcast, retrying up to 10 times
    scan(10).then((ssids) => {
      module.exports.preliminaryScanResults = ssids;
      console.log('No wifi found; entering AP mode');
      startAP(config.get('wifi.ap_ip'));
    });

    return false;
  });
}

// Return a promise, then check every interval ms for a wifi connection.
// Resolve the promise when we're connected. Or, if we aren't connected
// after maxAttempts attempts, then reject the promise
function waitForWiFi(maxAttempts, interval) {
  return new Promise(function(resolve, reject) {
    let attempts = 0;

    // first of all we query wpa_supplicant if there's a wifi AP configured
    const networks = getKnownNetworks();
    console.log('List Networks command executed:', networks);
    if (networks.length > 0) {
      // there's at least one wifi AP configured. Let's wait to see if it
      // will connect
      check();
    } else {
      // No wifi AP configured. Let's skip the wait and start the setup
      // immediately
      reject();
    }

    function check() {
      attempts++;
      console.log('check', attempts);
      const status = getStatus();
      if (status.connected) {
        console.log('WiFi connection found. resolving');
        checkForAddress();
        console.log('resolved');
      } else {
        console.log('No wifi connection on attempt', attempts);
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
        console.error('Giving up. No wifi available.');
        reject();
      } else {
        setTimeout(check, interval);
      }
    }
  });
}
