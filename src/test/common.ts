/*
 * WebThings Gateway common test setup.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

process.env.NODE_ENV = 'test';

import Database from '../db';
import Actions from '../models/actions';
import Events from '../models/events';
import Logs from '../models/logs';
import Things from '../models/things';
import UserProfile from '../user-profile';
import e2p from 'event-to-promise';
import fs from 'fs';
import path from 'path';
import _chai from './chai';
import {MockAdapter} from '../addons-test/mock-adapter/index';
import https from 'https';

interface TestGlobals {
  chai: Chai.ChaiStatic;
  server: https.Server;
  mockAdapter: () => MockAdapter;
}

export const chai = _chai;
(<NodeJS.Global & typeof globalThis & TestGlobals>global).chai = chai;

expect.extend({
  assert(value, message = 'expected condition to be truthy') {
    const pass = !!value;
    return {
      pass,
      message,
    };
  },
});

import {servers, serverStartup} from '../app';
(<NodeJS.Global & typeof globalThis & TestGlobals>global).server = servers.https!;

import addonManager from '../addon-manager';

export function mockAdapter(): MockAdapter {
  const adapter = addonManager.getAdapter('mock-adapter');
  expect(adapter).not.toBeUndefined();
  return <MockAdapter><unknown>adapter!;
}
(<NodeJS.Global & typeof globalThis & TestGlobals>global).mockAdapter = mockAdapter;

function removeTestManifest(): void {
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
  removeTestManifest();

  // The server may not be done with reading tunneltoken and related settings
  await serverStartup.promise;
  console.log(servers.http.address(), servers.https!.address());

  // If the mock adapter is a plugin, then it may not be available
  // immediately, so wait for it to be available.
  await addonManager.waitForAdapter('mock-adapter');
});

afterEach(async () => {
  // This is all potentially brittle.
  const adapter = addonManager.getAdapter('mock-adapter');
  if (adapter) {
    await (<MockAdapter><unknown>adapter!).clearState();
  }
  Actions.clearState();
  Events.clearState();
  Things.clearState();
  await Database.deleteEverything();
});

afterAll(async () => {
  Logs.close();
  await addonManager.unloadAddons();

  if (servers.https) {
    servers.https.close();
    await e2p(servers.https, 'close');
  }

  servers.http.close();
  await e2p(servers.http, 'close');

  removeTestManifest();
});

// Some tests take really long if Travis is having a bad day
jest.setTimeout(60000);

export const server = servers.https!;
export const httpServer = servers.http;
