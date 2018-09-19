/*
 * Things Gateway Constants.
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
exports.ACTIONS_PATH = '/actions';
exports.EVENTS_PATH = '/events';
exports.LOGIN_PATH = '/login';
exports.LOG_OUT_PATH = '/log-out';
exports.SETTINGS_PATH = '/settings';
exports.COMMANDS_PATH = '/commands';
exports.UPDATES_PATH = '/updates';
exports.UPLOADS_PATH = '/uploads';
exports.DEBUG_PATH = '/debug';
exports.RULES_PATH = '/rules';
exports.OAUTH_PATH = '/oauth';
exports.OAUTHCLIENTS_PATH = '/authorizations';
exports.LOGS_PATH = '/logs';
exports.PUSH_PATH = '/push';
exports.PING_PATH = '/ping';
// Remember we end up in the build/* directory so these paths looks slightly
// different than you might expect.
exports.STATIC_PATH = path.join(__dirname, '../static');
exports.BUILD_STATIC_PATH = path.join(__dirname, '../build/static');
exports.VIEWS_PATH = path.join(__dirname, '../build/views');

// Plugin and REST/websocket API things
exports.DONT_RESTART_EXIT_CODE = 100;
exports.UNLOAD_PLUGIN_KILL_DELAY = 3000;
exports.ACTION_STATUS = 'actionStatus';
exports.ADAPTER_ADDED = 'adapterAdded';
exports.ADAPTER_UNLOADED = 'adapterUnloaded';
exports.ADD_ADAPTER = 'addAdapter';
exports.ADD_EVENT_SUBSCRIPTION = 'addEventSubscription';
exports.ADD_MOCK_DEVICE = 'addMockDevice';
exports.CANCEL_PAIRING = 'cancelPairing';
exports.CANCEL_REMOVE_THING = 'cancelRemoveThing';
exports.CLEAR_MOCK_ADAPTER_STATE = 'clearMockAdapterState';
exports.DEBUG_CMD = 'debugCmd';
exports.EVENT = 'event';
exports.ERROR = 'error';
exports.HANDLE_DEVICE_ADDED = 'handleDeviceAdded';
exports.HANDLE_DEVICE_REMOVED = 'handleDeviceRemoved';
exports.MOCK_ADAPTER_STATE_CLEARED = 'mockAdapterStateCleared';
exports.MOCK_DEVICE_ADDED_REMOVED = 'mockDeviceAddedRemoved';
exports.MOCK_DEVICE_ADD_REMOVE_FAILED = 'mockDeviceAddRemoveFailed';
exports.PAIRING_TIMEOUT = 'pairingTimeout';
exports.PAIR_MOCK_DEVICE = 'pairMockDevice';
exports.PLUGIN_ERROR = 'pluginError';
exports.PLUGIN_UNLOADED = 'pluginUnloaded';
exports.PROPERTY_CHANGED = 'propertyChanged';
exports.PROPERTY_STATUS = 'propertyStatus';
exports.REGISTER_PLUGIN = 'registerPlugin';
exports.REGISTER_PLUGIN_REPLY = 'registerPluginReply';
exports.REMOVE_ACTION = 'removeAction';
exports.REMOVE_ACTION_REJECTED = 'removeActionRejected';
exports.REMOVE_ACTION_RESOLVED = 'removeActionResolved';
exports.REMOVE_THING = 'removeThing';
exports.REQUEST_ACTION = 'requestAction';
exports.REQUEST_ACTION_REJECTED = 'requestActionRejected';
exports.REQUEST_ACTION_RESOLVED = 'requestActionResolved';
exports.SET_PIN = 'setPin';
exports.SET_PIN_REJECTED = 'setPinRejected';
exports.SET_PIN_RESOLVED = 'setPinResolved';
exports.SET_PROPERTY = 'setProperty';
exports.START_PAIRING = 'startPairing';
exports.THING_ADDED = 'thingAdded';
exports.THING_REMOVED = 'thingRemoved';
exports.UNLOAD_ADAPTER = 'unloadAdapter';
exports.UNLOAD_PLUGIN = 'unloadPlugin';
exports.UNPAIR_MOCK_DEVICE = 'unpairMockDevice';

// Thing types
exports.THING_TYPE_ON_OFF_SWITCH = 'onOffSwitch';
exports.THING_TYPE_MULTI_LEVEL_SWITCH = 'multiLevelSwitch';
exports.THING_TYPE_BINARY_SENSOR = 'binarySensor';
exports.THING_TYPE_MULTI_LEVEL_SENSOR = 'multiLevelSensor';
exports.THING_TYPE_SMART_PLUG = 'smartPlug';
exports.THING_TYPE_ON_OFF_LIGHT = 'onOffLight';
exports.THING_TYPE_DIMMABLE_LIGHT = 'dimmableLight';
exports.THING_TYPE_ON_OFF_COLOR_LIGHT = 'onOffColorLight';
exports.THING_TYPE_DIMMABLE_COLOR_LIGHT = 'dimmableColorLight';

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
};
