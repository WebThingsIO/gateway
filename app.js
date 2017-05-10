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

var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var expressWs = require('express-ws');
var bodyParser = require('body-parser');
var GetOpt = require('node-getopt');
var adapterManager = require('./adapter-manager');
var db = require('./db');
var config = require('./config');

var port = 8080;
var https_port = 4443;
var options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
};

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

// We need to install a bodyParser in order to access the body in
// PUT & POST requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Open the thing database.
db.open();

// Things router
app.use(config.THINGS_PATH, require('./controllers/things_controller'));
// New Things router
app.use(config.NEW_THINGS_PATH, require('./controllers/new_things_controller'));
// Adapters router
app.use(config.ADAPTERS_PATH, require('./controllers/adapters_controller'));
// Actions router
app.use(config.ACTIONS_PATH, require('./controllers/actions_controller'));
// Debug router
if (opt.options.debug) {
  app.use(config.DEBUG_PATH, require('./controllers/debug_controller'));
}
// Static router
app.use(express.static(config.STATIC_PATH));

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

server.listen(https_port, function() {
  console.log('Listening on port', https_port);
  adapterManager.loadAdapters();
});
