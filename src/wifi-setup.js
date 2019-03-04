const bodyParser = require('body-parser');
const child_process = require('child_process');
const config = require('config');
const Constants = require('./constants');
const express = require('express');
const fs = require('fs');
const Handlebars = require('handlebars');
const mDNSserver = require('./mdns-server');
const os = require('os');
const path = require('path');
const platform = require('./platform');
const Settings = require('./models/settings');
const sleep = require('./sleep');

const preliminaryScanResults = [];

// Build templates
Handlebars.registerHelper('escapeQuotes', function(str) {
  return new Handlebars.SafeString(str.replace(/'/, '\\\''));
});

function getTemplate(name) {
  const filename = path.join(Constants.VIEWS_PATH, name);
  return Handlebars.compile(fs.readFileSync(filename, 'utf8'));
}

const wifiSetupTemplate = getTemplate('wifi-setup.handlebars');
const connectingTemplate = getTemplate('connecting.handlebars');
const hotspotTemplate = getTemplate('hotspot.handlebars');

// The express server
const app = express();

// When we get POSTs, handle the body like this
app.use(bodyParser.urlencoded({extended: false}));

// Define the handler methods for the various URLs we handle
app.get('/*', handleCaptive);
app.get('/', handleRoot);
app.get('/wifi-setup', handleWiFiSetup);
app.post('/connecting', handleConnecting);
app.use(express.static(Constants.BUILD_STATIC_PATH));

const WiFiSetupApp = {
  onRequest: app,
};

/**
 * Handle captive portal requests.
 */
function handleCaptive(request, response, next) {
  console.log('wifi-setup: handleCaptive:', request.path);

  switch (request.path) {
    case '/hotspot.html': {
      // WISPr XML response
      const ssid = getHotspotSsid();
      response.send(hotspotTemplate({
        ap_ssid: ssid,
        ap_ip: config.get('wifi.ap.ipaddr'),
      }));
      break;
    }
    case '/hotspot-detect.html':        // iOS/macOS
    case '/library/test/success.html':  // iOS/macOS
    case '/connecttest.txt': {          // Windows
      const ua = request.get('User-Agent');

      // These 2 user-agents expect a WISPr XML response
      if (ua.includes('CaptiveNetworkSupport') ||
          ua.includes('Microsoft NCSI')) {
        response.redirect(
          302,
          `http://${config.get('wifi.ap.ipaddr')}/hotspot.html`
        );
        break;
      }

      // otherwise, fall through
    }
    // eslint-disable-next-line no-fallthrough
    case '/kindle-wifi/wifistub.html':  // Kindle
    case '/generate_204':               // Android, Chrome
    case '/fwlink/':                    // Windows
    case '/redirect':                   // Windows
    case '/success.txt':                // Firefox
      // Redirect to the wifi setup page
      response.redirect(
        302,
        `http://${config.get('wifi.ap.ipaddr')}/wifi-setup`
      );
      break;
    default:
      console.log('wifi-setup: handleCaptive: unknown path, skipping.');
      next();
      break;
  }
}

/**
 * Handle requests to the root URL. We display a different page depending on
 * what stage of setup we're at.
 */
function handleRoot(request, response) {
  const status = platform.getWirelessMode();

  if (!(status.enabled && status.mode === 'sta')) {
    // If we don't have a wifi connection yet, display the wifi setup page
    console.log(
      'wifi-setup: handleRoot: no wifi connection; redirecting to wifiSetup'
    );
    response.redirect('/wifi-setup');
  } else {
    // Otherwise, look to see if we have an oauth token yet
    console.log(
      'wifi-setup: handleRoot: wifi setup complete; redirecting to /status'
    );
    response.redirect('/status');
  }
}

/**
 * Handle requests to /wifi-setup.
 */
