/*
 * app-instance.js
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// The way that the jest framework works, it has a pool of
// processes which each run one or more tests. This means that
// there can be multiple process running at the same time.
//
// Furthermore, if one of the processes ends, then it may
// start a new test. This means that the same process may
// run multiple tests, one after the other.
//
// During tests, some portions of the gateway may require
// a unique identifier for each test that is run, and that is
// the purpose of this module.

'use strict';

const process = require('process');

class AppInstance {

  constructor() {
    this.mark();
  }

  get() {
    return `${process.pid}-${this.timestamp}`;
  }

  mark() {
    const t = new Date();
    this.timestamp = (`0${t.getHours()}`).slice(-2) +
                     (`0${t.getMinutes()}`).slice(-2) +
                     (`0${t.getSeconds()}`).slice(-2) +
                     (`00${t.getMilliseconds()}`).slice(-3);
  }
}

module.exports = new AppInstance();
