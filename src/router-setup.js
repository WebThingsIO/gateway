const bodyParser = require('body-parser');
const config = require('config');
const Constants = require('./constants');
const express = require('express');
const fs = require('fs');
const Handlebars = require('handlebars');
const mDNSserver = require('./mdns-server');
const os = require('os');
const path = require('path');
const platform = require('./platform');
const sleep = require('./sleep');

// Build templates
Handlebars.registerHelper('escapeQuotes', str => new Handlebars.SafeString(str.replace(/'/, '\\\'')));

function getTemplate(name) {
  const filename = path.join(Constants.VIEWS_PATH, name);
  return Handlebars.compile(fs.readFileSync(filename, 'utf8'));
}

const routerSetupTemplate = getTemplate('router-setup.handlebars');
const creatingTemplate = getTemplate('creating.handlebars');
const hotspotTemplate = getTemplate('hotspot.handlebars');

// The express server
const app = express();

// When we get POSTs, handle the body like this
app.use(bodyParser.urlencoded({extended: false}));

// Define the handler methods for the various URLs we handle
app.get('/*', handleCaptive);
app.get('/', handleRoot);
app.get('/router-setup', handleRouterSetup);
app.post('/creating', handleCreating);
app.use(express.static(Constants.BUILD_STATIC_PATH));

const RouterSetupApp = {
  onRequest: app,
};

/**
 * Handle captive portal requests.
 */
function handleCaptive(request, response, next) {
  console.log('router-setup: handleCaptive:', request.path);

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
      // Redirect to the router setup page
      response.redirect(
        302,
        `http://${config.get('wifi.ap.ipaddr')}/router-setup`
      );
      break;
    default:
      console.log('router-setup: handleCaptive: unknown path, skipping.');
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

  if (!(status.enabled && status.mode === 'ap')) {
    // If we don't have the router configured yet, display the router setup page
    console.log(
      'router-setup: handleRoot: router unconfigured; redirecting to ' +
      'router-setup'
    );
    response.redirect('/router-setup');
  } else {
    // Otherwise, look to see if we have an oauth token yet
    console.log(
      'router-setup: handleRoot: router configuration complete; redirecting ' +
      'to /status'
    );
    response.redirect('/status');
  }
}

/**
 * Handle requests to /router-setup.
 */
function handleRouterSetup(request, response) {
  const ssid = getHotspotSsid();
  response.send(routerSetupTemplate({ssid}));
}

/**
 * Handle requests to /creating.
 */
function handleCreating(request, response) {
  mDNSserver.getmDNSconfig().then((mDNSconfig) => {
    const domain = mDNSconfig.host;
    const ssid = request.body.ssid.trim();
    const password = request.body.password.trim();

    response.send(creatingTemplate({
      domain,
      ap_ip: config.get('wifi.ap.ipaddr'),
      ap_ssid: ssid,
    }));

    // Wait before switching networks to make sure the response gets through.
    // And also wait to be sure that the access point is fully down before
    // defining the new network.
    sleep(2000)
      .then(() => {
        stopAP();
        return sleep(5000);
      })
      .then(() => {
        if (!defineNetwork(ssid, password)) {
          console.error(
            'router-setup: handleCreating: failed to define network'
          );
        } else {
          return waitForWiFi(20, 3000).then(() => {
            RouterSetupApp.onConnection();
          });
        }
      })
      .catch((error) => {
        if (error) {
          console.error('router-setup: handleCreating: general error:', error);
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
  return platform.setWirelessMode(true, 'ap', {ssid, ipaddr});
}

/**
 * Stop the running access point.
 *
 * @returns {boolean} Boolean indicating success of the command.
 */
function stopAP() {
  return platform.setWirelessMode(false, 'ap');
}

/**
 * Define a new network.
 *
 * @param {string} ssid - SSID to configure
 * @param {string?} psk - PSK to configure
 * @returns {boolean} Boolean indicating success of the command.
 */
function defineNetwork(ssid, password) {
  return platform.setWirelessMode(
    true,
    'ap',
    {
      ssid,
      key: password,
      encryption: 'psk2',
    }
  );
}

/**
 * Determine whether or not we already have a connection.
 *
 * @returns {Promise} Promise which resolves to true/false, indicating whether
 *                    or not we have a connection.
 */
function checkConnection() {
  // Wait until we have a working wifi connection. Retry every 3 seconds up
  // to 20 times. If we never get a wifi connection, go into AP mode.
  return waitForWiFi(20, 3000).then(() => {
    return true;
  }).catch((err) => {
    if (err) {
      console.error('router-setup: checkConnection: Error waiting:', err);
    }

    console.log(
      'wifi-setup: checkConnection: No wifi connection found, starting AP'
    );

    if (!startAP(config.get('wifi.ap.ipaddr'))) {
      console.error('wifi-setup: checkConnection: failed to start AP');
    }

    return false;
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
  return new Promise((resolve, reject) => {
    let attempts = 0;
    check();

    function check() {
      attempts++;
      const status = platform.getWirelessMode();
      if (status.enabled && status.mode === 'ap') {
        console.log('router-setup: waitForWifi: connection found');
        checkForAddress();
      } else {
        console.log(
          'router-setup: waitForWifi: No wifi connection on attempt', attempts
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
        console.error(
          'router-setup: waitForWiFi: No wifi available, giving up.'
        );
        reject();
      } else {
        setTimeout(check, interval);
      }
    }
  });
}

module.exports = {
  RouterSetupApp,
  isRouterConfigured: checkConnection,
};
