const {getBrowser, saveStepScreen} = require('../browser-common');
const {
  addThing,
  escapeHtmlForIdClass,
  getProperty,
  setProperty,
} = require('../test-utils');

const {waitForExpect} = require('../../expect-utils');
const ThingsPage = require('../page-object/things-page');
const util = require('util');


describe('Thing', () => {
  it('should render an unknown thing and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'UnknownThing',
         title: 'foofoo',
         type: 'thing',
         '@context': 'https://iot.mozilla.org/schemas',
         '@type': [],
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
       await thingsPage.open();

       await thingsPage.waitForThings();
       const things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingTitle = await things[0].thingTitle();
       expect(thingTitle).toEqual(desc.title);
       await saveStepScreen();

       const detailPage = await things[0].openDetailPage();

       // We have to wait connecting websocket.
       await detailPage.waitForBooleanProperties();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check boolean property
       const booleanProps = await detailPage.booleanProperties();
       expect(booleanProps.length).toEqual(1);
       const booleanValue = await booleanProps[0].getValue();
       expect(booleanValue).toBeTruthy();
       await booleanProps[0].click();
       await waitForExpect(async () => {
         const val1 = await getProperty(desc.id, 'booleanProp');
         expect(val1).not.toBeTruthy();
         const val2 = await booleanProps[0].getValue();
         expect(val2).not.toBeTruthy();
       });
       await setProperty(desc.id, 'booleanProp', true);
       await waitForExpect(async () => {
         const val3 = await booleanProps[0].getValue();
         expect(val3).toBeTruthy();
       });
       await saveStepScreen();

       // Check number property
       const numberProps = await detailPage.numberProperties();
       expect(numberProps.length).toEqual(1);
       const numberValue = await numberProps[0].getValue();
       expect(numberValue).toEqual(10);
       await numberProps[0].setValue(20);
       await waitForExpect(async () => {
         const val1 = await getProperty(desc.id, 'numberProp');
         expect(val1).toEqual(20);
         const val2 = await numberProps[0].getValue();
         expect(val2).toEqual(20);
       });
       await setProperty(desc.id, 'numberProp', 5);
       await waitForExpect(async () => {
         const val3 = await numberProps[0].getValue();
         expect(val3).toEqual(5);
       });
       await saveStepScreen();

       // Check string property
       const stringProps = await detailPage.stringProperties();
       expect(stringProps.length).toEqual(1);
       const stringValue = await stringProps[0].getValue();
       expect(stringValue).toEqual('bar');
       await stringProps[0].setValue('foo');
       await waitForExpect(async () => {
         const val1 = await getProperty(desc.id, 'stringProp');
         expect(val1).toEqual('foo');
         const val2 = await stringProps[0].getValue();
         if (val2 !== 'foo') {
           await stringProps[0].setValue('foo');
         }
         expect(val2).toEqual('foo');
       });
       await setProperty(desc.id, 'stringProp', 'foobar');
       await waitForExpect(async () => {
         const val3 = await stringProps[0].getValue();
         expect(val3).toEqual('foobar');
       });
       await saveStepScreen();
     });

  it('should render a thing with spaced property names', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'spacedPropertyThings',
      title: 'battery sensor',
      type: 'thing',
      '@context': 'https://iot.mozilla.org/schemas',
      '@type': [],
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
    await thingsPage.open();

    await thingsPage.waitForThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);
    await saveStepScreen();

    const detailPage = await things[0].openDetailPage();

    await detailPage.waitForBooleanProperties();
    const booleanProps = await detailPage.booleanProperties();
    expect(booleanProps.length).toEqual(1);
    const booleanValue = await booleanProps[0].getValue();
    expect(booleanValue).toBeTruthy();
    const booleanId = await booleanProps[0].getId();
    expect(booleanId).toEqual(
      `boolean-${escapeHtmlForIdClass('spaced boolean')}`
    );
    await saveStepScreen();

    const numberProps = await detailPage.numberProperties();
    expect(numberProps.length).toEqual(1);
    const numberValue = await numberProps[0].getValue();
    expect(numberValue).toEqual(10);
    const numberId = await numberProps[0].getId();
    expect(numberId).toEqual(
      `number-${escapeHtmlForIdClass('spaced number')}`
    );
    await saveStepScreen();

    const stringProps = await detailPage.stringProperties();
    expect(stringProps.length).toEqual(1);
    const stringValue = await stringProps[0].getValue();
    expect(stringValue).toEqual('foo');
    const stringId = await stringProps[0].getId();
    expect(stringId).toEqual(
      `string-${escapeHtmlForIdClass('spaced string')}`
    );
    await saveStepScreen();
  });

  it('should reset property value when setProperty is rejected', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'UnknownThing',
      title: 'foofoo',
      type: 'thing',
      '@context': 'https://iot.mozilla.org/schemas',
      '@type': [],
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
    await thingsPage.open();

    await thingsPage.waitForThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);
    await saveStepScreen();

    const detailPage = await things[0].openDetailPage();

    // We have to wait connecting websocket.
    await detailPage.waitForBooleanProperties();
    const waitWebSocketPromise = util.promisify(setImmediate);
    await waitWebSocketPromise();

    // Check boolean property
    const booleanProps = await detailPage.booleanProperties();
    expect(booleanProps.length).toEqual(1);
    const booleanValue = await booleanProps[0].getValue();
    expect(booleanValue).toBeTruthy();
    await booleanProps[0].click();
    await waitForExpect(async () => {
      const val1 = await getProperty(desc.id, 'rejectPropertyBool');
      expect(val1).toBeTruthy();
      const val2 = await booleanProps[0].getValue();
      expect(val2).toBeTruthy();
    });
    await saveStepScreen();

    // Check number property
    const numberProps = await detailPage.numberProperties();
    expect(numberProps.length).toEqual(1);
    const numberValue = await numberProps[0].getValue();
    expect(numberValue).toEqual(10);
    await numberProps[0].setValue(20);
    await waitForExpect(async () => {
      const val1 = await getProperty(desc.id, 'rejectPropertyNum');
      expect(val1).toEqual(10);
      const val2 = await numberProps[0].getValue();
      expect(val2).toEqual(10);
    });
    await saveStepScreen();

    // Check string property
    const stringProps = await detailPage.stringProperties();
    expect(stringProps.length).toEqual(1);
    const stringValue = await stringProps[0].getValue();
    expect(stringValue).toEqual('bar');
    await stringProps[0].setValue('foo');
    await waitForExpect(async () => {
      const val1 = await getProperty(desc.id, 'rejectPropertyStr');
      expect(val1).toEqual('bar');
      const val2 = await stringProps[0].getValue();
      expect(val2).toEqual('bar');
    });
    await saveStepScreen();
  });

  it('should render an onOffLight and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'onOffLight',
         title: 'foofoo',
         type: 'onOffLight',
         '@context': 'https://iot.mozilla.org/schemas',
         '@type': ['OnOffSwitch', 'Light'],
         properties: {
           power: {
             '@type': 'OnOffProperty',
             value: false,
             type: 'boolean',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       await thingsPage.open();

       await thingsPage.waitForOffThings();
       const things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingTitle = await things[0].thingTitle();
       expect(thingTitle).toEqual(desc.title);
       await saveStepScreen();

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'power');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();
       await saveStepScreen();

       await setProperty(desc.id, 'power', false);
       await thingsPage.waitForOffThings();
       await saveStepScreen();

       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();
       await saveStepScreen();
     });

  it('should render an onOffSwitch and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'onOffSwitch',
         title: 'foofoo',
         type: 'onOffSwitch',
         '@context': 'https://iot.mozilla.org/schemas',
         '@type': ['OnOffSwitch'],
         properties: {
           power: {
             '@type': 'OnOffProperty',
             value: false,
             type: 'boolean',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       await thingsPage.open();

       await thingsPage.waitForOffThings();
       let things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingTitle = await things[0].thingTitle();
       expect(thingTitle).toEqual(desc.title);
       await saveStepScreen();

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'power');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();
       await saveStepScreen();

       await setProperty(desc.id, 'power', false);
       await thingsPage.waitForOffThings();
       await saveStepScreen();

       things = await thingsPage.things();
       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();
       await saveStepScreen();
     });

  it('should render a dimmableLight and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'dimmableLight',
         title: 'foofoo',
         type: 'dimmableLight',
         '@context': 'https://iot.mozilla.org/schemas',
         '@type': ['OnOffSwitch', 'Light'],
         properties: {
           power: {
             '@type': 'OnOffProperty',
             value: false,
             type: 'boolean',
           },
           brightness: {
             '@type': 'BrightnessProperty',
             value: 0,
             type: 'number',
             unit: 'percent',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       await thingsPage.open();

       await thingsPage.waitForOffThings();
       const things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingTitle = await things[0].thingTitle();
       expect(thingTitle).toEqual(desc.title);
       await saveStepScreen();

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'power');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();
       await saveStepScreen();

       await setProperty(desc.id, 'brightness', 50);
       await waitForExpect(async () => {
         const things = await thingsPage.things();
         const level = await things[0].thingLevelDisplayed();
         expect(level).toEqual('50%');
       });
       await saveStepScreen();

       await setProperty(desc.id, 'power', false);
       await thingsPage.waitForOffThings();
       await saveStepScreen();

       const things2 = await thingsPage.things();
       const detailPage = await things2[0].openDetailPage();
       expect(detailPage).toBeTruthy();

       // We have to wait connecting websocket.
       await detailPage.waitForOffThing();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check onOff property
       const onOffProperty = await detailPage.onOffProperty();
       const on1 = await onOffProperty.getValue();
       expect(on1).not.toBeTruthy();
       await onOffProperty.click();
       await waitForExpect(async () => {
         const on2 = await getProperty(desc.id, 'power');
         expect(on2).toBeTruthy();
         const on3 = await onOffProperty.getValue();
         expect(on3).toBeTruthy();
       });
       await setProperty(desc.id, 'power', false);
       await waitForExpect(async () => {
         const on4 = await onOffProperty.getValue();
         expect(on4).not.toBeTruthy();
       });
       await saveStepScreen();

       // Check level property
       const brightnessProperty = await detailPage.brightnessProperty();
       const brightness1 = await brightnessProperty.getValue();
       expect(brightness1).toEqual(50);
       await brightnessProperty.setValue(20);
       await waitForExpect(async () => {
         const brightness2 = await getProperty(desc.id, 'brightness');
         expect(brightness2).toEqual(20);
         const brightness3 = await brightnessProperty.getValue();
         expect(brightness3).toEqual(20);
       });
       await setProperty(desc.id, 'brightness', 60);
       await waitForExpect(async () => {
         const brightness4 = await brightnessProperty.getValue();
         expect(brightness4).toEqual(60);
       });
       await saveStepScreen();
     });

  it('should render an onOffColorLight and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'onOffColorLight',
         title: 'foofoo',
         type: 'onOffColorLight',
         '@context': 'https://iot.mozilla.org/schemas',
         '@type': ['OnOffSwitch', 'Light', 'ColorControl'],
         properties: {
           power: {
             '@type': 'OnOffProperty',
             value: false,
             type: 'boolean',
           },
           rgb: {
             '@type': 'ColorProperty',
             value: '#ffffff',
             type: 'string',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       await thingsPage.open();

       await thingsPage.waitForOffThings();
       const things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingTitle = await things[0].thingTitle();
       expect(thingTitle).toEqual(desc.title);
       await saveStepScreen();

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'power');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();
       await saveStepScreen();

       await setProperty(desc.id, 'rgb', '#6789ab');
       await waitForExpect(async () => {
         const things = await thingsPage.things();
         const level = await things[0].thingColorDisplayed();
         expect(level).toEqual('#6789ab');
       });
       await saveStepScreen();

       await setProperty(desc.id, 'power', false);
       await thingsPage.waitForOffThings();
       await saveStepScreen();

       const things2 = await thingsPage.things();
       const detailPage = await things2[0].openDetailPage();
       expect(detailPage).toBeTruthy();

       // We have to wait connecting websocket.
       await detailPage.waitForOffThing();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check onOff property
       const onOffProperty = await detailPage.onOffProperty();
       const on1 = await onOffProperty.getValue();
       expect(on1).not.toBeTruthy();
       await onOffProperty.click();
       await waitForExpect(async () => {
         const on2 = await getProperty(desc.id, 'power');
         expect(on2).toBeTruthy();
         const on3 = await onOffProperty.getValue();
         expect(on3).toBeTruthy();
       });
       await setProperty(desc.id, 'power', false);
       await waitForExpect(async () => {
         const on4 = await onOffProperty.getValue();
         expect(on4).not.toBeTruthy();
       });
       await saveStepScreen();
     });

  it('should render a dimmableColorLight and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'dimmableColorLight',
         title: 'foofoo',
         type: 'dimmableColorLight',
         '@context': 'https://iot.mozilla.org/schemas',
         '@type': ['OnOffSwitch', 'Light', 'ColorControl'],
         properties: {
           power: {
             '@type': 'OnOffProperty',
             value: false,
             type: 'boolean',
           },
           brightness: {
             '@type': 'BrightnessProperty',
             value: 0,
             type: 'number',
             unit: 'percent',
           },
           rgb: {
             '@type': 'ColorProperty',
             value: '#ffffff',
             type: 'string',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       await thingsPage.open();

       await thingsPage.waitForOffThings();
       const things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingTitle = await things[0].thingTitle();
       expect(thingTitle).toEqual(desc.title);
       await saveStepScreen();

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'power');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();
       await saveStepScreen();

       await setProperty(desc.id, 'brightness', 50);
       await waitForExpect(async () => {
         const things = await thingsPage.things();
         const level = await things[0].thingLevelDisplayed();
         expect(level).toEqual('50%');
       });
       await saveStepScreen();

       await setProperty(desc.id, 'rgb', '#56789a');
       await waitForExpect(async () => {
         const things = await thingsPage.things();
         const level = await things[0].thingColorDisplayed();
         expect(level).toEqual('#56789a');
       });
       await saveStepScreen();

       await setProperty(desc.id, 'power', false);
       await thingsPage.waitForOffThings();
       await saveStepScreen();

       const things2 = await thingsPage.things();
       const detailPage = await things2[0].openDetailPage();
       expect(detailPage).toBeTruthy();

       // We have to wait connecting websocket.
       await detailPage.waitForOffThing();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();
       await saveStepScreen();

       // Check onOff property
       const onOffProperty = await detailPage.onOffProperty();
       const on1 = await onOffProperty.getValue();
       expect(on1).not.toBeTruthy();
       await onOffProperty.click();
       await waitForExpect(async () => {
         const on2 = await getProperty(desc.id, 'power');
         expect(on2).toBeTruthy();
         const on3 = await onOffProperty.getValue();
         expect(on3).toBeTruthy();
       });
       await setProperty(desc.id, 'power', false);
       await waitForExpect(async () => {
         const on4 = await onOffProperty.getValue();
         expect(on4).not.toBeTruthy();
       });
       await saveStepScreen();

       // Check level property
       const levelProperty = await detailPage.brightnessProperty();
       const level1 = await levelProperty.getValue();
       expect(level1).toEqual(50);
       await levelProperty.setValue(20);
       await waitForExpect(async () => {
         const level2 = await getProperty(desc.id, 'brightness');
         expect(level2).toEqual(20);
         const level3 = await levelProperty.getValue();
         expect(level3).toEqual(20);
       });
       await setProperty(desc.id, 'brightness', 60);
       await waitForExpect(async () => {
         const level4 = await levelProperty.getValue();
         expect(level4).toEqual(60);
       });
       await saveStepScreen();
     });

  it('should render a multiLevelSwitch and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'multiLevelSwitch',
         title: 'foofoo',
         type: 'multiLevelSwitch',
         '@context': 'https://iot.mozilla.org/schemas',
         '@type': ['OnOffSwitch', 'MultiLevelSwitch'],
         properties: {
           power: {
             '@type': 'OnOffProperty',
             value: false,
             type: 'boolean',
           },
           percent: {
             '@type': 'LevelProperty',
             value: 0,
             type: 'number',
             unit: 'percent',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       await thingsPage.open();

       await thingsPage.waitForOffThings();
       const things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingTitle = await things[0].thingTitle();
       expect(thingTitle).toEqual(desc.title);
       await saveStepScreen();

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'power');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();
       await saveStepScreen();

       await setProperty(desc.id, 'percent', 50);
       await waitForExpect(async () => {
         const things = await thingsPage.things();
         const level = await things[0].thingLevelDisplayed();
         expect(level).toEqual('50%');
       });
       await saveStepScreen();

       await setProperty(desc.id, 'power', false);
       await thingsPage.waitForOffThings();
       await saveStepScreen();

       const things2 = await thingsPage.things();
       const detailPage = await things2[0].openDetailPage();
       expect(detailPage).toBeTruthy();
       await saveStepScreen();

       // We have to wait connecting websocket.
       await detailPage.waitForOffThing();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check onOff property
       const onOffProperty = await detailPage.onOffProperty();
       const on1 = await onOffProperty.getValue();
       expect(on1).not.toBeTruthy();
       await onOffProperty.click();
       await waitForExpect(async () => {
         const on2 = await getProperty(desc.id, 'power');
         expect(on2).toBeTruthy();
         const on3 = await onOffProperty.getValue();
         expect(on3).toBeTruthy();
       });
       await setProperty(desc.id, 'power', false);
       await waitForExpect(async () => {
         const on4 = await onOffProperty.getValue();
         expect(on4).not.toBeTruthy();
       });
       await saveStepScreen();

       // Check level property
       const levelProperty = await detailPage.levelProperty();
       const level1 = await levelProperty.getValue();
       expect(level1).toEqual(50);
       await levelProperty.setValue(20);
       await waitForExpect(async () => {
         const level2 = await getProperty(desc.id, 'percent');
         expect(level2).toEqual(20);
         const level3 = await levelProperty.getValue();
         expect(level3).toEqual(20);
       });
       await setProperty(desc.id, 'percent', 60);
       await waitForExpect(async () => {
         const level4 = await levelProperty.getValue();
         expect(level4).toEqual(60);
       });
       await saveStepScreen();
     });

  it('should render a smartPlug and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'smartPlug',
         title: 'foofoo',
         type: 'smartPlug',
         '@context': 'https://iot.mozilla.org/schemas',
         '@type': [
           'OnOffSwitch',
           'MultiLevelSwitch',
           'SmartPlug',
           'EnergyMonitor',
         ],
         properties: {
           power: {
             '@type': 'OnOffProperty',
             value: false,
             type: 'boolean',
           },
           percent: {
             '@type': 'LevelProperty',
             value: 0,
             type: 'number',
             unit: 'percent',
           },
           energyPower: {
             '@type': 'InstantaneousPowerProperty',
             value: 0,
             type: 'number',
             unit: 'watt',
           },
           energyVoltage: {
             '@type': 'VoltageProperty',
             value: 0,
             type: 'number',
             unit: 'volt',
           },
           energyCurrent: {
             '@type': 'CurrentProperty',
             value: 0,
             type: 'number',
             unit: 'ampere',
           },
           energyFrequency: {
             '@type': 'FrequencyProperty',
             value: 0,
             type: 'number',
             unit: 'hertz',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       await thingsPage.open();

       await thingsPage.waitForOffThings();
       const things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingTitle = await things[0].thingTitle();
       expect(thingTitle).toEqual(desc.title);
       await saveStepScreen();

       await things[0].click();
       await waitForExpect(async () => {
         const on = await getProperty(desc.id, 'power');
         expect(on).toBeTruthy();
       });
       await thingsPage.waitForOnThings();
       await saveStepScreen();

       await setProperty(desc.id, 'energyPower', 50);
       await waitForExpect(async () => {
         const things = await thingsPage.things();
         const level = await things[0].thingPowerDisplayed();
         expect(level).toEqual('50 W');
       });
       await saveStepScreen();

       await setProperty(desc.id, 'power', false);
       await thingsPage.waitForOffThings();
       await saveStepScreen();

       const things2 = await thingsPage.things();
       const detailPage = await things2[0].openDetailPage();
       expect(detailPage).toBeTruthy();

       // Thing Detail View
       // We have to wait connecting websocket.
       await detailPage.waitForOffThing();
       const waitWebSocketPromise = util.promisify(setImmediate);
       await waitWebSocketPromise();

       // Check onOff property
       const onOffProperty = await detailPage.onOffProperty();
       const on1 = await onOffProperty.getValue();
       expect(on1).not.toBeTruthy();
       await onOffProperty.click();
       await waitForExpect(async () => {
         const on2 = await getProperty(desc.id, 'power');
         expect(on2).toBeTruthy();
         const on3 = await onOffProperty.getValue();
         expect(on3).toBeTruthy();
       });
       await setProperty(desc.id, 'power', false);
       await waitForExpect(async () => {
         const on4 = await onOffProperty.getValue();
         expect(on4).not.toBeTruthy();
       });
       await saveStepScreen();

       // Check level property
       const levelProperty = await detailPage.levelProperty();
       const level1 = await levelProperty.getValue();
       expect(level1).toEqual(0);
       await levelProperty.setValue(20);
       await waitForExpect(async () => {
         const level2 = await getProperty(desc.id, 'percent');
         if (level2 !== 20) {
           await levelProperty.setValue(20);
         }
         expect(level2).toEqual(20);
         const level3 = await levelProperty.getValue();
         expect(level3).toEqual(20);
       });
       await setProperty(desc.id, 'percent', 60);
       await waitForExpect(async () => {
         const level4 = await levelProperty.getValue();
         expect(level4).toEqual(60);
       });
       await saveStepScreen();

       // Check power property
       const powerProperty = await detailPage.powerProperty();
       const power1 = await powerProperty.getDisplayedText();
       expect(power1).toEqual('50W');
       await setProperty(desc.id, 'energyPower', 60);
       await waitForExpect(async () => {
         const power2 = await powerProperty.getDisplayedText();
         expect(power2).toEqual('60W');
       });
       await saveStepScreen();

       // Check voltage property
       const voltageProperty = await detailPage.voltageProperty();
       const voltage1 = await voltageProperty.getDisplayedText();
       expect(voltage1).toEqual('0V');
       await setProperty(desc.id, 'energyVoltage', 30);
       await waitForExpect(async () => {
         const voltage2 = await voltageProperty.getDisplayedText();
         expect(voltage2).toEqual('30V');
       });
       await saveStepScreen();

       // Check current property
       const currentProperty = await detailPage.currentProperty();
       const current1 = await currentProperty.getDisplayedText();
       expect(current1).toEqual('0.0A');
       await setProperty(desc.id, 'energyCurrent', 40);
       await waitForExpect(async () => {
         const current2 = await currentProperty.getDisplayedText();
         expect(current2).toEqual('40.0A');
       });
       await saveStepScreen();

       // Check current property
       const frequencyProperty = await detailPage.frequencyProperty();
       const frequency1 = await frequencyProperty.getDisplayedText();
       expect(frequency1).toEqual('0Hz');
       await setProperty(desc.id, 'energyFrequency', 10);
       await waitForExpect(async () => {
         const frequency2 = await frequencyProperty.getDisplayedText();
         expect(frequency2).toEqual('10Hz');
       });
       await saveStepScreen();
     });

  it('should render a binarySensor and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'binarySensor',
         title: 'foofoo',
         type: 'binarySensor',
         '@context': 'https://iot.mozilla.org/schemas',
         '@type': ['BinarySensor'],
         properties: {
           active: {
             '@type': 'BooleanProperty',
             value: false,
             type: 'boolean',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       await thingsPage.open();

       await thingsPage.waitForOffThings();
       let things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingTitle = await things[0].thingTitle();
       expect(thingTitle).toEqual(desc.title);
       await saveStepScreen();

       await setProperty(desc.id, 'active', true);
       await thingsPage.waitForOnThings();
       await saveStepScreen();

       await setProperty(desc.id, 'active', false);
       await thingsPage.waitForOffThings();
       await saveStepScreen();

       things = await thingsPage.things();
       const detailPage = await things[0].openDetailPage();
       expect(detailPage).toBeTruthy();
       await saveStepScreen();
     });

  it('should render a multiLevelSensor and be able to change properties',
     async () => {
       const browser = getBrowser();
       const desc = {
         id: 'multiLevelSensor',
         title: 'foofoo',
         type: 'multiLevelSensor',
         '@context': 'https://iot.mozilla.org/schemas',
         '@type': ['MultiLevelSensor'],
         properties: {
           active: {
             '@type': 'BooleanProperty',
             value: false,
             type: 'boolean',
           },
           percent: {
             '@type': 'LevelProperty',
             value: 0,
             type: 'number',
             unit: 'percent',
           },
         },
       };
       await addThing(desc);

       const thingsPage = new ThingsPage(browser);
       await thingsPage.open();

       await thingsPage.waitForThings();
       const things = await thingsPage.things();
       expect(things.length).toEqual(1);
       const thingTitle = await things[0].thingTitle();
       expect(thingTitle).toEqual(desc.title);
       await saveStepScreen();

       await setProperty(desc.id, 'percent', 50);
       await waitForExpect(async () => {
         const things = await thingsPage.things();
         const level = await things[0].thingLevelDisplayed();
         expect(level).toEqual('50%');
       });
       await saveStepScreen();

       const things2 = await thingsPage.things();
       const detailPage = await things2[0].openDetailPage();
       expect(detailPage).toBeTruthy();
       await saveStepScreen();
     });
});
