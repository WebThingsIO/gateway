/*
 * Things Gateway App.
 *
 * Back end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Set up the user profile.
const UserProfile = require('./user-profile');
UserProfile.init();
const migration = UserProfile.migrate();

// Causes a timestamp to be prepended to console log lines.
require('./log-timestamps');

// External Dependencies
const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const expressWs = require('express-ws');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const GetOpt = require('node-getopt');
const config = require('config');
const path = require('path');
const expressHandlebars = require('express-handlebars');
const ipRegex = require('ip-regex');

// Internal Dependencies
const addonManager = require('./addon-manager');
const Constants = require('./constants');
const db = require('./db');
const mDNSserver = require('./mdns-server');
const platform = require('./platform');
const Router = require('./router');
const TunnelService = require('./ssltunnel');
const {RouterSetupApp, isRouterConfigured} = require('./router-setup');
const {WiFiSetupApp, isWiFiConfigured} = require('./wifi-setup');

// The following causes an instance of AppInstance to be created.
// This is then used in other places (like src/addons/plugin/ipc.js)
require('./app-instance');

// Open the database
db.open();

const servers = {};
servers.http = http.createServer();
const httpApp = createGatewayApp(servers.http);

servers.https = createHttpsServer();
let httpsApp = null;

/**
 * Creates an HTTPS server object, if successful. If there are no public and
 * private keys stored for the tunnel service, null is returned.
 *
 * @param {}
 * @return {Object|null} https server object if successful, else NULL
 */
function createHttpsServer() {
  if (!TunnelService.hasCertificates()) {
    return null;
  }

  // HTTPS server configuration
  const options = {
    key: fs.readFileSync(path.join(UserProfile.sslDir, 'privatekey.pem')),
    cert: fs.readFileSync(path.join(UserProfile.sslDir, 'certificate.pem')),
  };
  if (fs.existsSync(path.join(UserProfile.sslDir, 'chain.pem'))) {
    options.ca = fs.readFileSync(path.join(UserProfile.sslDir, 'chain.pem'));
  }
  return https.createServer(options);
}

function startHttpsGateway() {
  const port = config.get('ports.https');

  if (!servers.https) {
    servers.https = createHttpsServer();
  }

  httpsApp = createGatewayApp(servers.https);
  servers.https.on('request', httpsApp);

  const promises = [];

  // Start the HTTPS server
  promises.push(new Promise((resolve) => {
    servers.https.listen(port, () => {
      migration.then(() => {
        addonManager.loadAddons();
      });
      rulesEngineConfigure(servers.https);
      console.log('HTTPS server listening on port',
                  servers.https.address().port);
      resolve();
    });
  }));

  // Redirect HTTP to HTTPS
  servers.http.on('request', createRedirectApp(servers.https.address().port));
  const httpPort = config.get('ports.http');

  promises.push(new Promise((resolve) => {
    servers.http.listen(httpPort, () => {
      console.log('Redirector listening on port', servers.http.address().port);
      resolve();
    });
  }));

  return Promise.all(promises).then(() => servers.https);
}

function startHttpGateway() {
  servers.http.on('request', httpApp);

  const port = config.get('ports.http');

  return new Promise((resolve) => {
    servers.http.listen(port, () => {
      migration.then(() => {
        addonManager.loadAddons();
      });
      rulesEngineConfigure(servers.http);
      console.log('HTTP server listening on port', servers.http.address().port);
      resolve();
    });
  });
}

function stopHttpGateway() {
  servers.http.removeListener('request', httpApp);
}

function startWiFiSetup() {
  servers.http.on('request', WiFiSetupApp.onRequest);

  const port = config.get('ports.http');

  servers.http.listen(port);
}

function stopWiFiSetup() {
  servers.http.removeListener('request', WiFiSetupApp.onRequest);
}

function startRouterSetup() {
  servers.http.on('request', RouterSetupApp.onRequest);

  const port = config.get('ports.http');

  servers.http.listen(port);
}

function stopRouterSetup() {
  servers.http.removeListener('request', RouterSetupApp.onRequest);
}

function getOptions() {
  if (!config.get('cli')) {
    return {
      debug: false,
      port: null,
    };
  }

  // Command line arguments
  const getopt = new GetOpt([
    ['d', 'debug', 'Enable debug features'],
    ['h', 'help', 'Display help'],
    ['v', 'verbose', 'Show verbose output'],
  ]);

  const opt = getopt.parseSystem();
  const options = {
    debug: !!opt.options.debug, // cast to bool
    verbose: opt.options.verbose,
  };

  if (opt.options.verbose) {
    console.log(opt);
  }

  if (opt.options.help) {
    getopt.showHelp();
    process.exit(1);
  }

  if (opt.options.port) {
    options.port = parseInt(opt.options.port);
  }

  return options;
}

/**
 * Because the rules engine talks to the server over the public HTTP/WS API,
 * the gateway needs to configure it with a JWT and a server address
 * @param {http.Server|https.Server} server
 */
