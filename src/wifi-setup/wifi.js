const config = require('config');
const fs = require('fs');
const os = require('os');
const path = require('path');
const run = require('./run.js');
const platform = require('./platform.js');

exports.getStatus = getStatus;
exports.getConnectedNetwork = getConnectedNetwork;
exports.scan = scan;
exports.startAP = startAP;
exports.stopAP = stopAP;
exports.defineNetwork = defineNetwork;
exports.removeNetwork = removeNetwork;
exports.getKnownNetworks = getKnownNetworks;
exports.checkConnection = checkConnection;
exports.waitForWiFi = waitForWiFi;

// The Edison device can't scan for wifi networks while in AP mode, so
// we've got to scan before we enter AP mode and save the results. They're a
// global variable because this code needs to ship
exports.preliminaryScanResults = [];


/**
 * Determine whether we have a wifi connection with the `wpa_cli
 * status` command. This function returns a Promise that resolves to a
 * string.  On my Rasberry Pi, the string is "DISCONNECTED" or
 * "INACTIVE" when there is no connection and is "COMPLETED" when
 * there is a connection. There are other possible string values when
 * a connection is being established
 */
function getStatus() {
  return run(platform.getStatus);
}

/**
 * Determine the ssid of the wifi network we are connected to.
 * This function returns a Promise that resolves to a string.
 * The string will be empty if not connected.
 */
function getConnectedNetwork() {
  return run(platform.getConnectedNetwork);
}

/**
 * Scan for available wifi networks using `iwlist wlan0 scan`.
 * Returns a Promise that resolves to an array of strings. Each string
 * is the ssid of a wifi network. They are sorted by signal strength from
 * strongest to weakest. On a Raspberry Pi, a scan seems to require root
 * privileges.
 *
 * On a Raspberry Pi 3, this function works when the device is in AP mode.
 * The Intel Edison, however, cannot scan while in AP mode: iwlist fails
 * with an error. iwlist sometimes also fails with an error when the
 * hardware is busy, so this function will try multiple times if you
 * pass a number. If all attempts fail, the promise is resolved to
 * an empty array.
 */
function scan(numAttempts) {
  numAttempts = numAttempts || 1;
  return new Promise(function(resolve) {
    let attempts = 0;

    function tryScan() {
      attempts++;

      _scan()
        .then((out) => {
          resolve(out.length ? out.split('\n') : []);
        })
        .catch((err) => {
          console.error('Scan attempt', attempts, 'failed:',
                        err.message || err);

          if (attempts >= numAttempts) {
            console.error('Giving up. No scan results available.');
            resolve([]);
          } else {
            console.error('Will try again in 3 seconds.');
            setTimeout(tryScan, 3000);
          }
        });
    }

    tryScan();
  });

  function _scan() {
    return run(platform.scan);
  }
}

/**
 * Enable an access point that users can connect to to configure the device.
 *
 * This command runs different commands on Raspbery Pi Rasbian and Edison Yocto.
 *
 * It requires that hostapd and udhcpd are installed on the system but not
 * enabled, so that they do not automatically run when the device boots up.
 * It also requires that hostapd and udhcpd have appropriate config files
 * that define the ssid for the wifi network to be created, for example.
 * Also, the udhcpd config file should be set up to work with the IP address
 * of the device.
 *
 * XXX
 * It would probably be better if the IP address, SSID and password were
 * options to this function rather than being hardcoded in system config
 * files. (Each device ought to be able to add a random number to its
 * SSID, for example, so that when you've got multiple devices they don't
 * all try to create the same network).
 *
 * This function returns a Promise that resolves when the necessary
 * commands have been run.  This does not necessarily mean that the AP
 * will be functional, however. The setup process might take a few
 * seconds to complete before the user will be able to see and connect
 * to the network.
 */
function startAP(ip) {
  return run(platform.startAP, {IP: ip});
}

/**
 * Like startAP(), but take the access point down, using platform-dependent
 * commands.
 *
 * Returns a promise that resolves when the commands have been run. At
 * this point, the AP should be in the process of stopping but may not
 * yet be completely down.
 */
function stopAP() {
  return run(platform.stopAP);
}

/**
 * This function uses wpa_cli to add the specified network ssid and password
 * to the wpa_supplicant.conf file. This assumes that wpa_supplicant is
 * configured to run automatically at boot time and is configured to work
 * with wpa_cli.
 *
 * If the system is not connected to a wifi network, calling this
 * command with a valid ssid and password should cause it to connect.
 */
function defineNetwork(ssid, password) {
  return run(password ? platform.defineNetwork : platform.defineOpenNetwork, {
    SSID: ssid,
    PSK: password,
  });
}

/**
 * This function uses wpa_cli to remove the network with the given ID.
 */
function removeNetwork(id) {
  return run(platform.removeNetwork, {ID: id});
}

/**
 * Return a Promise that resolves to an array of known wifi network names
 */
function getKnownNetworks() {
  return run(platform.getKnownNetworks)
    .then((out) => out.length ? out.split('\n') : []);
}

function checkConnection() {
  const profileDir = process.env.MOZIOT_HOME || config.get('profileDir');
  const wifiskipPath = path.join(profileDir, 'config', 'wifiskip');

  if (fs.existsSync(wifiskipPath)) {
    return Promise.resolve(true);
  }

  return getStatus().then(() => {
    // Wait until we have a working wifi connection. Retry every 3 seconds up
    // to 10 times. If we are connected, then start the Gateway client.
    // If we never get a wifi connection, go into AP mode.
    // Before we start, though, let the user know that something is happening
    return waitForWiFi(20, 3000).then(() => {
      return true;
    }).catch((err) => {
      console.log('No wifi connection found. Starting the AP...', err);
      // Scan for wifi networks now because we can't always scan once
      // the AP is being broadcast, retrying up to 10 times
      scan(10).then((ssids) => {
        exports.preliminaryScanResults = ssids; // Remember ssids
        console.log('No wifi found; entering AP mode');
        startAP(platform.ap_ip);
      });

      return false;
    });
  }).catch((err) => {
    console.error('Error checking wifi adapter presence', err);
    return true;
  });
}

// Return a promise, then check every interval ms for a wifi connection.
// Resolve the promise when we're connected. Or, if we aren't connected
// after maxAttempts attempts, then reject the promise
function waitForWiFi(maxAttempts, interval) {
  return new Promise(function(resolve, reject) {
    let attempts = 0;

    // first of all we query wpa_supplicant if there's a wifi AP configured
    run(platform.listNetworks)
      .then((out) => {
        console.log('List Networks command executed:', out);
        if (out.includes('\n0\t')) {
          // there's at least one wifi AP configured. Let's wait to see if it
          // will connect
          check();
        } else {
          // No wifi AP configured. Let's skip the wait and start the setup
          // immediately
          reject();
        }
      })
      .catch((err) => console.error('Error listing Networks:', err));


    function check() {
      attempts++;
      console.log('check', attempts);
      getStatus()
        .then((status) => {
          console.log(status);
          if (status === 'COMPLETED') {
            console.log('WiFi connection found. resolving');
            checkForAddress();
            console.log('resolved');
          } else {
            console.log('No wifi connection on attempt', attempts);
            retryOrGiveUp();
          }
        })
        .catch((err) => {
          console.error('Error checking wifi on attempt', attempts, ':', err);
          retryOrGiveUp();
        });
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
