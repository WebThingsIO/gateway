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
const UserProfile = require('../user-profile');
const e2p = require('event-to-promise');
const fs = require('fs');
const path = require('path');

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
  };
}

expect.extend({
  assert(value, message = 'expected condition to be truthy') {
    const pass = !!value;
    return {
      pass,
      message,
    };
  },
});

let {server, httpServer, serverStartup} = require('../app');
global.server = server;

var addonManager = require('../addon-manager');

function mockAdapter() {
  var adapter = addonManager.getAdapter('mock-adapter');
  expect(adapter).not.toBeUndefined();
  return adapter;
}
global.mockAdapter = mockAdapter;

function removeTestManifest() {
  const testManifestFilename = path.join(UserProfile.addonsDir,
                                         'test-adapter', 'package.json');
  if (fs.existsSync(testManifestFilename)) {
    console.log('Removing', testManifestFilename);
    fs.unlinkSync(testManifestFilename);
  } else {
    console.log('No need to remove', testManifestFilename);
  }
}

beforeAll(async () => {
  removeTestManifest();
  // The server may not be done with reading tunneltoken and related settings
  await serverStartup;

  // If the mock adapter is a plugin, then it may not be available
  // immediately, so wait for it to be available.
  await addonManager.waitForAdapter('mock-adapter');
});

afterEach(async () => {
  // This is all potentially brittle.
  const adapter = addonManager.getAdapter('mock-adapter');
  if (adapter) {
    await adapter.clearState();
  }
  Actions.clearState();
  Things.clearState();
  await Database.deleteEverything();
});

afterAll(async () => {
  await addonManager.unloadAddons();
  server.close();
  httpServer.close();
  await Promise.all([
    e2p(server, 'close'),
    e2p(httpServer, 'close'),
  ]);
  removeTestManifest();
});

module.exports = {
  mockAdapter, server, chai, httpServer,
};
