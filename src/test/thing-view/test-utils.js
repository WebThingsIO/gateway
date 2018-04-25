const STATIC_JS_PATH = '../../../static/js';

const Constants = require('../../constants');
const {server, chai, mockAdapter} = require('../common');
const {headerAuth} = require('../user');

const UnknownThing = require(`${STATIC_JS_PATH}/unknown-thing`);
const OnOffSwitch = require(`${STATIC_JS_PATH}//on-off-switch`);
const BinarySensor = require(`${STATIC_JS_PATH}/binary-sensor`);
const ColorLight = require(`${STATIC_JS_PATH}/color-light`);
const DimmableLight = require(`${STATIC_JS_PATH}/dimmable-light`);
const DimmableColorLight = require(`${STATIC_JS_PATH}/dimmable-color-light`);
const OnOffLight = require(`${STATIC_JS_PATH}/on-off-light`);
const MultiLevelSwitch = require(`${STATIC_JS_PATH}/multi-level-switch`);
const MultiLevelSensor = require(`${STATIC_JS_PATH}/multi-level-sensor`);
const SmartPlug = require(`${STATIC_JS_PATH}/smart-plug`);

beforeEach(() => {
  const element = document.createElement('div');
  element.id = 'things';
  document.body.appendChild(element);
});

afterEach(() => {
  document.body.innerHTML = '';
});

module.exports.fireEvent = function(element, event) {
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent(event, true, true);
  return !element.dispatchEvent(evt);
};

module.exports.sleep = function(ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
};

module.exports.addThing = async function(desc, format) {
  const {id} = desc;
  const jwt = global.localStorage.getItem('jwt');
  await chai.request(server)
    .post(Constants.THINGS_PATH)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt))
    .send(desc);
  await mockAdapter().addDevice(id, desc);

  const res = await chai.request(server)
    .get(`${Constants.THINGS_PATH}/${id}`)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt));

  desc = res.body;
  let thing;
  switch (desc.type) {
    case 'onOffSwitch':
      thing = new OnOffSwitch(desc, format);
      break;
    case 'onOffLight':
      thing = new OnOffLight(desc, format);
      break;
    case 'onOffColorLight':
      thing = new ColorLight(desc, format);
      break;
    case 'dimmableLight':
      thing = new DimmableLight(desc, format);
      break;
    case 'dimmableColorLight':
      thing = new DimmableColorLight(desc, format);
      break;
    case 'binarySensor':
      thing = new BinarySensor(desc, format);
      break;
    case 'multiLevelSensor':
      thing = new MultiLevelSensor(desc, format);
      break;
    case 'multiLevelSwitch':
      thing = new MultiLevelSwitch(desc, format);
      break;
    case 'smartPlug':
      thing = new SmartPlug(desc, format);
      break;
    default:
      thing = new UnknownThing(desc, format);
      break;
  }
  return thing;
};
