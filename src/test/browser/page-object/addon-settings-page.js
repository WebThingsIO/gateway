const {Page, Section} = require('./elements');
const AddonDiscoverPage = require('./addon-discover-page');

class AddonSection extends Section {
  constructor(browser, rootElement) {
    super(browser, rootElement);

    this.defineElement('removeButton', '.addon-settings-remove');
    this.defineElement('enableButton', '.addon-settings-enable');
    this.defineElement('disableButton', '.addon-settings-disable');
    this.defineElement('configButton', '.addon-settings-config');
    this.defineElement('name', '.addon-settings-name');
  }

  async getName() {
    const element = await this.name();
    return await element.getText();
  }

  async enable() {
    await this.waitForEnableButton();

    const element = await this.enableButton();
    await element.click();
  }

  async disable() {
    await this.waitForDisableButton();

    const element = await this.disableButton();
    await element.click();
  }

  async remove() {
    await this.waitForRemoveButton();

    const element = await this.removeButton();
    await element.click();
  }

  async configure() {
    // TODO
  }
}

class AddonSettingsPage extends Page {
  constructor(browser, url) {
    super(browser, url);
    this.defineSections('addons', '.addon-item', AddonSection);
    this.defineElement('discover', '#discover-addons-button');
  }

  async findAddon(name) {
    const addons = await this.addons();
    for (const addon of addons) {
      const addonName = await addon.getName();
      console.error(addonName);
      if (addonName === name) {
        return addon;
      }
    }
    return null;
  }

  async openDiscoverAddonPage() {
    if (!await this.hasDiscover()) {
      return null;
    }
    const discover = await this.discover();
    await discover.click();

    return new AddonDiscoverPage(this.browser, '/settings/addons/discovered');
  }
}

module.exports = AddonSettingsPage;
