const {Page, Section} = require('./elements');

class InputPropertySection extends Section {
  async getId() {
    return await this.rootElement.getProperty('id');
  }
}

class ColorPropertySection extends InputPropertySection {
  async setValue(value) {
    await this.browser.execute(`
      const root = document.querySelector('webthing-color-property');
      const input = root.shadowRoot.querySelector('input[type="color"]');
      input.focus();
      input.value = \`${value}\`;
      input.blur();
    `);
  }

  async getValue() {
    return await this.browser.execute(`
      const el = document.querySelector('webthing-color-property');
      return el.value;
    `);
  }
}

class ColorTemperaturePropertySection extends InputPropertySection {
  async setValue(value) {
    value = Number(value);
    await this.browser.execute(`
      const root = document.querySelector('webthing-color-temperature-property');
      const input = root.shadowRoot.querySelector('input[type="number"]');
      input.focus();
      input.value = ${value};
      input.blur();
    `);
  }

  async getValue() {
    const val = await this.browser.execute(`
      const el = document.querySelector('webthing-color-temperature-property');
      return el.value;
    `);
    return Number(val);
  }
}

class LabelPropertySection extends Section {
  async getDisplayedText() {
    const element = this.rootElement;
    const data = await element.getText();
    return data.split('\n')[0].trim();
  }
}

class BrightnessPropertySection extends InputPropertySection {
  async setValue(value) {
    value = Number(value);
    await this.browser.execute(`
      const root = document.querySelector('webthing-brightness-property');
      const input = root.shadowRoot.querySelector('input[type="range"]');
      input.value = ${value};
      input.dispatchEvent(new Event('change'));
    `);
  }

  async getValue() {
    const val = await this.browser.execute(`
      const el = document.querySelector('webthing-brightness-property');
      return el.value;
    `);
    return Number(val);
  }
}

class LevelPropertySection extends InputPropertySection {
  async setValue(value) {
    value = Number(value);
    await this.browser.execute(`
      const root = document.querySelector('webthing-level-property');
      const input = root.shadowRoot.querySelector('input[type="number"]');
      input.focus();
      input.value = ${value};
      input.blur();
    `);
  }

  async getValue() {
    const val = await this.browser.execute(`
      const el = document.querySelector('webthing-level-property');
      return el.value;
    `);
    return Number(val);
  }
}

class OnOffPropertySection extends InputPropertySection {
  async click() {
    await this.waitForClickable();
    await this.browser.execute(`
      const root = document.querySelector('webthing-on-off-property');
      const label = root.shadowRoot.querySelector('label');
      label.click();
    `);
  }

  async waitForClickable() {
    const element = this.rootElement;
    await this.browser.waitUntil(async () => {
      return await element.isDisplayed();
    }, 5000);
    await this.browser.waitUntil(async () => {
      return await element.isEnabled();
    }, 5000);
  }

  async getValue() {
    return await this.browser.execute(`
      const el = document.querySelector('webthing-on-off-property');
      return el.value;
    `);
  }
}

class BooleanPropertySection extends InputPropertySection {
  async click() {
    await this.waitForClickable();
    await this.browser.execute(`
      const root = document.querySelector('webthing-boolean-property');
      const label = root.shadowRoot.querySelector('label');
      label.click();
    `);
  }

  async waitForClickable() {
    const element = this.rootElement;
    await this.browser.waitUntil(async () => {
      return await element.isDisplayed();
    }, 5000);
    await this.browser.waitUntil(async () => {
      return await element.isEnabled();
    }, 5000);
  }

  async getValue() {
    return await this.browser.execute(`
      const el = document.querySelector('webthing-boolean-property');
      return el.value;
    `);
  }
}

class StringPropertySection extends InputPropertySection {
  async setValue(value) {
    await this.browser.execute(`
      const root = document.querySelector('webthing-string-property');
      const input = root.shadowRoot.querySelector('input[type="text"]');
      input.focus();
      input.value = \`${value}\`;
      input.blur();
    `);
  }

  async getValue() {
    return await this.browser.execute(`
      const el = document.querySelector('webthing-string-property');
      return el.value;
    `);
  }
}

class NumberPropertySection extends InputPropertySection {
  async setValue(value) {
    value = Number(value);
    await this.browser.execute(`
      const root = document.querySelector('webthing-number-property');
      const input = root.shadowRoot.querySelector('input[type="number"]');
      input.focus();
      input.value = ${value};
      input.blur();
    `);
  }

  async getValue() {
    const val = await this.browser.execute(`
      const el = document.querySelector('webthing-number-property');
      return el.value;
    `);
    return Number(val);
  }
}

class ThingDetailPage extends Page {
  constructor(browser, url) {
    super(browser, url);

    this.defineSection(
      'colorProperty',
      'webthing-color-property',
      ColorPropertySection
    );

    this.defineSection(
      'colorTemperatureProperty',
      'webthing-color-temperature-property',
      ColorTemperaturePropertySection
    );

    this.defineSection(
      'brightnessProperty',
      'webthing-brightness-property',
      BrightnessPropertySection
    );

    this.defineSection(
      'levelProperty',
      'webthing-level-property',
      LevelPropertySection
    );

    this.defineSection(
      'onOffProperty',
      'webthing-on-off-property',
      OnOffPropertySection
    );

    // For SmartPlug
    this.defineSection(
      'powerProperty',
      `webthing-instantaneous-power-property`,
      LabelPropertySection
    );

    this.defineSection(
      'voltageProperty',
      `webthing-voltage-property`,
      LabelPropertySection
    );

    this.defineSection(
      'currentProperty',
      `webthing-current-property`,
      LabelPropertySection
    );

    this.defineSection(
      'frequencyProperty',
      `webthing-frequency-property`,
      LabelPropertySection
    );

    this.defineSections(
      'labelProperties',
      'webthing-label-property',
      LabelPropertySection
    );

    // For UnknownThing
    this.defineSections(
      'booleanProperties',
      'webthing-boolean-property',
      BooleanPropertySection
    );
    this.defineSections(
      'stringProperties',
      'webthing-string-property',
      StringPropertySection
    );
    this.defineSections(
      'numberProperties',
      'webthing-number-property',
      NumberPropertySection
    );

    this.defineElement(
      'offThing',
      [
        'webthing-binary-sensor-capability',
        'webthing-light-capability',
        'webthing-multi-level-switch-capability',
        'webthing-on-off-switch-capability',
        'webthing-smart-plug-capability',
      ].join(','),
      false
    );
  }
}

module.exports = ThingDetailPage;
