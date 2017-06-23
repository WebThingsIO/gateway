/*
 * MozIoT Gateway common test setup.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* globals expect */

process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const Database = require('../db');
const Actions = require('../models/actions');
const e2p = require('event-to-promise');

const chai = require('./chai');
global.chai = chai;

expect.extend({
  assert(value, message = 'expected condition to be truthy') {
    const pass = !!value;
    return {
      pass,
      message,
    };
  }
});

let {server, app} = require('../app');
global.server = server;
global.app = app;

var adapterManager = require('../adapter-manager');

function mockAdapter() {
  var adapter = adapterManager.getAdapter('Mock');
  expect(adapter).not.toBeUndefined();
  return adapter;
}
global.mockAdapter = mockAdapter;

afterEach(async () => {
  // This is all potentially brittle.
  const adapter = adapterManager.getAdapter('Mock');
  if (adapter) {
    adapter.clearState();
  }
  Actions.clearState();
  await Database.deleteEverything();
});

afterAll(async () => {
  server.close();
  await e2p(server, 'close');
});

module.exports = {
  mockAdapter, server, chai,
};
