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

function padLeft(str, len) {
  return (repeatChar(' ', len) + str).slice(-len);
}
utils.padLeft = padLeft;

function padRight(str, len) {
  return (str + repeatChar(' ', len)).slice(0, len);
}
utils.padRight = padRight;

function hexStr(num, len) {
  return (repeatChar('0', len) + num.toString(16)).slice(-len);
}
utils.hexStr = hexStr;

