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

module.exports.getAddons = async () => {
  const res = await chai.request(server).keepOpen()
    .get(`${Constants.ADDONS_PATH}`)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt));

  const installedAddons = new Map();
  // Store a map of name->version.
  for (const s of res.body) {
    installedAddons.set(s.id, s);
  }
  return installedAddons;
};


module.exports.addThing = async (desc) => {
  const {id} = desc;
  await chai.request(server).keepOpen()
    .post(Constants.THINGS_PATH)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt))
    .send(desc);
  await mockAdapter().addDevice(id, desc);
};

module.exports.getProperty = async (id, property) => {
  const res = await chai.request(server).keepOpen()
    .get(`${Constants.THINGS_PATH}/${id}/properties/${property}`)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt));
  return res.body[property];
};

module.exports.setProperty = async (id, property, value) => {
  const res = await chai.request(server).keepOpen()
    .put(`${Constants.THINGS_PATH}/${id}/properties/${property}`)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt))
    .send({[property]: value});
  return res.body[property];
};

let stepNumber = 0;
module.exports.saveStepScreen = async (step) => {
  let stepStr = (stepNumber++).toString();
  if (stepStr.length < 2) {
    stepStr = `0${stepStr}`;
  }

  if (!fs.existsSync('browser-test-output')) {
    fs.mkdirSync('browser-test-output');
  }
  await getBrowser().saveScreenshot(
    `browser-test-output/${step}-${stepStr}.png`);
};

module.exports.escapeHtmlForIdClass = (text) => {
  if (typeof (text) !== 'string') {
    text = `${text}`;
  }

  text = text.replace(/[^_a-zA-Z0-9-]/g, '_');
  if (/^[0-9-]/.test(text)) {
    text = `_${text}`;
  }

  return text;
};
