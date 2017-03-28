/**
 * Things Router.
 *
 * Manages HTTP requests to /things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
var express = require('express');
var ThingsRouter = express.Router();
var Database = require('../db.js');

ThingsRouter.get('/', function (request, response) {
  Database.getAllThings().then(function(things) {
    response.send(JSON.stringify(things));
  });
});

module.exports = ThingsRouter;
