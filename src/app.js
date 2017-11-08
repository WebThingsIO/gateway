/*
 * Things Gateway App.
 *
 * Back end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// Dependencies
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
const adapterManager = require('./adapter-manager');
const db = require('./db');
const Router = require('./router');
const TunnelService = require('./ssltunnel');
const JSONWebToken = require('./models/jsonwebtoken');
const Constants = require('./constants');
const Settings = require('./models/settings');

// The following causes an instance of AppInstance to be created.
// This is then used in other places (like src/adapters/plugin/ipc.js)
require('./app-instance');

// Open the database
db.open();

// Move the tunneltoken into the database
if (fs.existsSync('tunneltoken')) {
  const token = JSON.parse(fs.readFileSync('tunneltoken'));
  Settings.set('tunneltoken', token).then(function() {
    fs.unlinkSync('tunneltoken');
  }).catch(function(e) {
    throw e;
  });
}

// Move the notunnel setting into the database
if (fs.existsSync('notunnel')) {
  Settings.set('notunnel', true).then(function() {
    fs.unlinkSync('notunnel');
  }).catch(function(e) {
    throw e;
  });
}

let httpServer = http.createServer();
let httpApp = createGatewayApp(httpServer);

let httpsServer = createHttpsServer();
let httpsApp = null;

function createHttpsServer() {
  if (!fs.existsSync('privatekey.pem') || !fs.existsSync('certificate.pem')) {
    return null;
  }

  // HTTPS server configuration
  const options = {
    key: fs.readFileSync('privatekey.pem'),
    cert: fs.readFileSync('certificate.pem')
  };
  if (fs.existsSync('chain.pem')){
    options.ca = fs.readFileSync('chain.pem');
  }
  return https.createServer(options);
}

function startHttpsGateway() {
  let port = config.get('ports.https');
  const cliOptions = getOptions();
  if (typeof cliOptions.port === 'number') {
    port = cliOptions.port;
  }

  httpsApp = createGatewayApp(httpsServer);
  httpsServer.on('request', httpsApp);

  // Start the HTTPS server
  httpsServer.listen(port, function() {
    adapterManager.loadAdapters();
    rulesEngineConfigure(httpsServer);
    console.log('Listening on port', httpsServer.address().port);
    commandParserConfigure(httpsServer);
  });

  // Redirect HTTP to HTTPS
  httpServer.on('request', createRedirectApp(httpsServer.address().port));
  const httpPort = config.get('ports.http');
  httpServer.listen(httpPort, function() {
    console.log('Redirector listening on port', httpServer.address().port);
  });
}

function startHttpGateway() {
  httpServer.on('request', httpApp);

  let port = config.get('ports.http');
  const options = getOptions();
  if (typeof options.port === 'number') {
    port = options.port;
  }

  httpServer.listen(port, function() {
    adapterManager.loadAdapters();
    rulesEngineConfigure(httpServer);
    console.log('Listening on port', httpServer.address().port);
  });
}

function stopHttpGateway() {
  httpServer.removeListener('request', httpApp);
}

function getOptions() {
  if (!config.get('cli')) {
    return {
      debug: false,
      port: null
    };
  }

  // Command line arguments
  const getopt = new GetOpt([
    ['d', 'debug', 'Enable debug features'],
    ['p', 'port=PORT', 'Specify the server port to use'],
    ['h', 'help', 'Display help' ],
    ['v', 'verbose', 'Show verbose output'],
  ]);

  const opt = getopt.parseSystem();
  const options = {
    debug: !!opt.options.debug, // cast to bool
    verbose: opt.options.verbose,
  }

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
 * The command parser talks to the server over the public HTTP/WS API,
 * the gateway needs to configure it with a JWT and a server address
 * @param {http.Server|https.Server} server
 */
function commandParserConfigure(server) {
  const commandParser = require('./controllers/commands_controller.js');
  let protocol = 'https';
  if (server instanceof http.Server) {
    protocol = 'http';
  }
  const gatewayHref = protocol + '://127.0.0.1:' + server.address().port;
  JSONWebToken.issueToken(-1).then(jwt => {
    commandParser.configure(gatewayHref, jwt);
  });
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
  const gatewayHref = protocol + '://127.0.0.1:' + server.address().port;
  rulesEngine.configure(gatewayHref);
}

function createApp() {
  const app = express();

  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());   // Use bodyParser to access the body of requests
  app.use(fileUpload());        // Use fileUpload to handle multi-part uploads

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

  // Allow LE challenges, used when renewing domain.
  app.use(/^\/\.well-known\/acme-challenge\/.*/,
          function(request, response, next) {
    if (request.method !== 'GET') {
      response.sendStatus(403);
      return;
    }

    const reqPath = path.join(Constants.STATIC_PATH, request.path);
    if (fs.existsSync(reqPath)) {
      response.sendFile(reqPath);
      return;
    }

    next();
  });

  // Redirect based on https://https.cio.gov/apis/
  app.use(function(request, response) {
    if (request.method !== 'GET') {
      response.sendStatus(403);
      return;
    }
    if (request.headers.authorization) {
      response.sendStatus(403);
      return;
    }
    let httpsUrl = 'https://' + request.hostname;
    // If we're behind forwarding we can redirect to the port-free https url
    if (port !== 443 && !config.get('behindForwarding')) {
      httpsUrl += ':' + port
    }
    httpsUrl += request.url;
    response.redirect(301, httpsUrl);
  });

  return app;
}

let serverStartup = Promise.resolve();

// if we have the certificates installed, we start https
if (TunnelService.hasCertificates()) {
  serverStartup = TunnelService.userSkipped().then(function(res) {
    if (res) {
      startHttpGateway();
    } else {
      startHttpsGateway();
      TunnelService.hasTunnelToken().then(function(result) {
        if (result) {
          TunnelService.start();
        }
      });
    }
  });
} else {
  startHttpGateway();
}

if (config.get('cli')) {
  // Get some decent error messages for unhandled rejections. This is
  // often just errors in the code.
  process.on('unhandledRejection', (reason) => {
    console.log('Unhandled Rejection');
    console.error(reason);
  });

  // Do graceful shutdown when Control-C is pressed.
  process.on('SIGINT', function() {
    console.log('Control-C: disconnecting adapters...');
    adapterManager.unloadAdapters();
    TunnelService.stop();
    process.exit(0);
  });
}

// function to stop running server and start https
TunnelService.switchToHttps = function(){
  stopHttpGateway();
  startHttpsGateway();
};

module.exports = { // for testing
  httpServer: httpServer,
  server: httpsServer,
  serverStartup: serverStartup
};
