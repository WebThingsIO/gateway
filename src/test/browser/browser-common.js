const {remote} = require('webdriverio');
const selenium = require('selenium-standalone');

const {server} = require('../common');
const {compareImage} = require('./compare-images');

const fs = require('fs');
const path = require('path');

const TEST_OUTPUT_FOLDER = path.join(__dirname, '../../../browser-test-output');
const SCREEN_SHOTS_FOLDER =
  path.join(__dirname, '../../../browser-test-screenshots');
const DIFF_IMAGES_FOLDER = path.join(__dirname, '../../../browser-test-diff');
const compareImageDisabled = !fs.existsSync(SCREEN_SHOTS_FOLDER);

const options = {
  logLevel: 'warn',
  capabilities: {
    browserName: 'firefox',
    acceptInsecureCerts: true,
    'moz:firefoxOptions': {
      args: ['-headless'],
    },
  },
};

const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
let child;
let browser;
beforeAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
  // Starting up and interacting with a browser takes forever
  await new Promise((res, rej) => {
    selenium.install((err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
  child = await new Promise((res, rej) => {
    selenium.start((err, child) => {
      if (err) {
        rej(err);
      } else {
        res(child);
      }
    });
  });
  options.baseUrl = `https://localhost:${server.address().port}`;
  browser = await remote(options);

  await browser.setWindowRect(null, null, 1280, 800);
});

afterAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  await browser.deleteSession();
  child.stdin.pause();
  child.kill();
});

function getBrowser() {
  return browser;
}

let stepName = '';
let stepNumber = 0;
let screenShots = [];

jasmine.getEnv().addReporter({
  specStarted: (result) => {
    stepName = result.fullName;
    stepNumber = 0;
  },
});

beforeEach(async () => {
  screenShots = [];
});

afterEach(async () => {
  if (compareImageDisabled) {
    return;
  }
  if (!fs.existsSync(DIFF_IMAGES_FOLDER)) {
    fs.mkdirSync(DIFF_IMAGES_FOLDER);
  }

  let pendingMessage = '';

  const promises = screenShots.map((screenShot) => {
    const source = path.join(SCREEN_SHOTS_FOLDER, screenShot);
    const target = path.join(TEST_OUTPUT_FOLDER, screenShot);
    const diff = path.join(DIFF_IMAGES_FOLDER, screenShot);
    if (!fs.existsSync(source)) {
      pendingMessage += `\n  new screenshot: ${screenShot}`;
      return Promise.resolve();
    }
    return compareImage(source, target, diff).then((mismatchedPixels) => {
      if (mismatchedPixels) {
        pendingMessage += `\n  mismatched screenshot: ${screenShot}`;
      }
    });
  });
  await Promise.all(promises);

  if (pendingMessage.length > 0) {
    pendingMessage += `\n\n  1. Check screenshots in ${TEST_OUTPUT_FOLDER} and ${DIFF_IMAGES_FOLDER}`;
    pendingMessage += `\n  2. Copy correct screenshots from ${TEST_OUTPUT_FOLDER} to ${SCREEN_SHOTS_FOLDER}`;
    pending(pendingMessage);
  }
});

async function saveStepScreen(stepStr) {
  if (typeof stepStr !== 'string') {
    stepStr = stepNumber.toString();
    if (stepStr.length < 2) {
      stepStr = `0${stepStr}`;
    }
  }

  if (!fs.existsSync(TEST_OUTPUT_FOLDER)) {
    fs.mkdirSync(TEST_OUTPUT_FOLDER);
  }

  // wait a bit for browser render
  await browser.pause(200);

  const output = `${stepName}-${stepStr}.png`;
  await browser.saveScreenshot(path.join(TEST_OUTPUT_FOLDER, output));
  screenShots.push(output);
  stepNumber += 1;
}

module.exports = {getBrowser, saveStepScreen, server};
