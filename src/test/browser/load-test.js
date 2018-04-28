const fs = require('fs');

const {getBrowser} = require('./browser-common');
const AddonManager = require('../../addon-manager');

describe('basic browser tests', function() {
  afterEach(async () => {
    try {
      await AddonManager.uninstallAddon('virtual-things-adapter', true, false);
    } catch (e) {
      console.warn('Unable to cleanup virtual-thing-adapter', e);
    }
  });


  it('creates a user', async () => {
    const browser = getBrowser();

    let stepNumber = 0;
    async function saveStepScreen(step) {
      let stepStr = stepNumber.toString();
      if (stepStr.length < 2) {
        stepStr = `0${stepStr}`;
      }

      if (!fs.existsSync('browser-test-output')) {
        fs.mkdirSync('browser-test-output');
      }
      await browser.saveScreenshot(
        `browser-test-output/${stepStr}-${step}.png`);
      stepNumber += 1;
    }

    await browser.url('/');

    await browser.waitForExist('#name', 5000);
    await browser.setValue('#name', 'Test User');
    await browser.setValue('#email', 'test@example.com');
    await browser.setValue('#password', 'rosebud');
    await browser.setValue('#confirm-password', 'rosebud');

    await saveStepScreen('create-user');

    await browser.click('#create-user-button');

    await browser.waitForExist('#menu-button', 5000);

    const newUrl = await browser.getUrl();
    expect(newUrl.endsWith('/things')).toBeTruthy();

    await saveStepScreen('main-screen');

    await browser.click('#menu-button');
    await saveStepScreen('menu-open');

    await browser.click('#settings-menu-item');
    await saveStepScreen('settings');

    // wait fadeout menu-scrim
    await browser.waitUntil(async () => {
      const width = await browser.getCssProperty('#menu-scrim.hidden', 'width');
      return width && width.parsed && width.parsed.value === 0;
    }, 5000);
    await browser.click('#addon-settings-link');
    await saveStepScreen('addon-settings');

    await browser.click('#discover-addons-button');
    await saveStepScreen('discovering-addons');

    await browser.waitForExist('#addon-install-virtual-things-adapter', 5000);
    await browser.click('#addon-install-virtual-things-adapter');
    await browser.waitForExist('.addon-discovery-settings-added', 5000);
    await saveStepScreen('adapter-added');

    await browser.click('#settings-back-button');
    await browser.click('#settings-back-button');
    await browser.click('#menu-button');
    await browser.click('#things-menu-item');

    // wait fadeout menu-scrim
    await browser.waitUntil(async () => {
      const width = await browser.getCssProperty('#menu-scrim.hidden', 'width');
      return width && width.parsed && width.parsed.value === 0;
    }, 5000);
    await browser.waitForVisible('#add-button', 5000);
    await browser.click('#add-button');
    await saveStepScreen('add-things-list');

    await browser.click('#new-thing-virtual-things-2 > .new-thing-save-button');
    await browser.click('#new-thing-virtual-things-9 > .new-thing-save-button');
    await browser.click('#add-thing-back-button');
    await saveStepScreen('things-list');

    let things = (await browser.elements('.thing')).value;
    expect(things.length).toBe(2);
    await browser.elementIdClick(things[0].ELEMENT);
    await saveStepScreen('things-list-dcl-on');

    let link = await browser.elementIdElement(things[0].ELEMENT,
                                              '.thing-details-link');
    await browser.elementIdClick(link.value.ELEMENT);
    let detailUrl = await browser.getUrl();
    expect(detailUrl.endsWith('/things/virtual-things-2')).toBeTruthy();
    await saveStepScreen('dimmable-color-light-detail');

    await browser.click('#back-button');

    await browser.waitForExist('.unknown-thing', 2000);

    things = (await browser.elements('.thing')).value;
    expect(things.length).toBe(2);
    link = await browser.elementIdElement(things[1].ELEMENT,
                                          '.thing-details-link');
    await browser.elementIdClick(link.value.ELEMENT);
    detailUrl = await browser.getUrl();
    expect(detailUrl.endsWith('/things/virtual-things-9')).toBeTruthy();
    await saveStepScreen('unknown-thing-detail');
  });
});
