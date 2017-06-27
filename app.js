#!/usr/bin/env node
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
var https = require('https');
var http = require('http');
var fs = require('fs');
var express = require('express');
var expressWs = require('express-ws');
var bodyParser = require('body-parser');
var GetOpt = require('node-getopt');
var config = require('config');
var adapterManager = require('./adapter-manager');
var db = require('./db');
var Router = require('./router');
var TunnelService = require('./ssltunnel');


// Create Express app, HTTP(S) server and WebSocket server
var app = express();
var server;

// Defer calls to ws(), storing all context necessary to recreate them once
// express-ws is initialized
var deferredWsRoutes = [];
function deferWs() {
  deferredWsRoutes.push({
    'this': this,
    'arguments': arguments
  });
}

app.ws = deferWs;
express.Router.ws = deferWs;

function startHttpsService() {
      // HTTP server configuration
    var port = config.get('ports.https');
    var options = {
        key: fs.readFileSync('privatekey.pem'),
        cert: fs.readFileSync('certificate.pem')
    };
    server = https.createServer(options, app);

    // Inject the real ws handler
    delete app.ws;
    delete express.Router.ws;
    expressWs(app, server);
    // Process the deferred routes
    for (let defer of deferredWsRoutes) {
      app.ws.apply(defer.this, defer.arguments);
    }

    // Start the HTTPS server
    server.listen(port, function() {
      adapterManager.loadAdapters();
      console.log('Listening on port', server.address().port);
    });
}

// if we have the certificates installed, we start https
if (TunnelService.hasCertificates() && !TunnelService.userSkipped()) {
    startHttpsService();
    if (TunnelService.hasTunnelToken()){
      TunnelService.start();
    }
} else {
    // otherwise we start plain http
    var port = config.get('ports.http');
    server = http.createServer(app);
}

function configureOptions() {
  if (!config.get('cli')) {
    return {
      options: {
        debug: false,
        port: null,
      }
    };
  }

  // Command line arguments
  const getopt = new GetOpt([
    ['d', 'debug', 'Enable debug features'],
    ['p', 'port=PORT', 'Specify the server port to use (default ' + port + ')'],
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

  return {
    options
  };
}

const opt = configureOptions();
if (opt.options.port) {
  port = opt.options.port;
}

// Configure app
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());   // Use bodyParser to access the body of requests

// Configure router with configured app and command line options.
Router.configure(app, opt);

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

if (!server.listening) {
  // Start the HTTPS server
  server.listen(port, function() {
    adapterManager.loadAdapters();
    console.log('Listening on port', server.address().port);
  });
}

// function to stop running server and start https
TunnelService.switchToHttps = function(){
  server.close();
  startHttpsService();
};

module.exports = { // for testing
  app: app,
  server: server
};
