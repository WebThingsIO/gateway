import {Page, Section} from './elements';
import {AddonSettingsPage} from './addon-settings-pages';
import webdriverio from 'webdriverio';

class SettingSection extends Section {
  constructor(browser: webdriverio.BrowserObject, rootElement: webdriverio.Element) {
    super(browser, rootElement);
    this.defineElement('link', 'a');
  }

  async openSettingsPage(): Promise<Page | null> {
    const el = this.rootElement!;
    const href = await el.getAttribute('href');
    const id = await el.getAttribute('id');
    await el.click();

    switch (id) {
      case 'addon-settings-link':
        return new AddonSettingsPage(this.browser, href);
      case 'domain-settings-link':
      case 'user-settings-link':
      case 'adapter-settings-link':
      case 'update-settings-link':
      case 'authorization-settings-link':
      case 'experiment-settings-link':
      case 'developer-settings-link':
      default:
        return null;
    }
  }
}

export class SettingsPage extends Page {
  constructor(browser: webdriverio.BrowserObject) {
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

  async wait(): Promise<void> {
    await this.browser.waitUntil(async () => {
      const menuScrim = await this.browser.$('#menu-scrim.hidden');
      if (!menuScrim || !menuScrim.isExisting()) {
        return false;
      }

      const width = await menuScrim.getCSSProperty('width');
      if (width && width.parsed && width.parsed.value === 0) {
        return true;
      }

      return false;
    }, 5000);
  }
}
