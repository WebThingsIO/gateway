/**
 * @module log-timestamps
 *
 * Modifies console.log and friends to prepend a timestamp to log lines.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const FUNCS = ['log', 'info', 'debug', 'error', 'warn'];

function logWithTimestamp(realFunc, args) {
  let currTime = new Date();
  let prefix = currTime.getFullYear() + '-' +
             ('0' + (currTime.getMonth() + 1)).slice(-2) + '-' +
             ('0' + currTime.getDate()).slice(-2) + ' ' +
             ('0' + currTime.getHours()).slice(-2) + ':' +
             ('0' + currTime.getMinutes()).slice(-2) + ':' +
             ('0' + currTime.getSeconds()).slice(-2) + '.' +
             ('00' + currTime.getMilliseconds()).slice(-3) + ' ';

  if (args.length > 0 && typeof(args[0]) === 'string') {
    // This allows console.log('Test %d', 3) to still work properly.
    args[0] = prefix + args[0];
  } else {
    // This covers other cases like: console.log(1);
    Array.prototype.unshift.call(args, prefix);
  }

  // Now call the real logging funtion with modified arguments.
  realFunc.apply(null, args);
}

for (let func of FUNCS) {
  let realFunc = console[func];
  console[func] = function() {
    logWithTimestamp(realFunc, arguments);
  };
}
