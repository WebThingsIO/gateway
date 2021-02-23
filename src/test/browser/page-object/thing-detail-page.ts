import { Page, Section } from './elements';

class InputPropertySection extends Section {
  async getId(): Promise<string> {
    return `${await this.rootElement!.getProperty('id')}`;
  }
}

class ColorPropertySection extends InputPropertySection {
  async setValue(value: string): Promise<void> {
    await this.browser.execute(`
      const root = document.querySelector('webthing-color-property');
      const input = root.shadowRoot.querySelector('input[type="color"]');
      input.focus();
      input.value = '${value}';
      input.blur();
    `);
  }

  async getValue(): Promise<string> {
    return await this.browser.execute(`(function () {
      const el = document.querySelector('webthing-color-property');
      return el.value;
    })()`);
  }
}

class ColorTemperaturePropertySection extends InputPropertySection {
  async setValue(value: number): Promise<void> {
    await this.browser.execute(`
      const root = document.querySelector('webthing-color-temperature-property');
      const input = root.shadowRoot.querySelector('input[type="number"]');
      input.focus();
      input.value = ${value};
      input.blur();
    `);
  }

  async getValue(): Promise<number> {
    const val = await this.browser.execute(`(function () {
      const el = document.querySelector('webthing-color-temperature-property');
      return el.value;
    })()`);
    return Number(val);
  }
}

class NumericLabelPropertySection extends Section {
  async getDisplayedText(): Promise<string> {
    return await this.browser.execute(`(function () {
      const element = document.querySelector('${this.selector}');
      const contents =
        element.shadowRoot.querySelector('.webthing-numeric-label-property-contents');
      return contents.innerText;
    })()`);
  }
}

class BrightnessPropertySection extends InputPropertySection {
  async setValue(value: number): Promise<void> {
    await this.browser.execute(`
      const root = document.querySelector('webthing-brightness-property');
      const input = root.shadowRoot.querySelector('input[type="range"]');
      input.value = ${value};
      input.dispatchEvent(new Event('change'));
    `);
  }

  async getValue(): Promise<number> {
    const val = await this.browser.execute(`(function () {
      const el = document.querySelector('webthing-brightness-property');
      return el.value;
    })()`);
    return Number(val);
  }
}

class LevelPropertySection extends InputPropertySection {
  async setValue(value: number): Promise<void> {
    await this.browser.execute(`
      const root = document.querySelector('webthing-level-property');
      const input = root.shadowRoot.querySelector('input[type="number"]');
      input.focus();
      input.value = ${value};
      input.blur();
    `);
  }

  async getValue(): Promise<number> {
    const val = await this.browser.execute(`(function () {
      const el = document.querySelector('webthing-level-property');
      return el.value;
    })()`);
    return Number(val);
  }
}

class OnOffPropertySection extends InputPropertySection {
  async click(): Promise<void> {
    await this.waitForClickable();
    await this.browser.execute(`
      const root = document.querySelector('webthing-on-off-property');
      const label = root.shadowRoot.querySelector('label');
      label.click();
    `);
  }

  async waitForClickable(): Promise<void> {
    const element = this.rootElement!;
    await this.browser.waitUntil(
      async () => {
        return await element.isDisplayed();
      },
      { timeout: 5000 }
    );
    await this.browser.waitUntil(
      async () => {
        return await element.isEnabled();
      },
      { timeout: 5000 }
    );
  }

  async getValue(): Promise<boolean> {
    const val = await this.browser.execute(`(function () {
      const el = document.querySelector('webthing-on-off-property');
      return el.value;
    })()`);
    return Boolean(val);
  }
}

class BooleanPropertySection extends InputPropertySection {
  async click(): Promise<void> {
    await this.waitForClickable();
    await this.browser.execute(`
      const root = document.querySelector('webthing-boolean-property');
      const label = root.shadowRoot.querySelector('label');
      label.click();
    `);
  }

  async waitForClickable(): Promise<void> {
    const element = this.rootElement!;
    await this.browser.waitUntil(
      async () => {
        return await element.isDisplayed();
      },
      { timeout: 5000 }
    );
    await this.browser.waitUntil(
      async () => {
        return await element.isEnabled();
      },
      { timeout: 5000 }
    );
  }

  async getValue(): Promise<boolean> {
    const val = await this.browser.execute(`(function () {
      const el = document.querySelector('webthing-boolean-property');
      return el.value;
    })()`);
    return Boolean(val);
  }
}

class StringPropertySection extends InputPropertySection {
  async setValue(value: string): Promise<void> {
    await this.browser.execute(`
      const root = document.querySelector('webthing-string-property');
      const input = root.shadowRoot.querySelector('input[type="text"]');
      input.focus();
      input.value = '${value}';
      input.blur();
    `);
  }

  async getValue(): Promise<string> {
    return await this.browser.execute(`(function () {
      const el = document.querySelector('webthing-string-property');
      return el.value;
    })()`);
  }
}

class NumberPropertySection extends InputPropertySection {
  async setValue(value: number): Promise<void> {
    await this.browser.execute(`
      const root = document.querySelector('webthing-number-property');
      const input = root.shadowRoot.querySelector('input[type="number"]');
      input.focus();
      input.value = ${value};
      input.blur();
    `);
  }

  async getValue(): Promise<number> {
    const val = await this.browser.execute(`(function () {
      const el = document.querySelector('webthing-number-property');
      return el.value;
    })()`);
    return Number(val);
  }
}

export class ThingDetailPage extends Page {
  constructor(browser: WebdriverIO.Browser, url: string) {
    super(browser, url);

    this.defineSection('colorProperty', 'webthing-color-property', ColorPropertySection);

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

    this.defineSection('levelProperty', 'webthing-level-property', LevelPropertySection);

    this.defineSection('onOffProperty', 'webthing-on-off-property', OnOffPropertySection);

    // For SmartPlug
    this.defineSection(
      'powerProperty',
      `webthing-instantaneous-power-property`,
      NumericLabelPropertySection
    );

    this.defineSection('voltageProperty', `webthing-voltage-property`, NumericLabelPropertySection);

    this.defineSection('currentProperty', `webthing-current-property`, NumericLabelPropertySection);

    this.defineSection(
      'frequencyProperty',
      `webthing-frequency-property`,
      NumericLabelPropertySection
    );

    // For UnknownThing
    this.defineSections('booleanProperties', 'webthing-boolean-property', BooleanPropertySection);
    this.defineSections('stringProperties', 'webthing-string-property', StringPropertySection);
    this.defineSections('numberProperties', 'webthing-number-property', NumberPropertySection);

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
