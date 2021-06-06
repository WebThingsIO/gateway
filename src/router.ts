/**
 * Router.
 *
 * Configure web app routes.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import config from 'config';
import compression from 'compression';
import * as Constants from './constants';
import express from 'express';
import * as jwtMiddleware from './jwt-middleware';
import NoCache from 'nocache';
import UserProfile from './user-profile';
import Things from './models/things';
import ActionsController from './controllers/actions_controller';
import AdaptersController from './controllers/adapters_controller';
import AddonsController from './controllers/addons_controller';
import EventsController from './controllers/events_controller';
import ExtensionsController from './controllers/extensions_controller';
import InternalLogsController from './controllers/internal_logs_controller';
import LogOutController from './controllers/log_out_controller';
import LoginController from './controllers/login_controller';
import LogsController from './controllers/logs_controller';
import NewThingsController from './controllers/new_things_controller';
import NotifiersController from './controllers/notifiers_controller';
import OAuthClientsController from './controllers/oauthclients_controller';
import OAuthController from './controllers/oauth_controller';
import PingController from './controllers/ping_controller';
import ProxyController, { WithProxyMethods } from './controllers/proxy_controller';
import PushController from './controllers/push_controller';
import RootController from './controllers/root_controller';
import RulesController from './controllers/rules_controller';
import SettingsController from './controllers/settings_controller';
import ThingsController from './controllers/things_controller';
import GroupsController from './controllers/groups_controller';
import UpdatesController from './controllers/updates_controller';
import UploadsController from './controllers/uploads_controller';
import UsersController from './controllers/users_controller';

const nocache = NoCache();
const auth = jwtMiddleware.middleware();

const API_PREFIX = '/api'; // A pseudo path to use for API requests
const APP_PREFIX = '/app'; // A pseudo path to use for front end requests

/**
 * Router.
 */
class Router {
  private proxyController: express.Router & WithProxyMethods;

  constructor() {
    this.proxyController = ProxyController();

    Things.setRouter(this);
  }

  /**
   * Configure web app routes.
   */
  configure(app: express.Application): void {
    // Compress all responses larger than 1kb
    app.use(compression());

    app.use((request, response, next) => {
      // Enable HSTS
      if (request.protocol === 'https') {
        response.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      }

      // Disable embedding
      response.set(
        'Content-Security-Policy',
        // eslint-disable-next-line @typescript-eslint/quotes
        config.get('oauth.postToken') ? 'frame-ancestors filesystem:' : "frame-ancestors 'none'"
      );

      next();
    });

    // First look for a static file
    const staticHandler = express.static(Constants.BUILD_STATIC_PATH);
    app.use(Constants.UPLOADS_PATH, express.static(UserProfile.uploadsDir));
    app.use(Constants.EXTENSIONS_PATH, nocache, ExtensionsController());
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
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );
      response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

      // If this is a proxy request, skip everything and go straight there.
      if (request.path.startsWith(Constants.PROXY_PATH)) {
        request.url = APP_PREFIX + request.url;
        next();

        // If request won't accept HTML but will accept JSON,
        // or is a WebSocket request, or is multipart/form-data
        // treat it as an API request
      } else if (
        (!request.accepts('html') && request.accepts('json')) ||
        request.headers['content-type'] === 'application/json' ||
        request.get('Upgrade') === 'websocket' ||
        request.is('multipart/form-data') ||
        request.path.startsWith(Constants.ADDONS_PATH) ||
        request.path.startsWith(Constants.INTERNAL_LOGS_PATH)
      ) {
        request.url = API_PREFIX + request.url;
        next();

        // Otherwise treat it as an app request
      } else {
        request.url = APP_PREFIX + request.url;
        next();
      }
    });

    const oauthController = OAuthController();

    // Handle proxied resources
    app.use(APP_PREFIX + Constants.PROXY_PATH, nocache, auth, this.proxyController);

    // Let OAuth handle its own rendering
    app.use(APP_PREFIX + Constants.OAUTH_PATH, nocache, oauthController);

    // Handle static media files before other static content. These must be
    // authenticated.
    app.use(APP_PREFIX + Constants.MEDIA_PATH, nocache, auth, express.static(UserProfile.mediaDir));

    // Web app routes - send index.html and fall back to client side URL router
    app.use(`${APP_PREFIX}/*`, RootController());

    // Unauthenticated API routes
    app.use(API_PREFIX + Constants.LOGIN_PATH, nocache, LoginController());
    app.use(API_PREFIX + Constants.SETTINGS_PATH, nocache, SettingsController());
    app.use(API_PREFIX + Constants.USERS_PATH, nocache, UsersController());
    app.use(API_PREFIX + Constants.PING_PATH, nocache, PingController());

    // Authenticated API routes
    app.use(API_PREFIX + Constants.THINGS_PATH, nocache, auth, ThingsController());
    app.use(API_PREFIX + Constants.NEW_THINGS_PATH, nocache, auth, NewThingsController());
    app.use(API_PREFIX + Constants.GROUPS_PATH, nocache, auth, GroupsController());
    app.use(API_PREFIX + Constants.ADAPTERS_PATH, nocache, auth, AdaptersController());
    app.use(API_PREFIX + Constants.ACTIONS_PATH, nocache, auth, ActionsController());
    app.use(API_PREFIX + Constants.EVENTS_PATH, nocache, auth, EventsController());
    app.use(API_PREFIX + Constants.LOG_OUT_PATH, nocache, auth, LogOutController());
    app.use(API_PREFIX + Constants.UPLOADS_PATH, nocache, auth, UploadsController());
    app.use(API_PREFIX + Constants.UPDATES_PATH, nocache, auth, UpdatesController());
    app.use(API_PREFIX + Constants.ADDONS_PATH, nocache, auth, AddonsController());
    app.use(API_PREFIX + Constants.RULES_PATH, nocache, auth, RulesController.getController());
    app.use(API_PREFIX + Constants.INTERNAL_LOGS_PATH, nocache, auth, InternalLogsController());
    app.use(API_PREFIX + Constants.PUSH_PATH, nocache, auth, PushController());
    app.use(API_PREFIX + Constants.LOGS_PATH, nocache, auth, LogsController());
    app.use(API_PREFIX + Constants.NOTIFIERS_PATH, nocache, auth, NotifiersController());

    app.use(API_PREFIX + Constants.OAUTH_PATH, nocache, oauthController);
    app.use(API_PREFIX + Constants.OAUTHCLIENTS_PATH, nocache, auth, OAuthClientsController());
  }

  addProxyServer(thingId: string, server: string): void {
    this.proxyController.addProxyServer(thingId, server);
  }

  removeProxyServer(thingId: string): void {
    this.proxyController.removeProxyServer(thingId);
  }
}

export default new Router();
