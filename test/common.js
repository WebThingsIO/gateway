/*
 * MozIoT Gateway common test setup.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* globals assert */

process.env.NODE_ENV = 'test';

var chai = require('chai');
global.chai = chai;
global.assert = chai.assert;
global.expect = chai.expect;

let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

var server = require('../app');
global.server = server;

var adapterManager = require('../adapter-manager');

function mockAdapter() {
  var adapter = adapterManager.getAdapter('Mock');
  assert.notEqual(adapter, undefined, 'No Mock Adapter found');
  return adapter;
}
global.mockAdapter = mockAdapter;
