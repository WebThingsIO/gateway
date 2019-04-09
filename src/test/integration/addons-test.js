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
const fs = require('fs');
const jsonfile = require('jsonfile');
const path = require('path');
const Platform = require('../../platform');
const pkg = require('../../../package.json');
const UserProfile = require('../../user-profile');
const {URLSearchParams} = require('url');

const testManifestFilename =
  path.join(UserProfile.addonsDir, 'test-adapter', 'package.json');
const sourceLicense = path.join(__dirname, '..', '..', '..', 'LICENSE');
const destLicense =
  path.join(UserProfile.addonsDir, 'settings-adapter', 'LICENSE');

const testManifest = {
  name: 'test-adapter',
  display_name: 'Test',
  version: '0',
  files: [
    'index.js',
    'test-adapter.js',
  ],
  moziot: {
    api: {
      min: 2,
      max: 2,
    },
    enabled: true,
  },
};

const addonParams = new URLSearchParams();
addonParams.set('api', config.get('addonManager.api'));
addonParams.set('arch', Platform.getArchitecture());
addonParams.set('version', pkg.version);
addonParams.set('node', Platform.getNodeVersion());
addonParams.set('python', Platform.getPythonVersions().join(','));
addonParams.set('test', config.get('addonManager.testAddons') ? '1' : '0');

const addonUrl =
  `${config.get('addonManager.listUrl')}?${addonParams.toString()}`;

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

describe('addons', () => {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });
  afterEach(async () => {
    if (fs.existsSync(destLicense)) {
      fs.unlinkSync(destLicense);
    }
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
    const err = await chai.request(server)
      .put(`${Constants.ADDONS_PATH}/nonexistent-adapter`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({enabled: true});

    expect(err.status).toEqual(400);
  });

  it('Toggle an add-on', async () => {
    try {
      await AddonManager.loadAddon('settings-adapter');
    } catch (_e) {
      console.error(_e);
      // pass intentionally
    }

    // Toggle on
    const res1 = await chai.request(server)
      .put(`${Constants.ADDONS_PATH}/settings-adapter`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({enabled: true});

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
    const res3 = await chai.request(server)
      .put(`${Constants.ADDONS_PATH}/settings-adapter`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({enabled: false});

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

  it('Fail to get license for non-existent add-on', async () => {
    const err = await chai.request(server)
      .get(`${Constants.ADDONS_PATH}/fake-adapter/license`)
      .set(...headerAuth(jwt));

    expect(err.status).toEqual(404);
  });

  it('Fail to get non-existent add-on license', async () => {
    try {
      await AddonManager.loadAddon('settings-adapter');
    } catch (_e) {
      console.error(_e);
      // pass intentionally
    }

    const err = await chai.request(server)
      .get(`${Constants.ADDONS_PATH}/settings-adapter/license`)
      .set(...headerAuth(jwt));

    expect(err.status).toEqual(404);
  });

  it('Get add-on license', async () => {
    fs.copyFileSync(sourceLicense, destLicense);

    try {
      await AddonManager.loadAddon('settings-adapter');
    } catch (_e) {
      console.error(_e);
      // pass intentionally
    }

    const res = await chai.request(server)
      .get(`${Constants.ADDONS_PATH}/settings-adapter/license`)
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.text.startsWith('Mozilla Public License')).toBeTruthy();
  });

  it('Install an invalid add-on', async () => {
    const err = await chai.request(server)
      .post(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({name: 'nonexistent-adapter'});
    expect(err.status).toEqual(400);
  });

  it('Install an add-on with an invalid checksum', async () => {
    const res1 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res1.status).toEqual(200);
    expect(Array.isArray(res1.body)).toBe(true);
    expect(res1.body.length).toEqual(0);

    const res2 = await fetch(addonUrl, {headers: {Accept: 'application/json'}});
    const list = await res2.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list[0]).toHaveProperty('name');
    expect(list[0]).toHaveProperty('display_name');
    expect(list[0]).toHaveProperty('description');
    expect(list[0]).toHaveProperty('author');
    expect(list[0]).toHaveProperty('homepage');
    expect(list[0]).toHaveProperty('url');
    expect(list[0]).toHaveProperty('version');
    expect(list[0]).toHaveProperty('checksum');

    const res3 = await chai.request(server)
      .post(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({name: list[0].name,
             url: list[0].url,
             checksum: 'invalid'});
    expect(res3.status).toEqual(400);
  });

  it('Install an add-on', async () => {
    const res1 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res1.status).toEqual(200);
    expect(Array.isArray(res1.body)).toBe(true);
    expect(res1.body.length).toEqual(0);

    const res2 = await fetch(addonUrl, {headers: {Accept: 'application/json'}});
    const list = await res2.json();
    expect(Array.isArray(list)).toBe(true);

    let addon = {};
    for (const entry of list) {
      if (entry.name === 'example-adapter') {
        addon = entry;
        break;
      }
    }

    expect(addon).toHaveProperty('name');
    expect(addon).toHaveProperty('display_name');
    expect(addon).toHaveProperty('description');
    expect(addon).toHaveProperty('author');
    expect(addon).toHaveProperty('homepage');
    expect(addon).toHaveProperty('url');
    expect(addon).toHaveProperty('version');
    expect(addon).toHaveProperty('checksum');

    const res3 = await chai.request(server)
      .post(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({name: addon.name,
             url: addon.url,
             checksum: addon.checksum});
    expect(res3.status).toEqual(200);

    const res4 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res4.status).toEqual(200);
    expect(Array.isArray(res4.body)).toBe(true);
    expect(res4.body.length).toEqual(1);
    expect(res4.body[0].key.indexOf(addon.name) > -1).toBe(true);
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
    const err = await loadSettingsAdapterWithManifest(testManifest);
    expect(err).toBeUndefined();
  });

  it('Fail package.json with missing moziot key', async () => {
    const manifest = copyManifest(testManifest);
    delete manifest.moziot;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with non-object moziot', async () => {
    const manifest = copyManifest(testManifest);
    manifest.moziot = 123;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with missing moziot.api key', async () => {
    const manifest = copyManifest(testManifest);
    delete manifest.moziot.api;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with non-object moziot.api key', async () => {
    const manifest = copyManifest(testManifest);
    manifest.moziot.api = 456;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with missing moziot.api.min key', async () => {
    const manifest = copyManifest(testManifest);
    delete manifest.moziot.api.min;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with non-numeric moziot.api.min', async () => {
    const manifest = copyManifest(testManifest);
    manifest.moziot.api.min = 'abc';
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with missing version', async () => {
    const manifest = copyManifest(testManifest);
    delete manifest.version;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with non-string version', async () => {
    const manifest = copyManifest(testManifest);
    manifest.version = 1;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with missing files array', async () => {
    const manifest = copyManifest(testManifest);
    delete manifest.files;
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });

  it('Fail package.json with empty files array', async () => {
    const manifest = copyManifest(testManifest);
    manifest.files = [];
    expect(await loadSettingsAdapterWithManifest(manifest)).toBeTruthy();
  });
});
