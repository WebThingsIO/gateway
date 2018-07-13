const {Page, Section} = require('./elements');
const AddonSettingsPage = require('./addon-settings-page');

class SettingSection extends Section {
  constructor(browser, rootElement) {
    super(browser, rootElement);
    this.defineElement('link', 'a');
  }

  async openSettingsPage() {
    const element = this.rootElement;
    const href = await this.browser.elementIdAttribute(
      element.value ? element.value.ELEMENT : element.ELEMENT,
      'href'
    );
    const id = await this.browser.elementIdAttribute(
      element.value ? element.value.ELEMENT : element.ELEMENT,
      'id'
    );

    await this.browser.elementIdClick(
      element.value ? element.value.ELEMENT : element.ELEMENT
    );

    switch (id.value) {
      case 'domain-settings-link':
      case 'user-settings-link':
        return null; // TODO
      case 'addon-settings-link':
        return new AddonSettingsPage(this.browser, href.value);
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
      const width = await this.browser
        .getCssProperty('#menu-scrim.hidden', 'width');
      return width && width.parsed && width.parsed.value === 0;
    }, 5000);
  }
}

module.exports = SettingsPage;
