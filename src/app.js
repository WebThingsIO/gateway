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
const bodyParser = require('body-parser');
const GetOpt = require('node-getopt');
const config = require('config');
const adapterManager = require('./adapter-manager');
const db = require('./db');
const Router = require('./router');
const TunnelService = require('./ssltunnel');
const JSONWebToken = require('./models/jsonwebtoken');

let httpServer = http.createServer();
let httpApp = createGatewayApp(httpServer);

let httpsServer = null;
let httpsApp = null;

function startHttpsGateway() {
  let port = config.get('ports.https');
  const cliOptions = getOptions();
  if (typeof cliOptions.port === 'number') {
    port = cliOptions.port;
  }

  // HTTPS server configuration
  const options = {
    key: fs.readFileSync('privatekey.pem'),
    cert: fs.readFileSync('certificate.pem')
  };
  if (fs.existsSync('chain.pem')){
    options.ca = fs.readFileSync('chain.pem');
  }
  httpsServer = https.createServer(options);
  httpsApp = createGatewayApp(httpsServer);
  httpsServer.on('request', httpsApp);

  // Start the HTTPS server
  httpsServer.listen(port, function() {
    adapterManager.loadAdapters();
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
  const commandParser = require('./controllers/command_controller.js');
  let protocol = 'https';
  if (server instanceof http.Server) {
    protocol = 'http';
  }
  const gatewayHref = protocol + '://127.0.0.1:' + server.address().port;
  JSONWebToken.issueToken(-1).then(jwt => {
    commandParser.configure(gatewayHref, jwt);
  });
}

function createApp() {
  const app = express();

  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());   // Use bodyParser to access the body of requests

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
    if (port !== 443) {
      httpsUrl += ':' + port
    }
    httpsUrl += request.url;
    response.redirect(301, httpsUrl);
  });

  return app;
}

// if we have the certificates installed, we start https
if (TunnelService.hasCertificates() && !TunnelService.userSkipped()) {
  startHttpsGateway();
  if (TunnelService.hasTunnelToken()) {
    TunnelService.start();
  }
} else {
  // otherwise we start plain http
  startHttpGateway();
}

// Open the database
db.open();

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
    process.exit(1);
  });
}

// function to stop running server and start https
TunnelService.switchToHttps = function(){
  stopHttpGateway();
  startHttpsGateway();
};

module.exports = { // for testing
  httpServer: httpServer,
  server: httpsServer
};
