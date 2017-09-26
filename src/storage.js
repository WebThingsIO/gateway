/**
 * Wrapper for node-persist which ensures that this is only
 * one storage object.
 *
 * Manages the getting and setting of settings using node-persist.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const storage = require('node-persist');

var initPromise;

storage.realInit = storage.init;
storage.init = function (options, callback) {
  if (initPromise) {
    // There is already a promise. We create a new promise
    // by chaining a then onto it. Our chaining function
    // doesn't need to actually do anything.
    initPromise = initPromise.then(() => {
      return;
    }).catch(err => {
      console.error('Storage.init failed');
      console.error(err);
    });
  } else {
    initPromise = storage.realInit(options, callback);
  }
  return initPromise;
}

module.exports = storage;
