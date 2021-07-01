import { Page, Section } from './elements';
import { AddonSettingsPage } from './addon-settings-pages';

class SettingSection extends Section {
  constructor(browser: WebdriverIO.Browser, rootElement: WebdriverIO.Element) {
    super(browser, rootElement);
    this.defineElement('link', 'a');
  }

  async openSettingsPage(): Promise<Page | null> {
    const el = this.rootElement!;
    const href = await el.getAttribute('href');
    const id = await el.getAttribute('id');
    await el.waitForClickable();
    await el.click();

    switch (id) {
      case 'addon-settings-link':
        return new AddonSettingsPage(this.browser, href);
      default:
        return null;
    }
  }
}

export class SettingsPage extends Page {
  constructor(browser: WebdriverIO.Browser) {
    super(browser, '/settings');
    this.defineSection('addon', '#addon-settings-link', SettingSection);
  }

  async wait(): Promise<void> {
    await this.browser.waitUntil(
      async () => {
        const menuScrim = await this.browser.$('#menu-scrim.hidden');
        if (!menuScrim || !menuScrim.isExisting()) {
          return false;
        }

        const width = await menuScrim.getCSSProperty('width');
        if (width && width.parsed && width.parsed.value === 0) {
          return true;
        }

        return false;
      },
      { timeout: 5000 }
    );
  }
}
