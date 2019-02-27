const bodyParser = require('body-parser');
const config = require('config');
const Constants = require('../constants');
const express = require('express');
const fs = require('fs');
const Handlebars = require('handlebars');
const mDNSserver = require('../mdns-server');
const path = require('path');
const Settings = require('../models/settings');
const sleep = require('../sleep');
const wifi = require('./wifi');

// Build templates
Handlebars.registerHelper('escapeQuotes', function(str) {
  return new Handlebars.SafeString(str.replace(/'/, '\\\''));
});

function getTemplate(name) {
  const filename = path.join(Constants.VIEWS_PATH, name);
  return Handlebars.compile(fs.readFileSync(filename, 'utf8'));
}

const wifiSetupTemplate = getTemplate('wifiSetup.handlebars');
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
      const ssid = wifi.getHotspotSsid();
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
  const status = wifi.getStatus();

  if (!(status.enabled && status.mode === 'sta')) {
    // If we don't have a wifi connection yet, display the wifi setup page
    console.log(
      'wifi-setup: handleRoot: no wifi connection; redirecting to wifiSetup'
    );
    response.redirect('/wifi-setup');
  } else {
    // Otherwise, look to see if we have an oauth token yet
    console.log(
      'wifi-setup: handleRoot: wifi setup complete; redirecting /status'
    );
    response.redirect('/status');
  }
}

/**
 * Handle requests to /wifi-setup.
 */
function handleWiFiSetup(request, response) {
  wifi.scan().then((results) => {
    // On Edison, scanning will fail since we're in AP mode at this point
    // So we'll use the preliminary scan instead
    if (results.length === 0) {
      results = wifi.preliminaryScanResults;
    }

    // XXX
    // To handle the case where the user entered a bad password and we are
    // not connected, we should show the networks we know about, and modify
    // the template to explain that if the user is seeing it, it means
    // that the network is down or password is bad. This allows the user
    // to re-enter a network.  Hopefully wpa_supplicant is smart enough
    // to do the right thing if there are two entries for the same ssid.
    // If not, we could modify wifi.defineNetwork() to overwrite rather than
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
        wifi.stopAP();
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
        wifi.stopAP();
        return sleep(5000);
      })
      .then(() => {
        if (!wifi.defineNetwork(ssid, password)) {
          console.error(
            'wifi-setup: handleConnecting: failed to define network'
          );
        } else {
          return wifi.waitForWiFi(20, 3000).then(() => {
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

module.exports = WiFiSetupApp;
