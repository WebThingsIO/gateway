const {getBrowser} = require('../browser-common');
const {addThing, saveStepScreen} = require('./test-utils');

const STATIC_JS_PATH = '../../../../static/js';
const Utils = require(`${STATIC_JS_PATH}/utils`);


describe('Thing', () => {
  it('should render a thing with spaced property name', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'spacedPropertyThings',
      name: 'battery sensor',
      type: 'thing',
      properties: {
        'spaced number': {
          value: 10,
          type: 'number',
          unit: 'percent',
        },
        'spaced string': {
          value: 'foo',
          type: 'string',
        },
        'spaced boolean': {
          value: true,
          type: 'boolean',
        },
      },
    };
    await addThing(desc);

    await browser.url('/things');
    await saveStepScreen('thing-view');
    await browser.waitForExist('.thing', 5000);
    await saveStepScreen('thing-view');
    // wait fadeout menu-scrim
    await browser.waitUntil(async () => {
      const width = await browser.getCssProperty('#menu-scrim.hidden', 'width');
      return width && width.parsed && width.parsed.value === 0;
    }, 5000);
    await browser.click('.thing-details-link');
    await browser.waitForExist('.thing', 5000);
    await saveStepScreen('thing-view');
    await browser.waitUntil(async () => {
      const value = await browser.getValue(
        `#number-${Utils.escapeHtmlForIdClass('spaced number')}`
      );
      return value == 10;
    }, 5000);
    await browser.waitUntil(async () => {
      const value = await browser.getValue(
        `#string-${Utils.escapeHtmlForIdClass('spaced string')}`
      );
      return value === 'foo';
    }, 5000);
    await browser.waitUntil(async () => {
      const value = await browser.getValue(
        `#checkbox-${Utils.escapeHtmlForIdClass('spaced boolean')}`
      );
      return value === 'on';
    }, 5000);
  });
});
