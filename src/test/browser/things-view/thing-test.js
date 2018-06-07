const {getBrowser} = require('../browser-common');
const {
  addThing,
  getProperty,
  setProperty,
} = require('./test-utils');

const {waitForExpect} = require('../../expect-utils');
const ThingsPage = require('../page-object/things-page');
const util = require('util');

const STATIC_JS_PATH = '../../../../static/js';
const Utils = require(`${STATIC_JS_PATH}/utils`);


describe('Thing', () => {
  it('should render a unknown-thing and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'UnknownThing',
         name: 'foofoo',
         type: 'thing',
         properties: {
           numberProp: {
             value: 10,
             type: 'number',
             unit: 'percent',
           },
           stringProp: {
             value: 'bar',
             type: 'string',
           },
           booleanProp: {
             value: true,
             type: 'boolean',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       thingsPage.open();

       await thingsPage.waitForThings();
       const things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingName = await things[0].thingName();
       expect(thingName).toEqual(desc.name);

       const detailPage = await things[0].openDetailPage();

       // We have to wait connecting websocket.
       await detailPage.waitForBooleanProperties();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check boolean property
       const booleanProps = await detailPage.booleanProperties();
       expect(booleanProps.length).toEqual(1);
       let booleanValue = await booleanProps[0].getValue();
       expect(booleanValue).toBeTruthy();
       await booleanProps[0].click();
       await waitForExpect(async () => {
         booleanValue = await getProperty(desc.id, 'booleanProp');
         expect(booleanValue).not.toBeTruthy();
         booleanValue = await booleanProps[0].getValue();
         expect(booleanValue).not.toBeTruthy();
       });
       await setProperty(desc.id, 'booleanProp', true);
       await waitForExpect(async () => {
         booleanValue = await booleanProps[0].getValue();
         expect(booleanValue).toBeTruthy();
       });

       // Check number property
       const numberProps = await detailPage.numberProperties();
       expect(numberProps.length).toEqual(1);
       let numberValue = await numberProps[0].getValue();
       expect(numberValue).toEqual(10);
       await numberProps[0].setValue(20);
       await waitForExpect(async () => {
         numberValue = await getProperty(desc.id, 'numberProp');
         expect(numberValue).toEqual(20);
         numberValue = await numberProps[0].getValue();
         expect(numberValue).toEqual(20);
       });
       await setProperty(desc.id, 'numberProp', 5);
       await waitForExpect(async () => {
         numberValue = await numberProps[0].getValue();
         expect(numberValue).toEqual(5);
       });

       // Check string property
       const stringProps = await detailPage.stringProperties();
       expect(stringProps.length).toEqual(1);
       let stringValue = await stringProps[0].getValue();
       expect(stringValue).toEqual('bar');
       await stringProps[0].setValue('foo');
       await waitForExpect(async () => {
         stringValue = await getProperty(desc.id, 'stringProp');
         expect(stringValue).toEqual('foo');
         stringValue = await stringProps[0].getValue();
         expect(stringValue).toEqual('foo');
       });
       await setProperty(desc.id, 'stringProp', 'foobar');
       await waitForExpect(async () => {
         stringValue = await stringProps[0].getValue();
         expect(stringValue).toEqual('foobar');
       });
     });

  it('should render a thing with spaced property name', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'spacedPropertyThings',
      name: 'battery sensor',
      type: 'thing',
      properties: {
        'spaced number': {
          value: 10,
          type: 'number',
          unit: 'percent',
        },
        'spaced string': {
          value: 'foo',
          type: 'string',
        },
        'spaced boolean': {
          value: true,
          type: 'boolean',
        },
      },
    };
    await addThing(desc);

    const thingsPage = new ThingsPage(browser);
    thingsPage.open();

    await thingsPage.waitForThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingName = await things[0].thingName();
    expect(thingName).toEqual(desc.name);

    const detailPage = await things[0].openDetailPage();

    await detailPage.waitForBooleanProperties();
    const booleanProps = await detailPage.booleanProperties();
    expect(booleanProps.length).toEqual(1);
    const booleanValue = await booleanProps[0].getValue();
    expect(booleanValue).toBeTruthy();
    const booleanId = await booleanProps[0].getId();
    expect(booleanId).toEqual(
      `boolean-${Utils.escapeHtmlForIdClass('spaced boolean')}`
    );

    const numberProps = await detailPage.numberProperties();
    expect(numberProps.length).toEqual(1);
    const numberValue = await numberProps[0].getValue();
    expect(numberValue).toEqual(10);
    const numberId = await numberProps[0].getId();
    expect(numberId).toEqual(
      `number-${Utils.escapeHtmlForIdClass('spaced number')}`
    );

    const stringProps = await detailPage.stringProperties();
    expect(stringProps.length).toEqual(1);
    const stringValue = await stringProps[0].getValue();
    expect(stringValue).toEqual('foo');
    const stringId = await stringProps[0].getId();
    expect(stringId).toEqual(
      `string-${Utils.escapeHtmlForIdClass('spaced string')}`
    );
  });

  it('should reset property value when setProperty is rejected', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'UnknownThing',
      name: 'foofoo',
      type: 'thing',
      properties: {
        rejectPropertyNum: {
          value: 10,
          type: 'number',
          unit: 'percent',
        },
        rejectPropertyStr: {
          value: 'bar',
          type: 'string',
        },
        rejectPropertyBool: {
          value: true,
          type: 'boolean',
        },
      },
    };
    await addThing(desc);

    const thingsPage = new ThingsPage(browser);
    thingsPage.open();

    await thingsPage.waitForThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingName = await things[0].thingName();
    expect(thingName).toEqual('foofoo');

    const detailPage = await things[0].openDetailPage();

    // We have to wait connecting websocket.
    await detailPage.waitForBooleanProperties();
    const waitWebSocketPromise = util.promisify(setImmediate);
    await waitWebSocketPromise();

    // Check boolean property
    const booleanProps = await detailPage.booleanProperties();
    expect(booleanProps.length).toEqual(1);
    let booleanValue = await booleanProps[0].getValue();
    expect(booleanValue).toBeTruthy();
    await booleanProps[0].click();
    await waitForExpect(async () => {
      booleanValue = await getProperty(desc.id, 'rejectPropertyBool');
      expect(booleanValue).toBeTruthy();
      booleanValue = await booleanProps[0].getValue();
      expect(booleanValue).toBeTruthy();
    });

    // Check number property
    const numberProps = await detailPage.numberProperties();
    expect(numberProps.length).toEqual(1);
    let numberValue = await numberProps[0].getValue();
    expect(numberValue).toEqual(10);
    await numberProps[0].setValue(20);
    await waitForExpect(async () => {
      numberValue = await getProperty(desc.id, 'rejectPropertyNum');
      expect(numberValue).toEqual(10);
      numberValue = await numberProps[0].getValue();
      expect(numberValue).toEqual(10);
    });

    // Check string property
    const stringProps = await detailPage.stringProperties();
    expect(stringProps.length).toEqual(1);
    let stringValue = await stringProps[0].getValue();
    expect(stringValue).toEqual('bar');
    await stringProps[0].setValue('foo');
    await waitForExpect(async () => {
      stringValue = await getProperty(desc.id, 'rejectPropertyStr');
      expect(stringValue).toEqual('bar');
      stringValue = await stringProps[0].getValue();
      expect(stringValue).toEqual('bar');
    });
  });

  it('should render a onOffLight and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'onOffLight',
         name: 'foofoo',
         type: 'onOffLight',
         properties: {
           on: {
             value: false,
             type: 'boolean',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       thingsPage.open();

       await thingsPage.waitForOffThings();
       const things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingName = await things[0].thingName();
       expect(thingName).toEqual(desc.name);

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();

       await setProperty(desc.id, 'on', false);
       await thingsPage.waitForOffThings();

       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();
     });

  it('should render a onOffSwitch and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'onOffSwitch',
         name: 'foofoo',
         type: 'onOffSwitch',
         properties: {
           on: {
             value: false,
             type: 'boolean',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       thingsPage.open();

       await thingsPage.waitForOffThings();
       let things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingName = await things[0].thingName();
       expect(thingName).toEqual(desc.name);

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();

       await setProperty(desc.id, 'on', false);
       await thingsPage.waitForOffThings();

       things = await thingsPage.things();
       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();
     });

  it('should render a dimmableLight and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'dimmableLight',
         name: 'foofoo',
         type: 'dimmableLight',
         properties: {
           on: {
             value: false,
             type: 'boolean',
           },
           level: {
             value: 0,
             type: 'number',
             unit: 'percent',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       thingsPage.open();

       await thingsPage.waitForOffThings();
       let things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingName = await things[0].thingName();
       expect(thingName).toEqual(desc.name);

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();

       await setProperty(desc.id, 'level', 50);
       await waitForExpect(async () => {
         things = await thingsPage.things();
         const level = await things[0].thingLevelDisplayed();
         expect(level).toEqual('50%');
       });

       await setProperty(desc.id, 'on', false);
       await thingsPage.waitForOffThings();

       things = await thingsPage.things();
       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();

       // We have to wait connecting websocket.
       await detailPage.waitForOffThing();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check onOff property
       const onOffProperty = await detailPage.onOffProperty();
       let on = await onOffProperty.getValue();
       expect(on).not.toBeTruthy();
       await onOffProperty.click();
       await waitForExpect(async () => {
         on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
         on = await onOffProperty.getValue();
         expect(on).toBeTruthy();
       });
       await setProperty(desc.id, 'on', false);
       await waitForExpect(async () => {
         on = await onOffProperty.getValue();
         expect(on).not.toBeTruthy();
       });

       // Check level property
       const levelProperty = await detailPage.levelProperty();
       let level = await levelProperty.getValue();
       expect(level).toEqual(50);
       await levelProperty.setValue(20);
       await waitForExpect(async () => {
         level = await getProperty(desc.id, 'level');
         expect(level).toEqual(20);
         level = await levelProperty.getValue();
         expect(level).toEqual(20);
       });
       await setProperty(desc.id, 'level', 60);
       await waitForExpect(async () => {
         level = await levelProperty.getValue();
         expect(level).toEqual(60);
       });
     });

  it('should render a onOffColorLight and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'onOffColorLight',
         name: 'foofoo',
         type: 'onOffColorLight',
         properties: {
           on: {
             value: false,
             type: 'boolean',
           },
           color: {
             value: '#ffffff',
             type: 'string',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       thingsPage.open();

       await thingsPage.waitForOffThings();
       let things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingName = await things[0].thingName();
       expect(thingName).toEqual(desc.name);

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();

       await setProperty(desc.id, 'color', '#6789ab');
       await waitForExpect(async () => {
         things = await thingsPage.things();
         const level = await things[0].thingColorDisplayed();
         expect(level).toEqual('#6789ab');
       });

       await setProperty(desc.id, 'on', false);
       await thingsPage.waitForOffThings();

       things = await thingsPage.things();
       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();

       // We have to wait connecting websocket.
       await detailPage.waitForOffThing();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check onOff property
       const onOffProperty = await detailPage.onOffProperty();
       let on = await onOffProperty.getValue();
       expect(on).not.toBeTruthy();
       await onOffProperty.click();
       await waitForExpect(async () => {
         on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
         on = await onOffProperty.getValue();
         expect(on).toBeTruthy();
       });
       await setProperty(desc.id, 'on', false);
       await waitForExpect(async () => {
         on = await onOffProperty.getValue();
         expect(on).not.toBeTruthy();
       });
     });

  it('should render a dimmableColorLight and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'dimmableColorLight',
         name: 'foofoo',
         type: 'dimmableColorLight',
         properties: {
           on: {
             value: false,
             type: 'boolean',
           },
           level: {
             value: 0,
             type: 'number',
             unit: 'percent',
           },
           color: {
             value: '#ffffff',
             type: 'string',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       thingsPage.open();

       await thingsPage.waitForOffThings();
       let things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingName = await things[0].thingName();
       expect(thingName).toEqual(desc.name);

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();

       await setProperty(desc.id, 'level', 50);
       await waitForExpect(async () => {
         things = await thingsPage.things();
         const level = await things[0].thingLevelDisplayed();
         expect(level).toEqual('50%');
       });

       await setProperty(desc.id, 'color', '#56789a');
       await waitForExpect(async () => {
         things = await thingsPage.things();
         const level = await things[0].thingColorDisplayed();
         expect(level).toEqual('#56789a');
       });

       await setProperty(desc.id, 'on', false);
       await thingsPage.waitForOffThings();

       things = await thingsPage.things();
       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();

       // We have to wait connecting websocket.
       await detailPage.waitForOffThing();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check onOff property
       const onOffProperty = await detailPage.onOffProperty();
       let on = await onOffProperty.getValue();
       expect(on).not.toBeTruthy();
       await onOffProperty.click();
       await waitForExpect(async () => {
         on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
         on = await onOffProperty.getValue();
         expect(on).toBeTruthy();
       });
       await setProperty(desc.id, 'on', false);
       await waitForExpect(async () => {
         on = await onOffProperty.getValue();
         expect(on).not.toBeTruthy();
       });

       // Check level property
       const levelProperty = await detailPage.brightnessProperty();
       let level = await levelProperty.getValue();
       expect(level).toEqual(50);
       await levelProperty.setValue(20);
       await waitForExpect(async () => {
         level = await getProperty(desc.id, 'level');
         expect(level).toEqual(20);
         level = await levelProperty.getValue();
         expect(level).toEqual(20);
       });
       await setProperty(desc.id, 'level', 60);
       await waitForExpect(async () => {
         level = await levelProperty.getValue();
         expect(level).toEqual(60);
       });
     });

  it('should render a multiLevelSwitch and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'multiLevelSwitch',
         name: 'foofoo',
         type: 'multiLevelSwitch',
         properties: {
           on: {
             value: false,
             type: 'boolean',
           },
           level: {
             value: 0,
             type: 'number',
             unit: 'percent',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       thingsPage.open();

       await thingsPage.waitForOffThings();
       let things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingName = await things[0].thingName();
       expect(thingName).toEqual(desc.name);

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();

       await setProperty(desc.id, 'level', 50);
       await waitForExpect(async () => {
         things = await thingsPage.things();
         const level = await things[0].thingLevelDisplayed();
         expect(level).toEqual('50%');
       });

       await setProperty(desc.id, 'on', false);
       await thingsPage.waitForOffThings();

       things = await thingsPage.things();
       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();

       // We have to wait connecting websocket.
       await detailPage.waitForOffThing();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check onOff property
       const onOffProperty = await detailPage.onOffProperty();
       let on = await onOffProperty.getValue();
       expect(on).not.toBeTruthy();
       await onOffProperty.click();
       await waitForExpect(async () => {
         on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
         on = await onOffProperty.getValue();
         expect(on).toBeTruthy();
       });
       await setProperty(desc.id, 'on', false);
       await waitForExpect(async () => {
         on = await onOffProperty.getValue();
         expect(on).not.toBeTruthy();
       });

       // Check level property
       const levelProperty = await detailPage.levelProperty();
       let level = await levelProperty.getValue();
       expect(level).toEqual(50);
       await levelProperty.setValue(20);
       await waitForExpect(async () => {
         level = await getProperty(desc.id, 'level');
         expect(level).toEqual(20);
         level = await levelProperty.getValue();
         expect(level).toEqual(20);
       });
       await setProperty(desc.id, 'level', 60);
       await waitForExpect(async () => {
         level = await levelProperty.getValue();
         expect(level).toEqual(60);
       });
     });

  it('should render a smartPlug and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'smartPlug',
         name: 'foofoo',
         type: 'smartPlug',
         properties: {
           on: {
             value: false,
             type: 'boolean',
           },
           level: {
             value: 0,
             type: 'number',
             unit: 'percent',
           },
           instantaneousPower: {
             value: 0,
             type: 'number',
             unit: 'watt',
           },
           voltage: {
             value: 0,
             type: 'number',
             unit: 'volt',
           },
           current: {
             value: 0,
             type: 'number',
             unit: 'ampere',
           },
           frequency: {
             value: 0,
             type: 'number',
             unit: 'hertz',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       thingsPage.open();

       await thingsPage.waitForOffThings();
       let things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingName = await things[0].thingName();
       expect(thingName).toEqual(desc.name);

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();

       await setProperty(desc.id, 'instantaneousPower', 50);
       await waitForExpect(async () => {
         things = await thingsPage.things();
         const level = await things[0].thingPowerDisplayed();
         expect(level).toEqual('50.00W');
       });

       await setProperty(desc.id, 'on', false);
       await thingsPage.waitForOffThings();

       things = await thingsPage.things();
       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();

       // Thing Detail View
       // We have to wait connecting websocket.
       await detailPage.waitForOffThing();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check onOff property
       const onOffProperty = await detailPage.onOffProperty();
       let on = await onOffProperty.getValue();
       expect(on).not.toBeTruthy();
       await onOffProperty.click();
       await waitForExpect(async () => {
         on = await getProperty(desc.id, 'on');
         expect(on).toBeTruthy();
         on = await onOffProperty.getValue();
         expect(on).toBeTruthy();
       });
       await setProperty(desc.id, 'on', false);
       await waitForExpect(async () => {
         on = await onOffProperty.getValue();
         expect(on).not.toBeTruthy();
       });

       // Check level property
       const levelProperty = await detailPage.levelProperty();
       let level = await levelProperty.getValue();
       expect(level).toEqual(0);
       await levelProperty.setValue(20);
       await waitForExpect(async () => {
         level = await getProperty(desc.id, 'level');
         expect(level).toEqual(20);
         level = await levelProperty.getValue();
         expect(level).toEqual(20);
       });
       await setProperty(desc.id, 'level', 60);
       await waitForExpect(async () => {
         level = await levelProperty.getValue();
         expect(level).toEqual(60);
       });

       // Check power property
       const powerProperty = await detailPage.powerProperty();
       let power = await powerProperty.getDisplayedText();
       expect(power).toEqual('50 W');
       await setProperty(desc.id, 'instantaneousPower', 60);
       await waitForExpect(async () => {
         power = await powerProperty.getDisplayedText();
         expect(power).toEqual('60 W');
       });

       // Check voltage property
       const voltageProperty = await detailPage.voltageProperty();
       let voltage = await voltageProperty.getDisplayedText();
       expect(voltage).toEqual('0 V');
       await setProperty(desc.id, 'voltage', 30);
       await waitForExpect(async () => {
         voltage = await voltageProperty.getDisplayedText();
         expect(voltage).toEqual('30 V');
       });

       // Check current property
       const currentProperty = await detailPage.currentProperty();
       let current = await currentProperty.getDisplayedText();
       expect(current).toEqual('0.0 A');
       await setProperty(desc.id, 'current', 40);
       await waitForExpect(async () => {
         current = await currentProperty.getDisplayedText();
         expect(current).toEqual('40.0 A');
       });

       // Check current property
       const frequencyProperty = await detailPage.frequencyProperty();
       let frequency = await frequencyProperty.getDisplayedText();
       expect(frequency).toEqual('0 Hz');
       await setProperty(desc.id, 'frequency', 10);
       await waitForExpect(async () => {
         frequency = await frequencyProperty.getDisplayedText();
         expect(frequency).toEqual('10 Hz');
       });
     });

  it('should render a binarySensor and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'binarySensor',
         name: 'foofoo',
         type: 'binarySensor',
         properties: {
           on: {
             value: false,
             type: 'boolean',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       thingsPage.open();

       await thingsPage.waitForOffThings();
       let things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingName = await things[0].thingName();
       expect(thingName).toEqual(desc.name);

       await setProperty(desc.id, 'on', true);
       await thingsPage.waitForOnThings();

       await setProperty(desc.id, 'on', false);
       await thingsPage.waitForOffThings();

       things = await thingsPage.things();
       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();
     });

  it('should render a multiLevelSensor and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'multiLevelSensor',
         name: 'foofoo',
         type: 'multiLevelSensor',
         properties: {
           on: {
             value: false,
             type: 'boolean',
           },
           level: {
             value: 0,
             type: 'number',
             unit: 'percent',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       thingsPage.open();

       await thingsPage.waitForThings();
       let things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingName = await things[0].thingName();
       expect(thingName).toEqual(desc.name);

       await setProperty(desc.id, 'level', 50);
       await waitForExpect(async () => {
         things = await thingsPage.things();
         const level = await things[0].thingLevelDisplayed();
         expect(level).toEqual('50%');
       });

       things = await thingsPage.things();
       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();
     });
});
