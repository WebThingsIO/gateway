const {Page, Section} = require('./elements');
const ThingDetailPage = require('./thing-detail-page');

class ThingSection extends Section {
  constructor(browser, rootElement) {
    super(browser, rootElement);
    this.defineElement('name', '.thing-name');
    this.defineElement('detailLink', '.thing-details-link');
    this.defineElement('clickable',
                       '.thing-icon,.level-bar-container,.color-light');
    this.defineElement('level', '.level-bar-label,.multi-level-sensor-text');
    this.defineElement('power', '.smart-plug-label');
    this.defineElement('color', '.color-light-icon-path');
  }

  async click() {
    await this.waitClickable();
    const clickable = await this.clickable();
    await this.browser.elementIdClick(
      clickable.value ? clickable.value.ELEMENT : clickable.ELEMENT
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

  async thingLevelDisplayed() {
    const level = await this.level();
    const text = await this.browser.elementIdText(
      level.value ? level.value.ELEMENT : level.ELEMENT
    );
    return text.value;
  }

  async thingPowerDisplayed() {
    const power = await this.power();
    const text = await this.browser.elementIdText(
      power.value ? power.value.ELEMENT : power.ELEMENT
    );
    return text.value;
  }

  async thingColorDisplayed() {
    const color = await this.color();
    const data = await this.browser.elementIdProperty(
      color.value ? color.value.ELEMENT : color.ELEMENT,
      'style'
    );
    const rgb = data.value.fill.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
    const colorStyle = `#${
      Number(rgb[1]).toString(16)}${
      Number(rgb[2]).toString(16)}${
      Number(rgb[3]).toString(16)}`;
    return colorStyle;
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
    this.defineSections('onThings', '.thing.on', ThingSection);
    this.defineSections('offThings', '.thing.off', ThingSection);
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
