const {Page, Section} = require('./elements');
const BACKSPACE_UNICODE = '\uE003';
const ENTER_UNICODE = '\uE007';
const ARROW_UP_UNICODE = '\uE013';
const ARROW_DOWN_UNICODE = '\uE015';

class InputPropertySection extends Section {
  constructor(browser, rootElement) {
    super(browser, rootElement);
    this.defineElement('input', 'input');
    this.defineElement('form', 'form');
  }

  async getInputId() {
    const input = await this.input();
    const data = await this.browser.elementIdProperty(
      input.value ? input.value.ELEMENT : input.ELEMENT,
      'id'
    );
    return data.value;
  }

  async getValue() {
    const input = await this.input();
    const data = await this.browser.elementIdProperty(
      input.value ? input.value.ELEMENT : input.ELEMENT,
      'value'
    );
    return data.value;
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
    await this.browser.elementIdValue(
      input.value ? input.value.ELEMENT : input.ELEMENT,
      keys
    );
  }
}

class ColorPropertySection extends InputPropertySection {
}

class ColorTemperaturePropertySection extends InputPropertySection {
}

class LabelPropertySection extends Section {
  async getDisplayedText() {
    const element = this.rootElement;
    const data = await this.browser.elementIdText(
      element.value ? element.value.ELEMENT : element.ELEMENT
    );
    return data.value;
  }
}

class LevelPropertySection extends InputPropertySection {
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
    await this.browser.elementIdValue(
      input.value ? input.value.ELEMENT : input.ELEMENT,
      keys
    );
  }

  async getValue() {
    const stringValue = await super.getValue();
    return Number(stringValue);
  }
}

class OnOffPropertySection extends InputPropertySection {
  async click() {
    await this.waitForClickable();
    const element = this.rootElement;
    await this.browser.elementIdClick(
      element.value ? element.value.ELEMENT : element.ELEMENT
    );
  }

  async waitForClickable() {
    const element = this.rootElement;
    await this.browser.waitUntil(async () => {
      return await this.browser.elementIdDisplayed(
        element.value ? element.value.ELEMENT : element.ELEMENT
      );
    }, 5000);
    await this.browser.waitUntil(async () => {
      return await this.browser.elementIdEnabled(
        element.value ? element.value.ELEMENT : element.ELEMENT
      );
    }, 5000);
  }

  async getValue() {
    const input = await this.input();
    const data = await this.browser.elementIdSelected(
      input.value ? input.value.ELEMENT : input.ELEMENT
    );
    return data.value;
  }
}

class BooleanPropertySection extends InputPropertySection {
  async click() {
    await this.waitForClickable();
    const element = this.rootElement;
    await this.browser.elementIdClick(
      element.value ? element.value.ELEMENT : element.ELEMENT
    );
  }

  async waitForClickable() {
    const element = this.rootElement;
    await this.browser.waitUntil(async () => {
      return await this.browser.elementIdDisplayed(
        element.value ? element.value.ELEMENT : element.ELEMENT
      );
    }, 5000);
    await this.browser.waitUntil(async () => {
      return await this.browser.elementIdEnabled(
        element.value ? element.value.ELEMENT : element.ELEMENT
      );
    }, 5000);
  }

  async getValue() {
    const input = await this.input();
    const data = await this.browser.elementIdSelected(
      input.value ? input.value.ELEMENT : input.ELEMENT
    );
    return data.value;
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
      '.color-light-color',
      ColorPropertySection
    );

    this.defineSection(
      'colorTemperatureProperty',
      '.color-temperature',
      ColorTemperaturePropertySection
    );

    this.defineSection(
      'levelProperty',
      'form.level',
      LevelPropertySection
    );

    this.defineSection(
      'onOffProperty',
      'form.switch',
      OnOffPropertySection
    );

    // For SmartPlug
    this.defineSection(
      'powerProperty',
      `#label-instantaneousPower`,
      LabelPropertySection
    );

    this.defineSection(
      'voltageProperty',
      `#label-voltage`,
      LabelPropertySection
    );

    this.defineSection(
      'currentProperty',
      `#label-current`,
      LabelPropertySection
    );

    this.defineSection(
      'frequencyProperty',
      `#label-frequency`,
      LabelPropertySection
    );

    this.defineSections(
      'labelProperties',
      '.generic-label',
      LabelPropertySection
    );

    // For UnknownThing
    this.defineSections(
      'booleanProperties',
      '.boolean-switch',
      BooleanPropertySection
    );
    this.defineSections(
      'stringProperties',
      '.string-input',
      StringPropertySection
    );
    this.defineSections(
      'numberProperties',
      '.number-input',
      NumberPropertySection
    );

    this.defineElement('offThing', '.thing.off');
  }
}

module.exports = ThingDetailPage;
