'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai} = require('../common');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const AddonManager = require('../../addon-manager');
const config = require('config');
const Constants = require('../../constants');
const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const path = require('path');
const pFinal = require('../promise-final');

const testManifestFilename = path.join(__dirname, '../..',
                                       config.get('addonManager.path'),
                                       'test-adapter', 'package.json');

const testManifest = {
  name: 'test-adapter',
  files: [
    'index.js',
    'test-adapter.js'
  ],
  moziot: {
    api: {
      min: 1,
      max: 1
    },
    enabled: true,
  },
};

function copyManifest(manifest) {
  // This essentially does a deep copy.
  return JSON.parse(JSON.stringify(manifest));
}

async function loadSettingsAdapterWithManifest(manifest) {
  // If the adapter is already loaded, then unload it.
  if (AddonManager.getAdapter('test-adapter')) {
    await AddonManager.unloadAdapter('test-adapter');
  }
  // Create the package.json file for the test-adapter
  jsonfile.writeFileSync(testManifestFilename, manifest, {spaces: 2});

  try {
    await AddonManager.loadAddon('test-adapter');
  } catch (err) {
    return err;
  }
}

describe('addons', function() {

  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  it('Get the add-on list', async () => {
    try {
      await AddonManager.loadAddon('settings-adapter');
    } catch (_e) {
      console.error(_e);
      // pass intentionally
    }

    const res = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('value');
    expect(JSON.parse(res.body[0].value)).toHaveProperty('name');
    expect(JSON.parse(res.body[0].value)).toHaveProperty('description');
    expect(JSON.parse(res.body[0].value)).toHaveProperty('moziot');
  });

  it('Toggle a non-existent add-on', async () => {
    const err = await pFinal(chai.request(server)
      .put(`${Constants.ADDONS_PATH}/nonexistent-adapter`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({'enabled': true}));

    expect(err.response.status).toEqual(400);
  });

  it('Toggle an add-on', async () => {
    try {
      await AddonManager.loadAddon('settings-adapter');
    } catch (_e) {
      console.error(_e);
      // pass intentionally
    }

    // Toggle on
    console.log('enabling...');
    const res1 = await chai.request(server)
      .put(`${Constants.ADDONS_PATH}/settings-adapter`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({'enabled': true});

    expect(res1.status).toEqual(200);

    // Get status
    const res2 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res2.status).toEqual(200);
    let addonConfig1;
    for (const cfg of res2.body) {
      if (cfg.key.indexOf('settings-adapter') > -1) {
        addonConfig1 = JSON.parse(cfg.value);
        break;
      }
    }

    expect(addonConfig1).toHaveProperty('moziot');
    expect(addonConfig1.moziot.enabled).toBe(true);

    // Toggle off
    console.log('disabling...');
    const res3 = await chai.request(server)
      .put(`${Constants.ADDONS_PATH}/settings-adapter`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({'enabled': false});

    expect(res3.status).toEqual(200);

    // Get status
    const res4 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res4.status).toEqual(200);
    let addonConfig2;
    for (const cfg of res4.body) {
      if (cfg.key.indexOf('settings-adapter') > -1) {
        addonConfig2 = JSON.parse(cfg.value);
        break;
      }
    }

    expect(addonConfig2).toHaveProperty('moziot');
    expect(addonConfig2.moziot.enabled).toBe(false);
  });

  it('Install an invalid add-on', async () => {
    const err = await pFinal(chai.request(server)
      .post(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({name: 'nonexistent-adapter'}));
    expect(err.response.status).toEqual(400);
  });

  it('Install an add-on', async () => {
    const res1 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res1.status).toEqual(200);
    expect(Array.isArray(res1.body)).toBe(true);
    expect(res1.body.length).toEqual(0);

    const res2 = await fetch(config.get('addonManager.listUrl'));
    const list = await res2.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list[0]).toHaveProperty('name');
    expect(list[0]).toHaveProperty('display_name');
    expect(list[0]).toHaveProperty('description');
    expect(list[0]).toHaveProperty('version');
    expect(list[0]).toHaveProperty('url');

    const res3 = await chai.request(server)
      .post(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({name: list[0].name, url: list[0].url});
    expect(res3.status).toEqual(200);

    const res4 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res4.status).toEqual(200);
    expect(Array.isArray(res4.body)).toBe(true);
    expect(res4.body.length).toEqual(1);
    expect(res4.body[0].key.indexOf(list[0].name) > -1).toBe(true);
  });

  it('Uninstall an add-on', async () => {
    try {
      await AddonManager.loadAddon('example-adapter');
    } catch (_e) {
      console.error(_e);
      // pass intentionally
    }

    const res1 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res1.status).toEqual(200);
    expect(Array.isArray(res1.body)).toBe(true);
    expect(res1.body.length).toEqual(1);
    expect(res1.body[0].key.indexOf('example-adapter') > -1).toBe(true);

    const res2 = await chai.request(server)
      .delete(`${Constants.ADDONS_PATH}/example-adapter`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res2.status).toEqual(200);

    const res3 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res3.status).toEqual(200);
    expect(Array.isArray(res3.body)).toBe(true);
    expect(res3.body.length).toEqual(0);
  });

  it('Validate valid package.json loads fine', async () => {
    let err = await loadSettingsAdapterWithManifest(testManifest);
    expect(err).toBeUndefined();
  });

  it('Fail package.json with missing moziot key', async () => {
    let manifest = copyManifest(testManifest);
    delete manifest.moziot;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with non-object moziot', async () => {
    let manifest = copyManifest(testManifest);
    manifest.moziot = 123;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with missing moziot.api key', async () => {
    let manifest = copyManifest(testManifest);
    delete manifest.moziot.api;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with non-object moziot.api key', async () => {
    let manifest = copyManifest(testManifest);
    manifest.moziot.api = 456;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with missing moziot.api.min key', async () => {
    let manifest = copyManifest(testManifest);
    delete manifest.moziot.api.min;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with non-numeric moziot.api.min', async () => {
    let manifest = copyManifest(testManifest);
    manifest.moziot.api.min = 'abc';
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });
});
