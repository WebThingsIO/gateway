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

const config = require('config');
const compression = require('compression');
const Constants = require('./constants');
const express = require('express');
const jwtMiddleware = require('./jwt-middleware');
const nocache = require('nocache')();
const UserProfile = require('./user-profile');

const auth = jwtMiddleware.middleware();

const API_PREFIX = '/api'; // A pseudo path to use for API requests
const APP_PREFIX = '/app'; // A pseudo path to use for front end requests

/**
 * Router.
 */
const Router = {
  /**
   * Configure web app routes.
   */
  configure: function(app, options) {
    this.proxyController = require('./controllers/proxy_controller');

    // Compress all responses larger than 1kb
    app.use(compression());

    app.use((request, response, next) => {
      // Enable HSTS
      if (request.protocol === 'https') {
        response.set('Strict-Transport-Security',
                     'max-age=31536000; includeSubDomains');
      }

      // Disable embedding
      response.set('Content-Security-Policy',
                   config.get('oauthPostToken') ?
                     'frame-ancestors filesystem:' :
                     'frame-ancestors \'none\''
      );

      next();
    });

    // First look for a static file
    const staticHandler = express.static(Constants.BUILD_STATIC_PATH);
    app.use(Constants.UPLOADS_PATH, express.static(UserProfile.uploadsDir));
    app.use((request, response, next) => {
      if (request.path === '/' && request.accepts('html')) {
        // We need this to hit RootController.
        next();
      } else {
        staticHandler(request, response, next);
      }
    });

    // Allow LE challenges, used when renewing domain.
    const acmeHandler = express.static(Constants.BUILD_STATIC_PATH);
    app.use('/.well-known/acme-challenge', acmeHandler);

    // Content negotiation middleware
    app.use((request, response, next) => {
      // Inform the browser that content negotiation is taking place
      response.setHeader('Vary', 'Accept');

      // Enable CORS for all requests
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      response.setHeader('Access-Control-Allow-Methods',
                         'GET,HEAD,PUT,PATCH,POST,DELETE');

      // If this is a proxy request, skip everything and go straight there.
      if (request.path.startsWith(Constants.PROXY_PATH)) {
        request.url = APP_PREFIX + request.url;
        next();

      // If request won't accept HTML but will accept JSON,
      // or is a WebSocket request, or is multipart/form-data
      // treat it as an API request
      } else if (!request.accepts('html') && request.accepts('json') ||
                 request.headers['content-type'] === 'application/json' ||
                 request.get('Upgrade') === 'websocket' ||
                 request.is('multipart/form-data') ||
                 request.path.startsWith(Constants.ADDONS_PATH) ||
                 request.path.startsWith(Constants.INTERNAL_LOGS_PATH)) {
        request.url = API_PREFIX + request.url;
        next();

      // Otherwise treat it as an app request
      } else {
        request.url = APP_PREFIX + request.url;
        next();
      }
    });

    // Handle proxied resources
    app.use(APP_PREFIX + Constants.PROXY_PATH, nocache, auth,
            this.proxyController);

    // Let OAuth handle its own rendering
    app.use(APP_PREFIX + Constants.OAUTH_PATH, nocache,
            require('./controllers/oauth_controller').default);

    // Handle static media files before other static content. These must be
    // authenticated.
    app.use(APP_PREFIX + Constants.MEDIA_PATH, nocache, auth,
            express.static(UserProfile.mediaDir));

    // Web app routes - send index.html and fall back to client side URL router
    app.use(`${APP_PREFIX}/*`, require('./controllers/root_controller'));

    // Unauthenticated API routes
    app.use(API_PREFIX + Constants.LOGIN_PATH, nocache,
            require('./controllers/login_controller'));
    app.use(API_PREFIX + Constants.SETTINGS_PATH, nocache,
            require('./controllers/settings_controller'));
    app.use(API_PREFIX + Constants.USERS_PATH, nocache,
            require('./controllers/users_controller'));
    app.use(API_PREFIX + Constants.PING_PATH, nocache,
            require('./controllers/ping_controller'));
    if (options.debug) {
      app.use(API_PREFIX + Constants.DEBUG_PATH, nocache,
              require('./controllers/debug_controller'));
    }

    // Authenticated API routes
    app.use(API_PREFIX + Constants.THINGS_PATH, nocache, auth,
            require('./controllers/things_controller'));
    app.use(API_PREFIX + Constants.NEW_THINGS_PATH, nocache, auth,
            require('./controllers/new_things_controller'));
    app.use(API_PREFIX + Constants.ADAPTERS_PATH, nocache, auth,
            require('./controllers/adapters_controller'));
    app.use(API_PREFIX + Constants.ACTIONS_PATH, nocache, auth,
            require('./controllers/actions_controller'));
    app.use(API_PREFIX + Constants.EVENTS_PATH, nocache, auth,
            require('./controllers/events_controller'));
    app.use(API_PREFIX + Constants.LOG_OUT_PATH, nocache, auth,
            require('./controllers/log_out_controller'));
    app.use(API_PREFIX + Constants.UPLOADS_PATH, nocache, auth,
            require('./controllers/uploads_controller'));
    app.use(API_PREFIX + Constants.COMMANDS_PATH, nocache, auth,
            require('./controllers/commands_controller'));
    app.use(API_PREFIX + Constants.UPDATES_PATH, nocache, auth,
            require('./controllers/updates_controller'));
    app.use(API_PREFIX + Constants.ADDONS_PATH, nocache, auth,
            require('./controllers/addons_controller'));
    app.use(API_PREFIX + Constants.RULES_PATH, nocache, auth,
            require('./rules-engine/index.js'));
    app.use(API_PREFIX + Constants.INTERNAL_LOGS_PATH, nocache, auth,
            require('./controllers/internal_logs_controller'));
    app.use(API_PREFIX + Constants.PUSH_PATH, nocache, auth,
            require('./controllers/push_controller'));
    app.use(API_PREFIX + Constants.LOGS_PATH, nocache, auth,
            require('./controllers/logs_controller'));

    app.use(API_PREFIX + Constants.OAUTH_PATH, nocache,
            require('./controllers/oauth_controller').default);
    app.use(API_PREFIX + Constants.OAUTHCLIENTS_PATH, nocache, auth,
            require('./controllers/oauthclients_controller').default);
  },

  addProxyServer(thingId, server) {
    this.proxyController.addProxyServer(thingId, server);
  },

  removeProxyServer(thingId) {
    this.proxyController.removeProxyServer(thingId);
  },
};

module.exports = Router;