function rulesEngineConfigure(server) {
  const rulesEngine = require('./rules-engine/index.js');
  let protocol = 'https';
  if (server instanceof http.Server) {
    protocol = 'http';
  }
  const gatewayHref = `${protocol}://127.0.0.1:${server.address().port}`;
  rulesEngine.configure(gatewayHref);
}

function createApp() {
  const app = express();
  app.engine('handlebars', expressHandlebars());
  app.set('view engine', 'handlebars');
  app.set('views', Constants.VIEWS_PATH);

  // Use bodyParser to access the body of requests
  app.use(bodyParser.urlencoded({
    extended: false,
  }));
  app.use(bodyParser.json({limit: '1mb'}));

  // Use fileUpload to handle multi-part uploads
  app.use(fileUpload());

  return app;
}

/**
 * @param {http.Server|https.Server} server
 * @return {express.Router}
 */
function createGatewayApp(server) {
  const app = createApp();
  const opt = getOptions();

  // Inject WebSocket support
  expressWs(app, server);

  // Configure router with configured app and command line options.
  Router.configure(app, opt);
  return app;
}

function createRedirectApp(port) {
  const app = createApp();

  // Redirect based on https://https.cio.gov/apis/
  app.use((request, response) => {
    if (request.method !== 'GET') {
      response.sendStatus(403);
      return;
    }
    if (request.headers.authorization) {
      response.sendStatus(403);
      return;
    }
    let httpsUrl = `https://${request.hostname}`;
    // If we're behind forwarding we can redirect to the port-free https url
    if (port !== 443 && !config.get('behindForwarding')) {
      httpsUrl += `:${port}`;
    }
    httpsUrl += request.url;

    // If the request is for a bare hostname, a .local address, or an IP
    // address, use a 307 redirect to prevent caching. For instance, if the
    // browser caches a redirect for gateway.local to the HTTPS version, things
    // will break after resetting/reflashing the gateway.
    //
    // Otherwise, use a 301 to help mitigate DNS hijacking.
    if (request.hostname.indexOf('.') < 0 ||
        request.hostname.endsWith('.local') ||
        ipRegex({exact: true}).test(request.hostname)) {
      response.redirect(307, httpsUrl);
    } else {
      response.redirect(301, httpsUrl);
    }
  });

  return app;
}

const serverStartup = {
  promise: Promise.resolve(),
};

switch (platform.getOS()) {
  case 'linux-raspbian':
    migration.then(() => {
      return isWiFiConfigured();
    }).then((configured) => {
      if (!configured) {
        WiFiSetupApp.onConnection = () => {
          stopWiFiSetup();
          startGateway();
        };
        startWiFiSetup();
      } else {
        startGateway();
      }
    });
    break;
  case 'linux-openwrt':
    migration.then(() => {
      return isRouterConfigured();
    }).then((configured) => {
      if (!configured) {
        RouterSetupApp.onConnection = () => {
          stopRouterSetup();
          startGateway();
        };
        startRouterSetup();
      } else {
        startGateway();
      }
    });
    break;
  default:
    startGateway();
    break;
}

function startGateway() {
  // if we have the certificates installed, we start https
  if (TunnelService.hasCertificates()) {
    serverStartup.promise = TunnelService.userSkipped().then((res) => {
      if (res) {
        return startHttpGateway();
      }

      return startHttpsGateway().then((server) => {
        TunnelService.hasTunnelToken().then((result) => {
          if (result) {
            TunnelService.setServerHandle(server);
            TunnelService.start();
          }
        });
      });
    });
  } else {
    serverStartup.promise = startHttpGateway();
  }
}

if (config.get('cli')) {
  // Get some decent error messages for unhandled rejections. This is
  // often just errors in the code.
  process.on('unhandledRejection', (reason) => {
    console.log('Unhandled Rejection');
    console.error(reason);
  });

  // Do graceful shutdown when Control-C is pressed.
  process.on('SIGINT', () => {
    console.log('Control-C: unloading add-ons...');
    addonManager.unloadAddons();
    mDNSserver.server.cleanup();
    TunnelService.stop();
    process.exit(0);
  });
}

// function to stop running server and start https
TunnelService.switchToHttps = () => {
  stopHttpGateway();
  startHttpsGateway().then((server) => {
    TunnelService.setServerHandle(server);
  });
};

// This part starts our Service Discovery process.
// We check to see if mDNS should be setup in default mode, or has a previous
// user setup a unique domain. Then we start it.
mDNSserver.getmDNSstate().then((state) => {
  try {
    mDNSserver.getmDNSconfig().then((mDNSconfig) => {
      console.log(`DNS config is: ${mDNSconfig.host}`);
      mDNSserver.server.changeProfile(mDNSconfig);
      mDNSserver.server.setState(state);
    });
  } catch (err) {
    // if we failed to startup mDNS it's not the end of the world log it
    // and carry on
    console.error(`Service Discover failed to start with error: ${err}`);
  }
});

module.exports = { // for testing
  servers,
  serverStartup,
};
