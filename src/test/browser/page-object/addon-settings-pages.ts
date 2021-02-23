import { Page, Section } from './elements';

class AddonSection extends Section {
  constructor(browser: WebdriverIO.Browser, rootElement: WebdriverIO.Element) {
    super(browser, rootElement);

    this.defineElement('removeButton', '.addon-settings-remove');
    this.defineElement('enableButton', '.addon-settings-enable');
    this.defineElement('disableButton', '.addon-settings-disable');
    this.defineElement('configButton', '.addon-settings-config');
    this.defineElement('name', '.addon-settings-name');
  }

  async getName(): Promise<string> {
    const element = await this.name();
    return await element.getText();
  }

  async enable(): Promise<void> {
    await this.waitForEnableButton();

    const element = await this.enableButton();
    await element.click();
  }

  async disable(): Promise<void> {
    await this.waitForDisableButton();

    const element = await this.disableButton();
    await element.click();
  }

  async remove(): Promise<void> {
    await this.waitForRemoveButton();

    const element = await this.removeButton();
    await element.click();
  }
}

export class AddonSettingsPage extends Page {
  constructor(browser: WebdriverIO.Browser, url: string) {
    super(browser, url);
    this.defineSections('addons', '.addon-item', AddonSection);
    this.defineElement('discover', '#discover-addons-button');
  }

  async findAddon(name: string): Promise<AddonSection | null> {
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

  async openDiscoverAddonPage(): Promise<AddonDiscoverPage | null> {
    if (!(await this.hasDiscover())) {
      return null;
    }

    const discover = await this.discover();
    await discover.click();

    return new AddonDiscoverPage(this.browser, '/settings/addons/discovered');
  }
}

class DiscoveredAddonSection extends Section {
  constructor(browser: WebdriverIO.Browser, rootElement: WebdriverIO.Element) {
    super(browser, rootElement);
    this.defineElement('addButton', '.addon-discovery-settings-add');
    this.defineElement('added', '.addon-discovery-settings-added');
    this.defineElement('name', '.addon-settings-name');
  }

  async getName(): Promise<string> {
    const element = await this.name();
    return await element.getText();
  }

  async add(): Promise<void> {
    await this.waitForAddButton();

    const element = await this.addButton();
    await element.click();
  }
}

export class AddonDiscoverPage extends Page {
  constructor(browser: WebdriverIO.Browser, url: string) {
    super(browser, url);
    this.defineSections('addons', '.discovered-addon-item', DiscoveredAddonSection);
    this.defineElement('backButton', '#settings-back-button');
  }

  async findAddon(name: string): Promise<Element | null> {
    const addons = await this.addons();
    for (const addon of addons) {
      const addonName = await addon.getName();
      if (addonName === name) {
        return addon;
      }
    }

    return null;
  }

  async back(): Promise<AddonSettingsPage | null> {
    if (!(await this.hasBackButton())) {
      return null;
    }

    const el = await this.backButton();
    const href = await el.getAttribute('href');

    await el.click();

    return new AddonSettingsPage(this.browser, href);
  }
}
