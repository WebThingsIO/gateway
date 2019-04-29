'use strict';

const bodyParser = require('body-parser');
const config = require('config');
const Constants = require('./constants');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const mDNSserver = require('./mdns-server');
const platform = require('./platform');
const Settings = require('./models/settings');
const sleep = require('./sleep');

const DEBUG = false;

const hbs = expressHandlebars.create({
  helpers: {
    escapeQuotes: (str) => `${str}`.replace(/'/, '\\\''),
  },
});

// The express server
const app = express();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', Constants.VIEWS_PATH);

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
      response.render(
        'hotspot',
        {
          ap_ssid: ssid,
          ap_ip: config.get('wifi.ap.ipaddr'),
        }
      );
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
  // We don't have the router configured yet, display the router setup page
  console.log(
    'router-setup: handleRoot: router unconfigured; redirecting to ' +
    'router-setup'
  );
  response.redirect('/router-setup');
}

/**
 * Handle requests to /router-setup.
 */
function handleRouterSetup(request, response) {
  DEBUG && console.log('router-setup: handleRouterSetup:', request.path);
  const ssid = getHotspotSsid();
  response.render('router-setup', {ssid});
}

/**
 * Handle requests to /creating.
 */
function handleCreating(request, response) {
  DEBUG && console.log('router-setup: handleCreating:', request.path);
  mDNSserver.getmDNSconfig().then((mDNSconfig) => {
    const domain = mDNSconfig.host;
    const ssid = request.body.ssid.trim();
    const password = request.body.password.trim();

    if (ssid.length < 1 || ssid.length > 32 || password.length < 8) {
      response.status(400).send('Invalid parameters.');
      return;
    }

    response.render(
      'creating',
      {
        domain,
        ap_ip: config.get('wifi.ap.ipaddr'),
        ap_ssid: ssid,
      }
    );

    // Wait before switching networks to make sure the response gets through.
    // And also wait to be sure that the access point is fully down before
    // defining the new network.
    sleep(2000)
      .then(() => {
        stopCaptivePortal();
        return sleep(5000);
      })
      .then(() => {
        return defineNetwork(ssid, password);
      })
      .then((success) => {
        if (!success) {
          console.error(
            'router-setup: handleCreating: failed to define network'
          );
        } else {
          return waitForWiFi(20, 3000).then(() => {
            DEBUG && console.log('router-setup: setup complete');
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
    DEBUG && console.log('router-setup: getHotSpotSsid: returning', base);
    return base;
  }

  // Get the last 2 octets of the MAC and create a simple string, e.g. 9E28
  const id = mac.split(':').slice(4).join('').toUpperCase();

  DEBUG && console.log('router-setup: getHotSpotSsid: returning', `${base} ${id}`);
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
function startCaptivePortal(ipaddr) {
  console.log('router-setup: startCaptivePortal: ipaddr:', ipaddr);
  const ssid = getHotspotSsid();

  // Set the WAN mode to be DHCP. By doing this here, it allows us to get
  // an IP address and allows NTP to set the time by the time we get to
  // registering the tunnel.

  const wanMode = platform.getWanMode();
  if (wanMode.mode != 'dhcp') {
    platform.setWanMode('dhcp');
  }

  // We need the LAN to be configured to have a static IP address,
  // and run dnsmasq (DHCP server and DNS server).

  const ifname = null;
  const netmask = '255.255.255.0';

  if (!platform.setLanMode('static', {ipaddr, ifname, netmask})) {
    console.error('router-setup: startCaptivePortal: setLanMode failed');
    return false;
  }
  if (!platform.setCaptivePortalStatus(true, {ipaddr, restart: false})) {
    console.error('router-setup: startCaptivePortal:',
                  'setCaptivePortalStatus failed');
    return false;
  }
  if (!platform.setDhcpServerStatus(true, {ipaddr})) {
    console.error('router-setup: startCaptivePortal:',
                  'setDhcpServerStatus failed');
    return false;
  }
  const encryption = 'none';
  if (!platform.setWirelessMode(true, 'ap', {ssid, encryption})) {
    console.error('router-setup: startCaptivePortal: setWirelessMode failed');
    return false;
  }
  return true;
}

/**
 * Stop the running access point.
 *
 * @returns {boolean} Boolean indicating success of the command.
 */
function stopCaptivePortal() {
  console.log('router-setup: stopCaptivePortal');
  let result = platform.setCaptivePortalStatus(false, {restart: true});
  result &= platform.setWirelessMode(false, 'ap');
  return result;
}

/**
 * Define a new network.
 *
 * @param {string} ssid - SSID to configure
 * @param {string?} psk - PSK to configure
 * @returns {Promise} Promise which resolves to a boolean indicating success of
 *                    the command.
 */
function defineNetwork(ssid, password) {
  console.log('router-setup: defineNetwork: ssid:', ssid);

  const wanMode = platform.getWanMode();
  if (wanMode.mode != 'dhcp') {
    platform.setWanMode('dhcp');
  }

  return Settings.set('router.configured', true).then(() => {
    return platform.setWirelessMode(
      true,
      'ap',
      {
        ssid,
        key: password,
        encryption: 'psk2',
      }
    );
  }).catch((e) => {
    console.error('router-setup: Error defining network:', e);
    return false;
  });
}

/**
 * Determine whether or not we already have a connection.
 *
 * @returns {Promise} Promise which resolves to true/false, indicating whether
 *                    or not we have a connection.
 */
function checkConnection() {
  return Settings.get('router.configured')
    .catch(() => false)
    .then((configured) => {
      if (configured) {
        return platform.checkConnection();
      }

      if (!startCaptivePortal(config.get('wifi.ap.ipaddr'))) {
        console.error('router-setup: checkConnection:',
                      'failed to start Captive Portal');
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

        // For the traditional router setup, we have a statically assigned
        // address so we can skip checking for the address.
        // checkForAddress();
        resolve();
      } else {
        console.log(
          'router-setup: waitForWifi: No wifi connection on attempt', attempts
        );
        retryOrGiveUp();
      }
    }

    /*
     * We'll eventually want this function back for supporting DHCP client
     *
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
    */

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
