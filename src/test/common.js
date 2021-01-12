/*
 * WebThings Gateway common test setup.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

process.env.NODE_ENV = 'test';

const Database = require('../db').default;
const Logs = require('../models/logs').default;
const UserProfile = require('../user-profile').default;
const e2p = require('event-to-promise');
const fs = require('fs');
const path = require('path');

const chai = require('./chai');
global.chai = chai;

const debugJasmine = true;

console.log(debugJasmine);

if (debugJasmine) {
  // The following debug code can prove to be very useful when
  // trying to debug interactions between the various jest processes
  // which are running the tests.
  jasmine.getEnv().addReporter({
    jasmineStarted: (_suiteInfo) => {
      const process = require('process');
      console.log('=====', process.pid, 'jasmineStarted =====');
    },
    jasmineDone: () => {
      const process = require('process');
      console.log('=====', process.pid, 'jasmineDone =====');
    },
    suiteStarted: (result) => {
      const process = require('process');
      console.log('=====', process.pid, 'suiteStarted',
                  result.description, '=====');
    },
    suiteDone: (result) => {
      const process = require('process');
      console.log('=====', process.pid, 'suiteDone',
                  result.description, '=====');
    },
    specStarted: (result) => {
      const process = require('process');
      console.log('=====', process.pid, 'specStarted',
                  result.description, '=====');
    },
    specDone: (result) => {
      const process = require('process');
      console.log('=====', process.pid, 'specDone',
                  result.description, '=====');
    },
  });

  const origConsole = console.log;
  console.log = function() {
    const pidStr = `${(`     ${process.pid}`).slice(-5)}: `;
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

const {servers, serverStartup, addonManager} = require('../app');
global.server = servers.https;

function mockAdapter() {
  const adapter = addonManager.getAdapter('mock-adapter');
  expect(adapter).not.toBeUndefined();
  return adapter;
}
global.mockAdapter = mockAdapter;

function removeTestManifest() {
  const testManifestJsonFilename =
    path.join(UserProfile.addonsDir, 'test-adapter', 'manifest.json');
  if (fs.existsSync(testManifestJsonFilename)) {
    console.log('Removing', testManifestJsonFilename);
    fs.unlinkSync(testManifestJsonFilename);
  } else {
    console.log('No need to remove', testManifestJsonFilename);
  }
}

beforeAll(async () => {
  console.log('beforeAll');
  removeTestManifest();

  // The server may not be done with reading tunneltoken and related settings
  await serverStartup.promise;
  console.log(servers.http.address(), servers.https.address());

  // If the mock adapter is a plugin, then it may not be available
  // immediately, so wait for it to be available.
  await addonManager.waitForAdapter('mock-adapter');
});

afterEach(async () => {
  console.log('afterEach');
  // This is all potentially brittle.
  const adapter = addonManager.getAdapter('mock-adapter');
  if (adapter) {
    await adapter.clearState();
  }
  addonManager.getActionsCollection().clearState();
  addonManager.getEventsCollection().clearState();
  addonManager.getThingsCollection().clearState();
  await Database.deleteEverything();
});

afterAll(async () => {
  console.log('afterAll');
  Logs.close();
  await addonManager.unloadAddons();
  servers.https.close();
  servers.http.close();
  await Promise.all([
    e2p(servers.https, 'close'),
    e2p(servers.http, 'close'),
  ]);
  removeTestManifest();
});

// Some tests take really long if Travis is having a bad day
jest.setTimeout(60000);

module.exports = {
  mockAdapter,
  server: servers.https,
  chai,
  httpServer: servers.http,
  addonManager,
};
