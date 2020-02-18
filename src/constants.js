/*
 * WebThings Gateway Constants.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const path = require('path');

// Web server routes
exports.USERS_PATH = '/users';
exports.THINGS_PATH = '/things';
exports.PROPERTIES_PATH = '/properties';
exports.NEW_THINGS_PATH = '/new_things';
exports.ADAPTERS_PATH = '/adapters';
exports.ADDONS_PATH = '/addons';
exports.NOTIFIERS_PATH = '/notifiers';
exports.ACTIONS_PATH = '/actions';
exports.EVENTS_PATH = '/events';
exports.LOGIN_PATH = '/login';
exports.LOG_OUT_PATH = '/log-out';
exports.SETTINGS_PATH = '/settings';
exports.UPDATES_PATH = '/updates';
exports.UPLOADS_PATH = '/uploads';
exports.MEDIA_PATH = '/media';
exports.DEBUG_PATH = '/debug';
exports.RULES_PATH = '/rules';
exports.OAUTH_PATH = '/oauth';
exports.OAUTHCLIENTS_PATH = '/authorizations';
exports.INTERNAL_LOGS_PATH = '/internal-logs';
exports.LOGS_PATH = '/logs';
exports.PUSH_PATH = '/push';
exports.PING_PATH = '/ping';
exports.PROXY_PATH = '/proxy';
exports.EXTENSIONS_PATH = '/extensions';
// Remember we end up in the build/* directory so these paths looks slightly
// different than you might expect.
exports.STATIC_PATH = path.join(__dirname, '../static');
exports.BUILD_STATIC_PATH = path.join(__dirname, '../build/static');
exports.VIEWS_PATH = path.join(__dirname, '../build/views');

// Plugin and REST/websocket API things
exports.ACTION_STATUS = 'actionStatus';
exports.ADAPTER_ADDED = 'adapterAdded';
exports.ADD_EVENT_SUBSCRIPTION = 'addEventSubscription';
exports.API_HANDLER_ADDED = 'apiHandlerAdded';
exports.CONNECTED = 'connected';
exports.ERROR = 'error';
exports.EVENT = 'event';
exports.MODIFIED = 'modified';
exports.NOTIFIER_ADDED = 'notifierAdded';
exports.OUTLET_ADDED = 'outletAdded';
exports.OUTLET_REMOVED = 'outletRemoved';
exports.PAIRING_TIMEOUT = 'pairingTimeout';
exports.PROPERTY_CHANGED = 'propertyChanged';
exports.PROPERTY_STATUS = 'propertyStatus';
exports.REMOVED = 'removed';
exports.REQUEST_ACTION = 'requestAction';
exports.SET_PROPERTY = 'setProperty';
exports.THING_ADDED = 'thingAdded';
exports.THING_MODIFIED = 'thingModified';
exports.THING_REMOVED = 'thingRemoved';

// OAuth things
exports.ACCESS_TOKEN = 'access_token';
exports.AUTHORIZATION_CODE = 'authorization_code';
exports.USER_TOKEN = 'user_token';
exports.READWRITE = 'readwrite';
exports.READ = 'read';

// Logging
exports.LogSeverity = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  PROMPT: 4,
};

exports.UNLOAD_PLUGIN_KILL_DELAY = 3000;
exports.DEVICE_REMOVAL_TIMEOUT = 30000;
