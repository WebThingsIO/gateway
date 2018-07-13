const {Page, Section} = require('./elements');

class DiscoveredAddonSection extends Section {
  constructor(browser, rootElement) {
    super(browser, rootElement);
    this.defineElement('addButton', '.addon-discovery-settings-add');
    this.defineElement('added', '.addon-discovery-settings-added');
    this.defineElement('name', '.addon-settings-name');
  }

  async getName() {
    const element = await this.name();
    const data = await this.browser.elementIdText(
      element.value ? element.value.ELEMENT : element.ELEMENT
    );
    return data.value;
  }

  async add() {
    await this.waitForAddButton();

    const element = await this.addButton();
    await this.browser.elementIdClick(
      element.value ? element.value.ELEMENT : element.ELEMENT
    );
  }
}

class AddonDiscoverPage extends Page {
  constructor(browser, url) {
    super(browser, url);
    this.defineSections('addons',
                        '.discovered-addon-item',
                        DiscoveredAddonSection);
    this.defineElement('backButton', '#settings-back-button');
  }

  async findAddon(name) {
    const addons = await this.addons();
    for (const addon of addons) {
      const addonName = await addon.getName();
      if (addonName === name) {
        return addon;
      }
    }
    return null;
  }

  async back() {
    if (!await this.hasBackButton()) {
      return null;
    }
    const backButton = await this.backButton();
    const href = this.browser.elementIdAttribute(
      backButton.value ? backButton.value.ELEMENT : backButton.ELEMENT,
      'href'
    );

    await this.browser.elementIdClick(
      backButton.value ? backButton.value.ELEMENT : backButton.ELEMENT
    );

    // circular dependency
    const AddonSettingsPage = require('./addon-settings-page');

    return new AddonSettingsPage(this.browser, href.value);
  }
}

module.exports = AddonDiscoverPage;


