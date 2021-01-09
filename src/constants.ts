/*
 * WebThings Gateway Constants.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import path from 'path';

// Web server routes
export const USERS_PATH = '/users';
export const THINGS_PATH = '/things';
export const PROPERTIES_PATH = '/properties';
export const NEW_THINGS_PATH = '/new_things';
export const ADAPTERS_PATH = '/adapters';
export const ADDONS_PATH = '/addons';
export const NOTIFIERS_PATH = '/notifiers';
export const ACTIONS_PATH = '/actions';
export const EVENTS_PATH = '/events';
export const LOGIN_PATH = '/login';
export const LOG_OUT_PATH = '/log-out';
export const SETTINGS_PATH = '/settings';
export const UPDATES_PATH = '/updates';
export const UPLOADS_PATH = '/uploads';
export const MEDIA_PATH = '/media';
export const DEBUG_PATH = '/debug';
export const RULES_PATH = '/rules';
export const OAUTH_PATH = '/oauth';
export const OAUTHCLIENTS_PATH = '/authorizations';
export const INTERNAL_LOGS_PATH = '/internal-logs';
export const LOGS_PATH = '/logs';
export const PUSH_PATH = '/push';
export const PING_PATH = '/ping';
export const PROXY_PATH = '/proxy';
export const EXTENSIONS_PATH = '/extensions';
// Remember we end up in the build/* directory so these paths looks slightly
// different than you might expect const
export const STATIC_PATH = path.join(__dirname, '../static');
export const BUILD_STATIC_PATH = path.join(__dirname, '../build/static');
export const VIEWS_PATH = path.join(__dirname, '../build/views');

// Plugin and REST/websocket API things
export const ACTION_STATUS = 'actionStatus';
export const ADAPTER_ADDED = 'adapterAdded';
export const ADD_EVENT_SUBSCRIPTION = 'addEventSubscription';
export const API_HANDLER_ADDED = 'apiHandlerAdded';
export const CONNECTED = 'connected';
export const ERROR = 'error';
export const EVENT = 'event';
export const MODIFIED = 'modified';
export const NOTIFIER_ADDED = 'notifierAdded';
export const OUTLET_ADDED = 'outletAdded';
export const OUTLET_REMOVED = 'outletRemoved';
export const PAIRING_TIMEOUT = 'pairingTimeout';
export const PROPERTY_CHANGED = 'propertyChanged';
export const PROPERTY_STATUS = 'propertyStatus';
export const REMOVED = 'removed';
export const REQUEST_ACTION = 'requestAction';
export const SET_PROPERTY = 'setProperty';
export const THING_ADDED = 'thingAdded';
export const THING_MODIFIED = 'thingModified';
export const THING_REMOVED = 'thingRemoved';

// OAuth things
export const ACCESS_TOKEN = 'access_token';
export const AUTHORIZATION_CODE = 'authorization_code';
export const USER_TOKEN = 'user_token';
export const READWRITE = 'readwrite';
export const READ = 'read';

// Logging
export enum LogSeverity {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
  PROMPT = 4,
}

export const UNLOAD_PLUGIN_KILL_DELAY = 3000;
export const DEVICE_REMOVAL_TIMEOUT = 30000;
