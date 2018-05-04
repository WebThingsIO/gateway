const webdriverio = require('webdriverio');
const {server} = require('../common');
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

const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
let child;
let browser;
beforeAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
  // Starting up and interacting with a browser takes forever
  await new Promise((res, rej) => {
    selenium.install(function(err) {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
  child = await new Promise((res, rej) => {
    selenium.start(function(err, child) {
      if (err) {
        rej(err);
      } else {
        res(child);
      }
    });
  });
  options.baseUrl = `https://localhost:${server.address().port}`;
  browser = webdriverio
    .remote(options)
    .init();
  // We should wait connecting sessions in order to call webdriverio functions.
  await browser.sessions();
});

afterAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  await browser.end();
  child.stdin.pause();
  child.kill();
});

const getBrowser = function() {
  return browser;
};
module.exports = {getBrowser, server};
