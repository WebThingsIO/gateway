const {Page, Section} = require('./elements');
const BACKSPACE_UNICODE = '\uE003';
const ENTER_UNICODE = '\uE007';
const ARROW_UP_UNICODE = '\uE013';
const ARROW_DOWN_UNICODE = '\uE015';

class InputPropertySection extends Section {
  constructor(browser, rootElement) {
    super(browser, rootElement);
    this.defineElement('input', 'input');
    this.defineElement('label', 'label');
    this.defineElement('form', 'form');
  }

  async getId() {
    return await this.rootElement.getProperty('id');
  }

  async getInputId() {
    const input = await this.input();
    return await input.getProperty('id');
  }

  async getValue() {
    const input = await this.input();
    return await input.getProperty('value');
  }

  async setValue(value) {
    let text = await this.getValue();
    if (typeof text !== 'string') {
      text = text.toString();
    }
    const keys = [];
    for (let i = 0; i < text.length; i++) {
      keys.push(BACKSPACE_UNICODE);
    }
    keys.push(value);
    keys.push(ENTER_UNICODE);
    const input = await this.input();
    await input.setValue(keys.join(''));
  }
}

class ColorPropertySection extends InputPropertySection {
}

class ColorTemperaturePropertySection extends InputPropertySection {
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
    const current = await this.getValue();
    const diff = value - current;
    let key;
    if (diff > 0) {
      key = ARROW_UP_UNICODE;
    } else {
      key = ARROW_DOWN_UNICODE;
    }
    const keys = [];
    const stroke = Math.abs(diff);
    for (let i = 0; i < stroke; i++) {
      keys.push(key);
    }
    const input = await this.input();
    await input.setValue(keys.join(''));
  }

  async getValue() {
    const stringValue = await super.getValue();
    return Number(stringValue);
  }
}

class LevelPropertySection extends InputPropertySection {
  constructor(browser, rootElement) {
    super(browser, rootElement);
    this.defineElement('slider', '#slider-level-6');
  }

  async setValue(value) {
    const current = await this.getValue();
    const diff = value - current;
    let key;
    if (diff > 0) {
      key = ARROW_UP_UNICODE;
    } else {
      key = ARROW_DOWN_UNICODE;
    }
    const keys = [];
    const stroke = Math.abs(diff);
    for (let i = 0; i < stroke; i++) {
      keys.push(key);
    }
    const slider = await this.slider();
    await slider.addValue(keys.join(''));
  }

  async getValue() {
    const slider = await this.slider();
    return Number(await slider.getProperty('value'));
  }
}

class OnOffPropertySection extends InputPropertySection {
  async click() {
    await this.waitForClickable();
    const element = await this.label();
    await element.click();
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
    const input = await this.input();
    return await input.isSelected();
  }
}

class BooleanPropertySection extends InputPropertySection {
  async click() {
    await this.waitForClickable();
    const element = await this.label();
    await element.click();
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
    const input = await this.input();
    return await input.isSelected();
  }
}

class StringPropertySection extends InputPropertySection {
}

class NumberPropertySection extends InputPropertySection {
  async setValue(number) {
    if (typeof number !== 'string') {
      number = number.toString();
    }
    await super.setValue(number);
  }

  async getValue() {
    const stringValue = await super.getValue();
    return Number(stringValue);
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
