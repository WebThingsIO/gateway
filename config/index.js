/*
 * MozIoT Gateway Configuration.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var fs = require('fs');

exports.THINGS_PATH = '/things';
exports.NEW_THINGS_PATH = '/new_things';
exports.ADAPTERS_PATH = '/adapters';
exports.ACTIONS_PATH = '/actions';
exports.STATIC_PATH = 'static';
exports.DEBUG_PATH = '/debug';

// We only checkin the NAME-example.js files into source code control. If the real
// config file doesn't exist, then we fallback to the name-example one.
function loadConfig(name) {
  var moduleName = './' + name;
  if (fs.exists(moduleName + '.js')) {
    return require(moduleName);
  }
  return require(moduleName + '-example');
}

exports.adapters = loadConfig('adapter-config');
exports.gpio = loadConfig('gpio-config');
