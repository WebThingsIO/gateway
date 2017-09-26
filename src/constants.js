/*
 * Things Gateway Constants.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const path = require('path');

exports.USERS_PATH = '/users';
exports.THINGS_PATH = '/things';
exports.PROPERTIES_PATH = '/properties';
exports.NEW_THINGS_PATH = '/new_things';
exports.ADAPTERS_PATH = '/adapters';
exports.ACTIONS_PATH = '/actions';
exports.LOGIN_PATH = '/login';
exports.LOG_OUT_PATH = '/log-out';
exports.SETTINGS_PATH = '/settings';
exports.COMMANDS_PATH = '/commands';
exports.UPDATES_PATH = '/updates';
exports.UPLOADS_PATH = '/uploads';
exports.DEBUG_PATH = '/debug';
exports.RULES_PATH = '/rules';
// Remember we end up in the build/* directory so these paths looks slightly
// different than you might expect.
exports.STATIC_PATH = path.join(__dirname, '../static');
exports.VIEWS_PATH = path.join(__dirname, '../src/views');

exports.ADAPTERS_CONFIG = 'adapters';

exports.ACTION_STATUS = 'actionStatus';
exports.ADAPTER_ADDED = 'adapterAdded';
exports.ADD_ADAPTER = 'addAdapter';
exports.ADD_EVENT_SUBSCRIPTION = 'addEventSubscription';
exports.CANCEL_PAIRING = 'cacnelPairing';
exports.CANCEL_REMOVE_THING = 'cancelRemoveThing';
exports.EVENT = 'event';
exports.ERROR = 'error';
exports.HANDLE_DEVICE_ADDED = 'handleDeviceAdded';
exports.HANDLE_DEVICE_REMOVED = 'handleDeviceRemoved';
exports.PAIRING_TIMEOUT = 'pairingTimeout';
exports.PROPERTY_CHANGED = 'propertyChanged';
exports.PROPERTY_STATUS = 'propertyStatus';
exports.REGISTER_ADAPTER = 'registerAdapter';
exports.REGISTER_ADAPTER_REPLY = 'registerAdapterReply';
exports.REMOVE_THING = 'removeThing';
exports.REQUEST_ACTION = 'requestAction';
exports.SET_PROPERTY = 'setProperty';
exports.START_PAIRING = 'startPairing';
exports.THING_ADDED = 'thingAdded';
exports.THING_REMOVED = 'thingRemoved';

