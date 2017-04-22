/**
 *
 * utils - Some utility functions
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var utils = module.exports = {};

function repeatChar(char, len) {
  return new Array(len + 1).join(char);
}
utils.repeatChar = repeatChar;

utils.padLeft = function(str, len) {
  return (repeatChar(' ', len) + str).slice(-len);
}

utils.padRight = function(str, len) {
  return (str + repeatChar(' ', len)).slice(0, len);
}

