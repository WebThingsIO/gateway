'use strict';

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
const semver = require('semver');
const sleep = require('../../sleep');
const UserProfile = require('../../user-profile');
const {URLSearchParams} = require('url');

const testManifestJsonFilename =
  path.join(UserProfile.addonsDir, 'test-adapter', 'manifest.json');
const sourceLicense = path.join(__dirname, '..', '..', '..', 'LICENSE');
const destLicense =
  path.join(UserProfile.addonsDir, 'settings-adapter', 'LICENSE');

const testManifestJson = {
  author: 'WebThingsIO',
  description: 'An adapter for integration tests',
  gateway_specific_settings: {
    webthings: {
      exec: '{nodeLoader} {path}',
      primary_type: 'adapter',
      strict_min_version: pkg.version,
      strict_max_version: pkg.version,
      enabled: true,
    },
  },
  homepage_url: 'https://github.com/WebThingsIO',
  id: 'test-adapter',
  license: 'MPL-2.0',
  manifest_version: 1,
  name: 'Test',
  version: '0',
};

const addonParams = new URLSearchParams();
addonParams.set('arch', Platform.getArchitecture());
addonParams.set('version', pkg.version);
addonParams.set('node', Platform.getNodeVersion());
addonParams.set('python', Platform.getPythonVersions().join(','));
addonParams.set('test', config.get('addonManager.testAddons') ? '1' : '0');

const addonUrl =
  `${config.get('addonManager.listUrls')[0]}?${addonParams.toString()}`;

function copyManifest(manifest) {
  // This essentially does a deep copy.
  return JSON.parse(JSON.stringify(manifest));
}

async function loadSettingsAdapterWithManifestJson(manifest) {
  // If the adapter is already loaded, then unload it.
  if (AddonManager.getAdapter('test-adapter')) {
    await AddonManager.unloadAdapter('test-adapter');
  }

  // Create the manifest.json file for the test-adapter
  jsonfile.writeFileSync(testManifestJsonFilename, manifest, {spaces: 2});

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
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('description');
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
      if (cfg.id == 'settings-adapter') {
        addonConfig1 = cfg;
        break;
      }
    }

    expect(addonConfig1).toHaveProperty('enabled');
    expect(addonConfig1.enabled).toBe(true);

    // wait a few seconds for the add-on to fully load before toggling again
    await sleep(3000);

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
      if (cfg.id == 'settings-adapter') {
        addonConfig2 = cfg;
        break;
      }
    }

    expect(addonConfig2).toHaveProperty('enabled');
    expect(addonConfig2.enabled).toBe(false);
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
      .send({id: 'nonexistent-adapter'});
    expect(err.status).toEqual(400);
  });

  it('Install an add-on with an invalid checksum', async () => {
    const res1 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res1.status).toEqual(200);
    expect(Array.isArray(res1.body)).toBe(true);
    expect(
      res1.body.filter((a) => a.id === 'example-adapter').length
    ).toEqual(0);

    const res2 = await fetch(addonUrl, {headers: {Accept: 'application/json'}});
    const list = await res2.json();
    expect(Array.isArray(list)).toBe(true);

    const addon = list.find((a) => a.id === 'example-adapter');
    expect(addon).toHaveProperty('id');
    expect(addon).toHaveProperty('name');
    expect(addon).toHaveProperty('description');
    expect(addon).toHaveProperty('author');
    expect(addon).toHaveProperty('homepage_url');
    expect(addon).toHaveProperty('url');
    expect(addon).toHaveProperty('version');
    expect(addon).toHaveProperty('checksum');

    const res3 = await chai.request(server)
      .post(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({id: addon.id,
             url: addon.url,
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
    expect(
      res1.body.filter((a) => a.id === 'example-adapter').length
    ).toEqual(0);

    const res2 = await fetch(addonUrl, {headers: {Accept: 'application/json'}});
    const list = await res2.json();
    expect(Array.isArray(list)).toBe(true);

    const addon = list.find((a) => a.id === 'example-adapter');
    expect(addon).toHaveProperty('id');
    expect(addon).toHaveProperty('name');
    expect(addon).toHaveProperty('description');
    expect(addon).toHaveProperty('author');
    expect(addon).toHaveProperty('homepage_url');
    expect(addon).toHaveProperty('url');
    expect(addon).toHaveProperty('version');
    expect(addon).toHaveProperty('checksum');

    const res3 = await chai.request(server)
      .post(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({id: addon.id,
             url: addon.url,
             checksum: addon.checksum});
    expect(res3.status).toEqual(200);

    const res4 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res4.status).toEqual(200);
    expect(Array.isArray(res4.body)).toBe(true);
    expect(
      res4.body.filter((a) => a.id === 'example-adapter').length
    ).toEqual(1);
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
    expect(
      res1.body.filter((a) => a.id === 'example-adapter').length
    ).toEqual(1);

    const res2 = await chai.request(server)
      .delete(`${Constants.ADDONS_PATH}/example-adapter`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res2.status).toEqual(204);

    const res3 = await chai.request(server)
      .get(Constants.ADDONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res3.status).toEqual(200);
    expect(Array.isArray(res3.body)).toBe(true);
    expect(
      res3.body.filter((a) => a.id === 'example-adapter').length
    ).toEqual(0);
  });

  it('Validate valid manifest.json loads fine', async () => {
    const err = await loadSettingsAdapterWithManifestJson(testManifestJson);
    expect(err).toBeUndefined();
  });

  it('Fail manifest.json with missing author key', async () => {
    const manifest = copyManifest(testManifestJson);
    delete manifest.author;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with missing description key', async () => {
    const manifest = copyManifest(testManifestJson);
    delete manifest.description;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it(
    'Fail manifest.json with missing gateway_specific_settings key',
    async () => {
      const manifest = copyManifest(testManifestJson);
      delete manifest.gateway_specific_settings;
      expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
    }
  );

  it('Fail manifest.json with missing webthings key', async () => {
    const manifest = copyManifest(testManifestJson);
    delete manifest.gateway_specific_settings.webthings;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with missing primary_type key', async () => {
    const manifest = copyManifest(testManifestJson);
    delete manifest.gateway_specific_settings.webthings.primary_type;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with wrong gateway min version', async () => {
    const manifest = copyManifest(testManifestJson);
    manifest.gateway_specific_settings.webthings.strict_min_version =
      semver.inc(pkg.version, 'minor');
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with wrong gateway max version', async () => {
    const manifest = copyManifest(testManifestJson);
    manifest.gateway_specific_settings.webthings.strict_max_version =
      `0.${pkg.version}`;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with missing homepage_url key', async () => {
    const manifest = copyManifest(testManifestJson);
    delete manifest.homepage_url;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with missing id key', async () => {
    const manifest = copyManifest(testManifestJson);
    delete manifest.id;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with missing license key', async () => {
    const manifest = copyManifest(testManifestJson);
    delete manifest.license;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with missing manifest_version key', async () => {
    const manifest = copyManifest(testManifestJson);
    delete manifest.manifest_version;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with incorrect manifest_version key', async () => {
    const manifest = copyManifest(testManifestJson);
    manifest.manifest_version = 0;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with missing name key', async () => {
    const manifest = copyManifest(testManifestJson);
    delete manifest.name;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });

  it('Fail manifest.json with missing version key', async () => {
    const manifest = copyManifest(testManifestJson);
    delete manifest.version;
    expect(await loadSettingsAdapterWithManifestJson(manifest)).toBeTruthy();
  });
});
