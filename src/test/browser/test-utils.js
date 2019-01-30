const fs = require('fs');
const Constants = require('../../constants');
const {server, chai, mockAdapter} = require('../common');
const {getBrowser} = require('./browser-common');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

let jwt;

beforeEach(async () => {
  const browser = getBrowser();
  jwt = await createUser(server, TEST_USER);
  await browser.url('/');

  const email = await browser.$('#email');
  const password = await browser.$('#password');
  const loginButton = await browser.$('#login-button');

  await email.waitForExist(5000);
  await email.setValue(TEST_USER.email);
  await password.setValue(TEST_USER.password);
  await loginButton.click();
});

module.exports.getAddons = async function() {
  const res = await chai.request(server)
    .get(`${Constants.ADDONS_PATH}`)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt));

  const installedAddons = new Map();
  // Store a map of name->version.
  for (const s of res.body) {
    try {
      const settings = JSON.parse(s.value);
      installedAddons.set(settings.name, settings);
    } catch (err) {
      console.error(`Failed to parse add-on settings: ${err}`);
    }
  }
  return installedAddons;
};


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

module.exports.setProperty = async function(id, property, value) {
  const res = await chai.request(server)
    .put(`${Constants.THINGS_PATH}/${id}/properties/${property}`)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt))
    .send({[property]: value});
  return res.body[property];
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
