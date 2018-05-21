const {getBrowser} = require('../browser-common');
const {
  addThing,
  getProperty,
  setProperty,
  waitForExpect,
} = require('./test-utils');
const ThingsPage = require('../page-object/things-page');

const STATIC_JS_PATH = '../../../../static/js';
const Utils = require(`${STATIC_JS_PATH}/utils`);


describe('Thing', () => {
  it('should render a thing and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'UnknownThings',
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

    await detailPage.waitForBooleanProperties();

    const booleanProps = await detailPage.booleanProperties();
    expect(booleanProps.length).toEqual(1);
    let booleanValue = await booleanProps[0].getValue();
    expect(booleanValue).toBeTruthy();
    await setProperty(desc.id, 'booleanProp', false);
    await waitForExpect(async () => {
      booleanValue = await booleanProps[0].getValue();
      expect(booleanValue).not.toBeTruthy();
    });

    const numberProps = await detailPage.numberProperties();
    expect(numberProps.length).toEqual(1);
    let numberValue = await numberProps[0].getValue();
    expect(numberValue).toEqual(10);
    await numberProps[0].setValue(20);
    await waitForExpect(async () => {
      numberValue = await getProperty(desc.id, 'numberProp');
      expect(numberValue).toEqual(20);
    });
    await setProperty(desc.id, 'numberProp', 5);
    await waitForExpect(async () => {
      numberValue = await numberProps[0].getValue();
      expect(numberValue).toEqual(5);
    });

    const stringProps = await detailPage.stringProperties();
    expect(stringProps.length).toEqual(1);
    let stringValue = await stringProps[0].getValue();
    expect(stringValue).toEqual('bar');
    await stringProps[0].setValue('foo');
    await waitForExpect(async () => {
      stringValue = await getProperty(desc.id, 'stringProp');
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
    const booleanId = await booleanProps[0].getInputId();
    expect(booleanId).toEqual(
      `checkbox-${Utils.escapeHtmlForIdClass('spaced boolean')}`
    );

    const numberProps = await detailPage.numberProperties();
    expect(numberProps.length).toEqual(1);
    const numberValue = await numberProps[0].getValue();
    expect(numberValue).toEqual(10);
    const numberId = await numberProps[0].getInputId();
    expect(numberId).toEqual(
      `number-${Utils.escapeHtmlForIdClass('spaced number')}`
    );

    const stringProps = await detailPage.stringProperties();
    expect(stringProps.length).toEqual(1);
    const stringValue = await stringProps[0].getValue();
    expect(stringValue).toEqual('foo');
    const stringId = await stringProps[0].getInputId();
    expect(stringId).toEqual(
      `string-${Utils.escapeHtmlForIdClass('spaced string')}`
    );
  });

  it('should reset property value when setProperty is rejected', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'UnknownThings',
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

    await detailPage.waitForBooleanProperties();
    const booleanProps = await detailPage.booleanProperties();
    expect(booleanProps.length).toEqual(1);
    const booleanValue = await booleanProps[0].getValue();
    expect(booleanValue).toBeTruthy();

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

       await thingsPage.waitForThings();
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
       expect(detailPage).toBeNull();
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

       await thingsPage.waitForThings();
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
       expect(detailPage).toBeNull();
     });
});
