/*
 * MozIoT Gateway App.
 *
 * Back end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
var express = require('express');
var db = require('./db');
var app = express();

// Open the thing database.
db.open();

// Serve Things from Things router
var thingsRouter = require('./controllers/things_controller');
app.use('/things', thingsRouter);

// Serve static files from static/ directory
app.use(express.static('static'));

// Start HTTP server on port 8080
app.listen(8080, function () {
  console.log('Listening on port 8080.');
});
