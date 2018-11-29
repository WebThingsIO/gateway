const config = require('config');
const express = require('express');
const Handlebars = require('handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const platform = require('./platform.js');
const wifi = require('./wifi.js');
const wait = require('./wait.js');
const path = require('path');

Handlebars.registerHelper('escapeQuotes', function(str) {
  return new Handlebars.SafeString(str.replace(/'/, '\\\''));
});

const templatesPath = path.join(__dirname, '../../src/wifi-setup/templates');

const WiFiSetupApp = {};
// The express server
const app = express();

// When we get POSTs, handle the body like this
app.use(bodyParser.urlencoded({extended: false}));

// Define the handler methods for the various URLs we handle
app.get('/*', handleCaptive);
app.get('/', handleRoot);
app.get('/wifi-setup', handleWiFiSetup);
app.post('/connecting', handleConnecting);
app.use(express.static(templatesPath));

WiFiSetupApp.onRequest = app;

function getTemplate(filename) {
  return Handlebars.compile(fs.readFileSync(filename, 'utf8'));
}

const wifiSetupTemplate = getTemplate(
  path.join(templatesPath, 'wifiSetup.handlebars'));
const connectingTemplate = getTemplate(
  path.join(templatesPath, 'connecting.handlebars'));
const hotspotTemplate = getTemplate(
  path.join(templatesPath, 'hotspot.handlebars'));

// When the client issues a GET request for the list of wifi networks
// scan and return them

// this function handles requests for captive portals
function handleCaptive(request, response, next) {
  console.log('handleCaptive', request.path);
  if (request.path === '/hotspot.html') {
    console.log('sending hotspot.html');
    response.send(hotspotTemplate({ap_ip: platform.ap_ip}));
  } else if (request.path === '/hotspot-detect.html' ||
    request.path === '/connecttest.txt') {
    console.log('ios or osx captive portal request', request.path);
    if (request.get('User-Agent').includes('CaptiveNetworkSupport') ||
        request.get('User-Agent').includes('Microsoft NCSI')) {
      console.log('windows captive portal request');
      response.redirect(302, `http://${platform.ap_ip}/hotspot.html`);
    } else {
      response.redirect(302, `http://${platform.ap_ip}/wifi-setup`);
    }
  } else if (request.path === '/generate_204' || request.path === '/fwlink/') {
    console.log('android captive portal request');
    response.redirect(302, `http://${platform.ap_ip}/wifi-setup`);
  } else if (request.path === '/redirect') {
    console.log('redirect - send setup for windows');
    response.redirect(302, `http://${platform.ap_ip}/wifi-setup`);
  } else {
    console.log('skipping.');
    next();
  }
}

// This function handles requests for the root URL '/'.
// We display a different page depending on what stage of setup we're at
function handleRoot(request, response) {
  wifi.getStatus().then((status) => {
    // If we don't have a wifi connection yet, display the wifi setup page
    if (status !== 'COMPLETED') {
      console.log('no wifi connection; redirecting to wifiSetup');
      response.redirect('/wifi-setup');
    } else {
      // Otherwise, look to see if we have an oauth token yet
      console.log('wifi setup complete; redirecting /status');
      response.redirect('/status');
    }
  })
    .catch((e) => {
      console.error(e);
    });
}

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
    let map1 = [];
    if (results) {
      map1 = results.filter((x) => x.length > 7);
      map1 = map1.map((word) => {
        let icon = 'wifi-secure.svg';
        let pwdRequired = true;
        if (word.substring(3, 5).trim() !== 'on') {
          icon = 'wifi.svg';
          pwdRequired = false;
        }
        return {
          icon,
          pwdRequired,
          ssid: word.substring(6),
        };
      });
    }

    response.send(wifiSetupTemplate({networks: map1}));
  });
}

function handleConnecting(request, response) {
  if (request.body.skip === '1') {
    const profileDir = process.env.MOZIOT_HOME || config.get('profileDir');
    const wifiskipPath = path.join(profileDir, 'config', 'wifiskip');
    fs.closeSync(fs.openSync(wifiskipPath, 'w'));
    console.log('skip wifi setup. stop the ap');
    response.send(connectingTemplate({skip: 'true'}));
    wifi.stopAP()
      .then(() => wifi.broadcastBeacon())
      .then(() => {
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
  //
  response.send(connectingTemplate({skip: 'false'}));

  // Wait before switching networks to make sure the response gets through.
  // And also wait to be sure that the access point is fully down before
  // defining the new network. If I only wait two seconds here, it seems
  // like the Edison takes a really long time to bring up the new network
  // but a 5 second wait seems to work better.
  wait(2000)
    .then(() => wifi.stopAP())
    .then(() => wait(5000))
    .then(() => wifi.getKnownNetworks())
    .then((networks) => {
      const index = networks.indexOf(ssid);
      if (index >= 0) {
        // Remove the existing network. We should be able to update this with
        // `wpa_cli -iwlan0 new_password <id> "<psk>"`, but that doesn't seem
        // to actually work.
        return wifi.removeNetwork(index);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => wifi.defineNetwork(ssid, password))
    .then(() => wifi.waitForWiFi(20, 3000))
    .then(() => wifi.broadcastBeacon())
    .then(() => {
      WiFiSetupApp.onConnection();
    })
    .catch((error) => {
      console.log('General Error:', error);
    });
}

module.exports = WiFiSetupApp;
