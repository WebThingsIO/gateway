/**
 * Router.
 *
 * Configure web app routes.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const express = require('express');
const Constants = require('./constants');
const authMiddleware = require('./jwt-middleware');

const auth = authMiddleware();

/**
 * Router.
 */
var Router = {
  /**
   * Configure web app routes.
   */
  configure: function(app, opt) {

    const API_PREFIX = '/api'; // A pseudo path to use for API requests
    const APP_PREFIX = '/app'; // A pseudo path to use for front end requests

    // First look for a static file
    app.use(express.static(Constants.STATIC_PATH));

    // Content negotiation middleware
    app.use(function(request, response, next) {
      // If request won't accept HTML but will accept JSON,
      // or is a WebSocket request, treat it as an API request
      if (!request.accepts('html') && request.accepts('json') ||
          request.get('Upgrade') === 'websocket') {
        request.url = API_PREFIX + request.url;
        next();
      // Otherwise treat it as an app request
      } else {
        request.url = APP_PREFIX + request.url;
        next();
      }
    });

    // Web app routes - send index.html and fall back to client side URL router
    app.use(APP_PREFIX + '/*', require('./controllers/root_controller'));

    // Unauthenticated API routes
    app.use(API_PREFIX + Constants.LOGIN_PATH,
      require('./controllers/login_controller'));
    app.use(API_PREFIX + Constants.SETTINGS_PATH,
      require('./controllers/tunnel_controller'));
    if (opt.options.debug) {
      app.use(API_PREFIX + Constants.DEBUG_PATH,
      require('./controllers/debug_controller'));
    }

    // Authenticated API routes
    app.use(API_PREFIX + Constants.THINGS_PATH,
      auth, require('./controllers/things_controller'));
    app.use(API_PREFIX + Constants.NEW_THINGS_PATH,
      auth, require('./controllers/new_things_controller'));
    app.use(API_PREFIX + Constants.ADAPTERS_PATH,
      auth, require('./controllers/adapters_controller'));
    app.use(API_PREFIX + Constants.ACTIONS_PATH,
      auth, require('./controllers/actions_controller'));
    app.use(API_PREFIX + Constants.LOG_OUT_PATH,
      auth, require('./controllers/log_out_controller'));
    app.use(API_PREFIX + Constants.USERS_PATH,
      require('./controllers/users_controller'));
  }
};

module.exports = Router;
