/*
 * Things Gateway common test setup.
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
const Things = require('../models/things');
const config = require('config');
const e2p = require('event-to-promise');
const fs = require('fs');
const storage = require('node-persist');
const uuid = require('uuid/v4');

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

let {server, httpServer} = require('../app');
global.server = server;

var adapterManager = require('../adapter-manager');

function mockAdapter() {
  var adapter = adapterManager.getAdapter('Mock');
  expect(adapter).not.toBeUndefined();
  return adapter;
}
global.mockAdapter = mockAdapter;

let testId = uuid();
let storageDir = config.get('settings.directory') + '-' + testId;

beforeAll(async () => {
  // Give each test its own settings instance
  await storage.init({
    dir: storageDir,
    continuous: false
  });
  // If the mock adapter is a plugin, then it may not be available
  // immediately, so wait for it to be available.
  await adapterManager.waitForAdapter('Mock');
});

afterEach(async () => {
  // This is all potentially brittle.
  const adapter = adapterManager.getAdapter('Mock');
  if (adapter) {
    adapter.clearState();
  }
  Actions.clearState();
  Things.clearState();
  await Database.deleteEverything();
});

afterAll(async () => {
  server.close();
  httpServer.close();
  await Promise.all([
    e2p(server, 'close'),
    e2p(httpServer, 'close')
  ]);
  await storage.clear();
  fs.rmdirSync(storageDir);
});

module.exports = {
  mockAdapter, server, chai, httpServer,
};
