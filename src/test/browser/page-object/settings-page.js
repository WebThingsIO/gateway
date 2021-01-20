const {Page, Section} = require('./elements');
const AddonSettingsPage = require('./addon-settings-page');

class SettingSection extends Section {
  constructor(browser, rootElement) {
    super(browser, rootElement);
    this.defineElement('link', 'a');
  }

  async openSettingsPage() {
    const el = this.rootElement;
    const href = await el.getAttribute('href');
    const id = await el.getAttribute('id');
    console.error('trying to open add-on settings page');
    await el.click();
    console.error('opened page');

    switch (id) {
      case 'domain-settings-link':
      case 'user-settings-link':
        return null; // TODO
      case 'addon-settings-link':
        return new AddonSettingsPage(this.browser, href);
      case 'adapter-settings-link':
      case 'update-settings-link':
      case 'authorization-settings-link':
      case 'experiment-settings-link':
      case 'developer-settings-link':
        return null; // TODO
      default:
        return null;
    }
  }
}

class SettingsPage extends Page {
  constructor(browser) {
    super(browser, '/settings');
    this.defineSection('domain', '#domain-settings-link', SettingSection);
    this.defineSection('user', '#user-settings-link', SettingSection);
    this.defineSection('addon', '#addon-settings-link', SettingSection);
    this.defineSection('adapter', '#adapter-settings-link', SettingSection);
    this.defineSection('update', '#update-settings-link', SettingSection);
    this.defineSection('authorization',
                       '#authorization-settings-link',
                       SettingSection);
    this.defineSection('experiment',
                       '#experiment-settings-link',
                       SettingSection);
    this.defineSection('developer', '#developer-settings-link', SettingSection);
  }

  async wait() {
    await this.browser.waitUntil(async () => {
      const menuScrim = await this.browser.$('#menu-scrim.hidden');
      if (!menuScrim || !menuScrim.isExisting()) {
        return false;
      }

      const width = await menuScrim.getCSSProperty('width');
      if (!(width && width.parsed && width.parsed.value === 0)) {
        return false;
      }

      const addonLink = await this.browser.$('#addon-settings-link');
      if (!addonLink || !addonLink.isClickable()) {
        return false;
      }

      return true;
    }, 5000);
  }
}

module.exports = SettingsPage;
