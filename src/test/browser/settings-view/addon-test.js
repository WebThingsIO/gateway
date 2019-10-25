const {getBrowser, saveStepScreen} = require('../browser-common');
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
    await saveStepScreen();

    const addonSettings = await settingsPage.addon();
    const addonSettingsPage1 = await addonSettings.openSettingsPage();
    const addon1 = await addonSettingsPage1.findAddon('Virtual Things');
    expect(addon1).toBeNull();
    await saveStepScreen();

    const discoverAddonPage =
         await addonSettingsPage1.openDiscoverAddonPage();
    await waitForExpect(async () => {
      const addon2 = await discoverAddonPage.findAddon('Virtual Things');
      expect(addon2).not.toBeNull();
    }, 10000);
    await saveStepScreen();

    const addon3 = await discoverAddonPage.findAddon('Virtual Things');
    await addon3.add();
    await browser.waitUntil(async () => {
      const addon4 = await discoverAddonPage.findAddon('Virtual Things');
      if (!addon4) {
        return false;
      }

      return await addon4.hasAdded();
    }, 30000);
    await saveStepScreen();

    const addonSettingsPage2 = await discoverAddonPage.back();
    await waitForExpect(async () => {
      const addon5 = await addonSettingsPage2.findAddon('Virtual Things');
      expect(addon5).not.toBeNull();
      expect(await addon5.hasDisableButton()).toBeTruthy();
      expect(await addon5.hasRemoveButton()).toBeTruthy();
    });
    await saveStepScreen();

    const addons = await getAddons();
    expect(addons.has('virtual-things-adapter')).toBeTruthy();
  });
});
