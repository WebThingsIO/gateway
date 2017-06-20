/*
 * MozIoT Gateway Tests.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


'use strict';

/* Tell jshint about globals */
/* globals describe */

require('./common');

// Note that this test must run first to authenticate because tests share state
describe('UsersController', () => {
  require('./integration/users-test');
});

describe('ThingsController', () => {
  require('./integration/things-test');
});
