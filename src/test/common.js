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
const e2p = require('event-to-promise');

const chai = require('./chai');
global.chai = chai;

const debugJasmine = false;

if (debugJasmine) {
  // The following debug code can prove to be very useful when
  // trying to debug interactions between the various jest processes
  // which are running the tests.
  jasmine.getEnv().addReporter({
    jasmineStarted: function(_suiteInfo) {
      const process = require('process');
      console.log('=====', process.pid, 'jasmineStarted =====');
    },
    jasmineDone: function() {
      const process = require('process');
      console.log('=====', process.pid, 'jasmineDone =====');
    },
    suiteStarted: function(result) {
      const process = require('process');
      console.log('=====', process.pid, 'suiteStarted',
                  result.description, '=====');
    },
    suiteDone: function(result) {
      const process = require('process');
      console.log('=====', process.pid, 'suiteDone',
                  result.description, '=====');
    },
    specStarted: function(result) {
      const process = require('process');
      console.log('=====', process.pid, 'specStarted',
                  result.description, '=====');
    },
    specDone: function(result) {
      const process = require('process');
      console.log('=====', process.pid, 'specDone',
                  result.description, '=====');
    },
  });

  var origConsole = console.log;
  console.log = function() {
    let pidStr = ('     ' + process.pid).slice(-5) + ': ';
    Array.prototype.unshift.call(arguments, pidStr);
    origConsole.apply(this, arguments);
  }
}

expect.extend({
  assert(value, message = 'expected condition to be truthy') {
    const pass = !!value;
    return {
      pass,
      message,
    };
  }
});

let {server, httpServer, serverStartup} = require('../app');
global.server = server;

var adapterManager = require('../adapter-manager');

function mockAdapter() {
  var adapter = adapterManager.getAdapter('Mock');
  expect(adapter).not.toBeUndefined();
  return adapter;
}
global.mockAdapter = mockAdapter;

beforeAll(async () => {
  // The server may not be done with reading tunneltoken and related settings
  await serverStartup;

  // If the mock adapter is a plugin, then it may not be available
  // immediately, so wait for it to be available.
  await adapterManager.waitForAdapter('Mock');
});

afterEach(async () => {
  // This is all potentially brittle.
  const adapter = adapterManager.getAdapter('Mock');
  if (adapter) {
    await adapter.clearState();
  }
  Actions.clearState();
  Things.clearState();
  await Database.deleteEverything();
});

afterAll(async () => {
  await adapterManager.unloadAdapters();
  server.close();
  httpServer.close();
  await Promise.all([
    e2p(server, 'close'),
    e2p(httpServer, 'close')
  ]);
});

module.exports = {
  mockAdapter, server, chai, httpServer,
};
