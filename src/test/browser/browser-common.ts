import {remote, BrowserObject} from 'webdriverio';
import * as selenium from 'selenium-standalone';

import {server} from '../common';
import {compareImage} from './compare-images';

import fs from 'fs';
import path from 'path';
import {ChildProcess} from 'child_process';

const TEST_OUTPUT_FOLDER = path.join(__dirname, '../../../browser-test-output');
const SCREEN_SHOTS_FOLDER = path.join(__dirname, '../../../browser-test-screenshots');
const DIFF_IMAGES_FOLDER = path.join(__dirname, '../../../browser-test-diff');
const compareImageDisabled = !fs.existsSync(SCREEN_SHOTS_FOLDER);

const options: Record<string, unknown> = {
  logLevel: 'warn',
  capabilities: {
    browserName: 'chrome',
    acceptInsecureCerts: true,
    'goog:chromeOptions': {
      args: ['--headless', '--disable-gpu'],
    },
  },
  /*
  {
    browserName: 'firefox',
    acceptInsecureCerts: true,
    'moz:firefoxOptions': {
      args: ['-headless'],
    },
  },
  */
};

const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
let child: ChildProcess|null = null;
let browser: BrowserObject|null = null;
beforeAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
  // Starting up and interacting with a browser takes forever
  await new Promise<void>((res, rej) => {
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

  await browser.setWindowSize(1280, 800);
});

afterAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;

  if (browser) {
    await (browser as any).deleteSession();
  }

  if (child) {
    child.kill();
  }
});

export function getBrowser(): BrowserObject {
  return browser!;
}

let stepName = '';
let stepNumber = 0;
let screenShots: string[] = [];

(jasmine as any).getEnv().addReporter({
  specStarted: (result: any) => {
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
    pendingMessage +=
      `\n\n  1. Check screenshots in ${TEST_OUTPUT_FOLDER} and ${DIFF_IMAGES_FOLDER}`;
    pendingMessage +=
      `\n  2. Copy correct screenshots from ${TEST_OUTPUT_FOLDER} to ${SCREEN_SHOTS_FOLDER}`;
    pending(pendingMessage);
  }
});

export async function saveStepScreen(stepStr: string): Promise<void> {
  if (typeof stepStr !== 'string') {
    stepStr = (stepNumber++).toString();
    if (stepStr.length < 2) {
      stepStr = `0${stepStr}`;
    }
  }

  if (!fs.existsSync(TEST_OUTPUT_FOLDER)) {
    fs.mkdirSync(TEST_OUTPUT_FOLDER);
  }

  // wait a bit for browser render
  await browser!.pause(200);

  const output = `${stepName}-${stepStr}.png`;
  await browser!.saveScreenshot(path.join(TEST_OUTPUT_FOLDER, output));
  screenShots.push(output);
}

export {server} from '../common';
