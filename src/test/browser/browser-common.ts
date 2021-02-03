import { remote, BrowserObject } from 'webdriverio';
import * as selenium from 'selenium-standalone';
import { server } from '../common';
import { ChildProcess } from 'child_process';
import { AddressInfo } from 'net';

const options: Record<string, unknown> = {
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
let child: ChildProcess | null = null;
let browser: BrowserObject | null = null;
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
  options.baseUrl = `https://localhost:${(<AddressInfo>server.address()!).port}`;
  browser = await remote(options);

  await browser.setWindowSize(1280, 800);
});

afterAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;

  if (browser) {
    await browser.deleteSession();
  }

  if (child) {
    child.kill();
  }
});

export function getBrowser(): BrowserObject {
  return browser!;
}

export { server } from '../common';
