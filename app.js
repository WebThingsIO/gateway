#!/usr/bin/env node
/*
 * MozIoT Gateway App.
 *
 * Back end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* jshint unused:false */

'use strict';

// Dependencies
var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var expressWs = require('express-ws');
var bodyParser = require('body-parser');
var GetOpt = require('node-getopt');
var passport = require('passport');
var config = require('config');
var adapterManager = require('./adapter-manager');
var db = require('./db');
var Users = require('./models/users');
var Authentication = require('./authentication');
var Router = require('./router');

// HTTP server configuration
var port = 8080;
var https_port = 4443;
var options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
};

// Create Express app, HTTP(S) server and WebSocket server
var app = express();
var server = https.createServer(options, app);
var expressWs = expressWs(app, server);

// Command line arguments
var getopt = new GetOpt([
  ['d', 'debug',      'Enable debug features'],
  ['p', 'port=PORT',  'Specify the server port to use (default ' + port + ')'],
  ['h', 'help',       'Display help' ],
  ['v', 'verbose',    'Show verbose output' ],
]);

var opt = getopt.parseSystem();
if (opt.options.verbose) {
    console.log(opt);
}

if (opt.options.help) {
    getopt.showHelp();
    process.exit(1);
}

if (opt.options.port) {
  port = parseInt(opt.options.port);
}

// Configure app
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());   // Use bodyParser to access the body of requests

// Configure authentication with Passport
if (config.get('authentication.enabled')) {
  Authentication.configure(app, passport);
}

// Configure router with configured app and command line options.
Router.configure(app, opt);

// Open the database
db.open();

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
  process.exit(1);
});

// Start the HTTPS server
server.listen(https_port, function() {
  console.log('Listening on port', https_port);
  adapterManager.loadAdapters();
});

module.exports = app; // for testing
