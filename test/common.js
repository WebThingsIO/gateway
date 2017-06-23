/*
 * MozIoT Gateway common test setup.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* globals assert, expect */

process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const Database = require('../db');
const Actions = require('../models/actions');

const chai = require('./chai');
global.chai = chai;
global.assert = chai.assert;
global.expect = chai.expect;

chai.should();

let {server, app} = require('../app');
global.server = server;
global.app = app;

var adapterManager = require('../adapter-manager');

function mockAdapter() {
  var adapter = adapterManager.getAdapter('Mock');
  assert.notEqual(adapter, undefined, 'No Mock Adapter found');
  return adapter;
}
global.mockAdapter = mockAdapter;

afterEach(async () => {
  // This is all potentially brittle.
  const adapter = adapterManager.getAdapter('Mock');
  adapter.clearState();
  Actions.clearState();
  await Database.deleteEverything();
});

module.exports = {
  mockAdapter, server, chai, assert, expect
};
