import { Page, Section } from './elements';
import { ThingDetailPage } from './thing-detail-page';

class ThingSection extends Section {
  constructor(browser: WebdriverIO.Browser, rootElement: WebdriverIO.Element) {
    super(browser, rootElement);
    this.defineElement('title', '.thing-title');
    this.defineElement('detailLink', '.thing-details-link');
    this.defineElement(
      'clickable',
      [
        'webthing-light-capability',
        'webthing-multi-level-switch-capability',
        'webthing-on-off-switch-capability',
        'webthing-smart-plug-capability',
      ].join(',')
    );
  }

  async click(): Promise<void> {
    await this.waitClickable();
    const clickable = await this.clickable();
    await clickable.click();
  }

  async waitClickable(): Promise<void> {
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

  async thingTitle(): Promise<string> {
    const title = await this.title();
    return await title.getText();
  }

  async thingLevelDisplayed(): Promise<string> {
    return await this.browser.execute(`(function () {
      const selector = [
        'webthing-light-capability',
        'webthing-multi-level-sensor-capability',
        'webthing-multi-level-switch-capability',
        'webthing-humidity-sensor-capability',
      ].join(',');
      const container = document.querySelector(selector);
      const label = container.shadowRoot.querySelector('#label,#contents');
      return label.innerText;
    })()`);
  }

  async thingPowerDisplayed(): Promise<string> {
    return await this.browser.execute(`(function () {
      const container = document.querySelector('webthing-smart-plug-capability');
      const label = container.shadowRoot.querySelector('#label');
      return label.innerText;
    })()`);
  }

  async thingColorDisplayed(): Promise<string> {
    // Function represented as string since otherwise mangling breaks it
    const fill = await this.browser.execute(`(function () {
      const container = document.querySelector('webthing-light-capability');
      const icon = container.shadowRoot.querySelector('#icon');
      return icon.style.fill;
    })()`);

    const rgb = `${fill}`.match(/^rgb\((\d+), (\d+), (\d+)\)$/)!;
    const colorStyle = `#${Number(rgb[1]).toString(16)}${Number(rgb[2]).toString(16)}${Number(
      rgb[3]
    ).toString(16)}`;
    return colorStyle;
  }

  async openDetailPage(): Promise<ThingDetailPage | null> {
    await this.waitClickable();
    const hasLink = await this.hasDetailLink();
    if (!hasLink) {
      return null;
    }

    const el = this.rootElement!;
    const href = await el.getAttribute('href');

    const detailLink = await this.detailLink();
    await detailLink.click();

    return new ThingDetailPage(this.browser, href);
  }
}

export class ThingsPage extends Page {
  constructor(browser: WebdriverIO.Browser) {
    super(browser, '/things');
    this.defineSections('things', '.thing', ThingSection);
    this.defineSections(
      'onThings',
      [
        'webthing-binary-sensor-capability',
        'webthing-light-capability',
        'webthing-multi-level-switch-capability',
        'webthing-on-off-switch-capability',
        'webthing-smart-plug-capability',
      ].join(','),
      ThingSection,
      true
    );
    this.defineSections(
      'offThings',
      [
        'webthing-binary-sensor-capability',
        'webthing-light-capability',
        'webthing-multi-level-switch-capability',
        'webthing-on-off-switch-capability',
        'webthing-smart-plug-capability',
      ].join(','),
      ThingSection,
      false
    );
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
