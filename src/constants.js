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
// Remember we end up in the build/* directory so this path looks slightly
// different than you might expect.
exports.STATIC_PATH = path.join(__dirname, '../static');
exports.DEBUG_PATH = '/debug';
exports.SETTINGS_PATH = '/settings';

exports.SET_PROPERTY = 'setProperty';
exports.REQUEST_ACTION = 'requestAction';
exports.ADD_EVENT_SUBSCRIPTION = 'addEventSubscription';
exports.PROPERTY_STATUS = 'propertyStatus';
exports.ACTION_STATUS = 'actionStatus';
exports.EVENT = 'event';