function handleWiFiSetup(request, response) {
  scan().then((results) => {
    // On Edison, scanning will fail since we're in AP mode at this point
    // So we'll use the preliminary scan instead
    if (results.length === 0) {
      results = preliminaryScanResults;
    }

    // XXX
    // To handle the case where the user entered a bad password and we are
    // not connected, we should show the networks we know about, and modify
    // the template to explain that if the user is seeing it, it means
    // that the network is down or password is bad. This allows the user
    // to re-enter a network.  Hopefully wpa_supplicant is smart enough
    // to do the right thing if there are two entries for the same ssid.
    // If not, we could modify defineNetwork() to overwrite rather than
    // just adding.
    let networks = [];
    if (results) {
      networks = results.sort((a, b) => b.quality - a.quality).map((result) => {
        const icon = result.encryption ? 'wifi-secure.svg' : 'wifi.svg';
        return {
          icon: `/optimized-images/${icon}`,
          pwdRequired: result.encryption,
          ssid: result.ssid,
        };
      });
    }

    response.send(wifiSetupTemplate({networks}));
  });
}

/**
 * Handle requests to /connecting.
 */
function handleConnecting(request, response) {
  mDNSserver.getmDNSconfig().then((mDNSconfig) => {
    const domain = mDNSconfig.host;
    const skip = request.body.skip === '1';

    if (skip) {
      console.log(
        'wifi-setup: handleConnecting: wifi setup skipped, stopping the AP.'
      );

      Settings.set('wifiskip', true).catch((e) => {
        console.error(
          'wifi-setup: handleConnecting: failed to store wifiskip:', e
        );
      }).then(() => {
        response.send(connectingTemplate({skip: `${skip}`, domain}));
        stopAP();
        WiFiSetupApp.onConnection();
      });
      return;
    }

    const ssid = request.body.ssid.trim();
    const password = request.body.password.trim();

    // XXX
    // We can come back here from the status page if the user defines
    // more than one network. We always need to call defineNetwork(), but
    // only need to call stopAP() if we're actually in ap mode.
    //
    // Also, if we're not in AP mode, then we should just redirect to
    // /status instead of sending the connecting template.
    response.send(connectingTemplate({skip: `${skip}`, domain}));

    // Wait before switching networks to make sure the response gets through.
    // And also wait to be sure that the access point is fully down before
    // defining the new network. If I only wait two seconds here, it seems
    // like the Edison takes a really long time to bring up the new network
    // but a 5 second wait seems to work better.
    sleep(2000)
      .then(() => {
        stopAP();
        return sleep(5000);
      })
      .then(() => {
        if (!defineNetwork(ssid, password)) {
          console.error(
            'wifi-setup: handleConnecting: failed to define network'
          );
        } else {
          return waitForWiFi(20, 3000).then(() => {
            WiFiSetupApp.onConnection();
          });
        }
      })
      .catch((error) => {
        if (error) {
          console.error('wifi-setup: handleConnecting: general error:', error);
        }
      });
  });
}

/**
 * Get the SSID of the hotspot.
 *
 * @returns {string} SSID
 */
function getHotspotSsid() {
  const base = config.get('wifi.ap.ssid_base');
  const mac = platform.getMacAddress('wlan0');
  if (!mac) {
    return base;
  }

  // Get the last 2 octets of the MAC and create a simple string, e.g. 9E28
  const id = mac.split(':').slice(4).join('').toUpperCase();

  return `${base} ${id}`;
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
function scan(numAttempts = 1) {
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
 * @param {string} ipaddr - IP address of AP
 * @returns {boolean} Boolean indicating success of the command.
 */
function startAP(ipaddr) {
  const ssid = getHotspotSsid();
  if (!platform.setWirelessMode(true, 'ap', {ssid, ipaddr})) {
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

        if (!startAP(config.get('wifi.ap.ipaddr'))) {
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
      const status = platform.getWirelessMode();
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
  WiFiSetupApp,
  isWiFiConfigured: checkConnection,
};
