const {Page, Section} = require('./elements');
const ThingDetailPage = require('./thing-detail-page');

class ThingSection extends Section {
  constructor(browser, rootElement) {
    super(browser, rootElement);
    this.defineElement('name', '.thing-name');
    this.defineElement('detailLink', '.thing-details-link');
  }

  async click() {
    await this.waitClickable();
    const rootElement = this.rootElement;
    await this.browser.elementIdClick(
      rootElement.value ? rootElement.value.ELEMENT : rootElement.ELEMENT
    );
  }

  async waitClickable() {
    await this.browser.waitUntil(async () => {
      const width = await this.browser
        .getCssProperty('#menu-scrim.hidden', 'width');
      return width && width.parsed && width.parsed.value === 0;
    }, 5000);
  }

  async thingName() {
    const name = await this.name();
    const text = await this.browser.elementIdText(
      name.value ? name.value.ELEMENT : name.ELEMENT
    );
    return text.value;
  }

  async openDetailPage() {
    await this.waitClickable();
    const hasLink = await this.hasDetailLink();
    if (!hasLink) {
      return null;
    }
    const rootElement = this.rootElement;
    const href = this.browser.elementIdAttribute(
      rootElement.value ? rootElement.value.ELEMENT : rootElement.ELEMENT,
      'href'
    );

    const detailLink = await this.detailLink();
    await this.browser.elementIdClick(
      detailLink.value ? detailLink.value.ELEMENT : detailLink.ELEMENT
    );

    return new ThingDetailPage(this.browser, href);
  }
}

class ThingsPage extends Page {
  constructor(browser) {
    super(browser, '/things');
    this.defineSections('things', '.thing', ThingSection);
  }

  async wait() {
    await this.browser.waitUntil(async () => {
      const width = await this.browser
        .getCssProperty('#menu-scrim.hidden', 'width');
      return width && width.parsed && width.parsed.value === 0;
    }, 5000);
  }

  async openAddThingPage() {
    // TODO
  }
}

module.exports = ThingsPage;
