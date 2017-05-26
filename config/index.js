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
exports.PROPERTIES_PATH = '/properties';
exports.NEW_THINGS_PATH = '/new_things';
exports.ADAPTERS_PATH = '/adapters';
exports.ACTIONS_PATH = '/actions';
exports.STATIC_PATH = 'static';
exports.DEBUG_PATH = '/debug';

// We only checkin the NAME-example.js files into source code control. If the real
// config file doesn't exist, then we fallback to the name-example one.
function loadConfig(name) {
  if (fs.existsSync('./config/' + name + '.js')) {
    console.log('Loading config for', name);
    return require('./' + name);
  }
  console.log('Loading example config for', name);
  return require('./' + name + '-example');
}

exports.adapters = loadConfig('adapter-config');
exports.adapterManager = loadConfig('adapter-manager-config');
exports.gpio = loadConfig('gpio-config');
