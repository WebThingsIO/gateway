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
const nocache = require('nocache');
const UserProfile = require('./user-profile').default;

const AdaptersController = require('./controllers/adapters_controller');
const AddonsController = require('./controllers/addons_controller');
const DebugController = require('./controllers/debug_controller');
const ExtensionsController = require('./controllers/extensions_controller');
const InternalLogsController = require('./controllers/internal_logs_controller');
const LogOutController = require('./controllers/log_out_controller');
const LoginController = require('./controllers/login_controller');
const LogsController = require('./controllers/logs_controller');
const NotifiersController = require('./controllers/notifiers_controller');
const OAuthController = require('./controllers/oauth_controller');
const OAuthClientsController = require('./controllers/oauthclients_controller');
const PingController = require('./controllers/ping_controller');
const ProxyController = require('./controllers/proxy_controller');
const PushController = require('./controllers/push_controller');
const RootController = require('./controllers/root_controller');
const SettingsController = require('./controllers/settings_controller');
const UpdatesController = require('./controllers/updates_controller');
const UploadsController = require('./controllers/uploads_controller');
const UsersController = require('./controllers/users_controller');

const API_PREFIX = '/api'; // A pseudo path to use for API requests
const APP_PREFIX = '/app'; // A pseudo path to use for front end requests

/**
 * Router.
 */
class Router {
  /**
   * Configure web app routes.
   */
  configure(app, options) {
    const auth = jwtMiddleware.middleware();
    const nc = nocache();

    this.proxyController = ProxyController();

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
                   config.get('oauth.postToken') ?
                     'frame-ancestors filesystem:' :
                     'frame-ancestors \'none\''
      );

      next();
    });

    // First look for a static file
    const staticHandler = express.static(Constants.BUILD_STATIC_PATH);
    app.use(Constants.UPLOADS_PATH, express.static(UserProfile.uploadsDir));
    app.use(Constants.EXTENSIONS_PATH, nc, ExtensionsController());
    app.use((request, response, next) => {
      if (request.path === '/' && request.accepts('html')) {
        // We need this to hit RootController.
        next();
      } else {
        staticHandler(request, response, next);
      }
    });

    // Content negotiation middleware
    app.use((request, response, next) => {
      // Inform the browser that content negotiation is taking place
      response.setHeader('Vary', 'Accept');

      // Enable CORS for all requests
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

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
    app.use(APP_PREFIX + Constants.PROXY_PATH, nc, auth, this.proxyController);

    // Let OAuth handle its own rendering
    app.use(APP_PREFIX + Constants.OAUTH_PATH, nc, OAuthController());

    // Handle static media files before other static content. These must be
    // authenticated.
    app.use(APP_PREFIX + Constants.MEDIA_PATH, nc, auth, express.static(UserProfile.mediaDir));

    // Web app routes - send index.html and fall back to client side URL router
    app.use(`${APP_PREFIX}/*`, RootController());

    // Unauthenticated API routes
    app.use(API_PREFIX + Constants.LOGIN_PATH, nc, LoginController());
    app.use(API_PREFIX + Constants.SETTINGS_PATH, nc, SettingsController());
    app.use(API_PREFIX + Constants.USERS_PATH, nc, UsersController());
    app.use(API_PREFIX + Constants.PING_PATH, nc, PingController());
    if (options.debug) {
      app.use(API_PREFIX + Constants.DEBUG_PATH, nc, DebugController());
    }

    // Authenticated API routes
    app.use(API_PREFIX + Constants.THINGS_PATH, nc, auth,
            require('./controllers/things_controller')());
    app.use(API_PREFIX + Constants.NEW_THINGS_PATH, nc, auth,
            require('./controllers/new_things_controller')());
    app.use(API_PREFIX + Constants.ADAPTERS_PATH, nc, auth, AdaptersController());
    app.use(API_PREFIX + Constants.ACTIONS_PATH, nc, auth,
            require('./controllers/actions_controller')());
    app.use(API_PREFIX + Constants.EVENTS_PATH, nc, auth,
            require('./controllers/events_controller')());
    app.use(API_PREFIX + Constants.LOG_OUT_PATH, nc, auth, LogOutController());
    app.use(API_PREFIX + Constants.UPLOADS_PATH, nc, auth, UploadsController());
    app.use(API_PREFIX + Constants.UPDATES_PATH, nc, auth, UpdatesController());
    app.use(API_PREFIX + Constants.ADDONS_PATH, nc, auth, AddonsController());
    app.use(API_PREFIX + Constants.RULES_PATH, nc, auth,
            require('./controllers/rules_controller').build());
    app.use(API_PREFIX + Constants.INTERNAL_LOGS_PATH, nc, auth, InternalLogsController());
    app.use(API_PREFIX + Constants.PUSH_PATH, nc, auth, PushController());
    app.use(API_PREFIX + Constants.LOGS_PATH, nc, auth, LogsController());
    app.use(API_PREFIX + Constants.NOTIFIERS_PATH, nc, auth, NotifiersController());

    app.use(API_PREFIX + Constants.OAUTH_PATH, nc, OAuthController());
    app.use(API_PREFIX + Constants.OAUTHCLIENTS_PATH, nc, auth, OAuthClientsController());
  }

  addProxyServer(thingId, server) {
    this.proxyController.addProxyServer(thingId, server);
  }

  removeProxyServer(thingId) {
    this.proxyController.removeProxyServer(thingId);
  }
}

module.exports = new Router();
