const fs = require('fs');
const webdriverio = require('webdriverio');

const {server} = require('../common');
const AddonManager = require('../../addon-manager');

const selenium = require('selenium-standalone');

const options = {
  desiredCapabilities: {
    browserName: 'firefox',
    acceptInsecureCerts: true,
    'moz:firefoxOptions': {
      args: ['-headless'],
    },
  },
};

describe('basic browser tests', function() {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeEach(() => {
    // Starting up and interacting with a browser takes forever
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
  });
  afterEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    try {
      await AddonManager.uninstallAddon('virtual-things-adapter', true, false);
    } catch (e) {
      console.warn('Unable to cleanup virtual-thing-adapter', e);
    }
  });


  it('creates a user', async () => {
    const url = `https://localhost:${server.address().port}`;

    await new Promise((res, rej) => {
      selenium.install(function(err) {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });

    const child = await new Promise((res, rej) => {
      selenium.start(function(err, child) {
        if (err) {
          rej(err);
        } else {
          res(child);
        }
      });
    });
    const browser = webdriverio
      .remote(options)
      .init();

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

    await browser.url(url);

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

    await browser.end();
    child.kill();
  });
});
