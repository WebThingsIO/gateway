import { remote, RemoteOptions } from 'webdriverio';
import * as selenium from 'selenium-standalone';
import { server } from '../common';
import { ChildProcess } from 'child_process';
import { AddressInfo } from 'net';

const seleniumOptions = {
  requestOpts: {
    timeout: 240 * 1000,
  },
  drivers: {
    chrome: {},
  },
  ignoreExtraDrivers: true,
};

const webdriverioOptions: RemoteOptions = {
  logLevel: 'warn',
  capabilities: {
    browserName: 'chrome',
    acceptInsecureCerts: true,
    acceptSslCerts: true,
    'goog:chromeOptions': {
      args: ['--headless', '--disable-gpu', '--allow-insecure-localhost', '--disable-web-security'],
    },
  },
};

const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
let child: ChildProcess | null = null;
let browser: WebdriverIO.Browser | null = null;
beforeAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
  // Starting up and interacting with a browser takes forever
  await new Promise<void>((res, rej) => {
    selenium.install(seleniumOptions, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
  child = await new Promise((res, rej) => {
    selenium.start(seleniumOptions, (err, c) => {
      if (err) {
        rej(err);
      } else {
        res(c);
      }
    });
  });
  webdriverioOptions.baseUrl = `https://localhost:${(<AddressInfo>server.address()!).port}`;
  browser = await remote(webdriverioOptions);

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

export function getBrowser(): WebdriverIO.Browser {
  return browser!;
}

export { server } from '../common';
