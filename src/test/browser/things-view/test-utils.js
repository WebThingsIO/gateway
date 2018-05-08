const fs = require('fs');
const Constants = require('../../../constants');
const {server, chai, mockAdapter} = require('../../common');
const {getBrowser} = require('../browser-common');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../../user');

let jwt;

beforeEach(async () => {
  const browser = getBrowser();
  jwt = await createUser(server, TEST_USER);
  await browser.url('/');
  await browser.waitForExist('#email', 5000);
  await browser.setValue('#email', TEST_USER.email);
  await browser.setValue('#password', TEST_USER.password);
  await browser.click('#login-button');
});

module.exports.addThing = async function(desc) {
  const {id} = desc;
  await chai.request(server)
    .post(Constants.THINGS_PATH)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt))
    .send(desc);
  await mockAdapter().addDevice(id, desc);
};

module.exports.getProperty = async function(id, property) {
  const res = await chai.request(server)
    .get(`${Constants.THINGS_PATH}/${id}/properties/${property}`)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt));
  return res.body[property];
};

module.exports.waitForExpect = function(expect) {
  return new Promise((resolve, reject) => {
    let wait = 2500;
    const interval = 500;
    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(() => resolve(), ms));
    };
    const retry = async () => {
      try {
        await expect();
        resolve();
        return;
      } catch (err) {
        wait -= interval;
        if (wait <= 0) {
          reject(err);
          return;
        }
        await sleep(interval);
        retry();
      }
    };
    retry();
  });
};

let stepNumber = 0;
module.exports.saveStepScreen = async function(step) {
  let stepStr = stepNumber.toString();
  if (stepStr.length < 2) {
    stepStr = `0${stepStr}`;
  }

  if (!fs.existsSync('browser-test-output')) {
    fs.mkdirSync('browser-test-output');
  }
  await getBrowser().saveScreenshot(
    `browser-test-output/${step}-${stepStr}.png`);
  stepNumber += 1;
};
