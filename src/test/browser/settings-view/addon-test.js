const {getBrowser} = require('../browser-common');
const {getAddons} = require('../test-utils');
const SettingsPage = require('../page-object/settings-page');
const {waitForExpect} = require('../../expect-utils');

const addonManager = require('../../../addon-manager');
afterEach(async () => {
  await addonManager.uninstallAddon('virtual-things-adapter', true, false);
});

describe('Addon', () => {
  it('should be able to install the virtual-things-adapter', async () => {
    const browser = getBrowser();

    const settingsPage = new SettingsPage(browser);
    await settingsPage.open();
    await settingsPage.wait();

    const addonSettings = await settingsPage.addon();
    let addonSettingsPage = await addonSettings.openSettingsPage();
    let addon = await addonSettingsPage.findAddon('Virtual Things');
    expect(addon).toBeNull();

    const discoverAddonPage =
         await addonSettingsPage.openDiscoverAddonPage();
    addon = await discoverAddonPage.findAddon('Virtual Things');
    expect(addon).not.toBeNull();

    await addon.add();
    await browser.waitUntil(async () => {
      addon = await discoverAddonPage.findAddon('Virtual Things');
      return await addon.hasAdded();
    }, 20000);
    addonSettingsPage = await discoverAddonPage.back();
    await waitForExpect(async () => {
      addon = await addonSettingsPage.findAddon('Virtual Things');
      expect(addon).not.toBeNull();
    });
    expect(await addon.hasDisableButton()).toBeTruthy();
    expect(await addon.hasRemoveButton()).toBeTruthy();

    const addons = await getAddons();
    expect(addons.has('virtual-things-adapter')).toBeTruthy();
  });
});
