import { getBrowser } from '../browser-common';
import { getAddons } from '../test-utils';
import { SettingsPage } from '../page-object/settings-page';
import { waitForExpect } from '../../expect-utils';
import AddonManager from '../../../addon-manager';
import sleep from '../../../sleep';

afterEach(async () => {
  await AddonManager.uninstallAddon('virtual-things-adapter', true, false);
});

describe('Addon', () => {
  it('should be able to install the virtual-things-adapter', async () => {
    const browser = getBrowser();

    // give the browser a few seconds to finish loading everything before moving on
    await sleep(5000);

    const settingsPage = new SettingsPage(browser);
    await settingsPage.open();
    await settingsPage.wait();

    const addonSettings = await settingsPage.addon();
    const addonSettingsPage1 = await addonSettings.openSettingsPage();
    const addon1 = await addonSettingsPage1.findAddon('Virtual Things');
    expect(addon1).toBeNull();

    const discoverAddonPage = await addonSettingsPage1.openDiscoverAddonPage();
    await waitForExpect(async () => {
      const addon2 = await discoverAddonPage.findAddon('Virtual Things');
      expect(addon2).not.toBeNull();
    }, 10000);

    const addon3 = await discoverAddonPage.findAddon('Virtual Things');
    await addon3.add();
    await browser.waitUntil(
      async () => {
        const addon4 = await discoverAddonPage.findAddon('Virtual Things');
        if (!addon4) {
          return false;
        }

        return await addon4.hasAdded();
      },
      { timeout: 30000 }
    );

    const addonSettingsPage2 = await discoverAddonPage.back();
    await waitForExpect(async () => {
      const addon5 = await addonSettingsPage2.findAddon('Virtual Things');
      expect(addon5).not.toBeNull();
      expect(await addon5.hasDisableButton()).toBeTruthy();
      expect(await addon5.hasRemoveButton()).toBeTruthy();
    });

    const addons = await getAddons();
    expect(addons.has('virtual-things-adapter')).toBeTruthy();
  });
});
