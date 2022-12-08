import { getBrowser } from '../browser-common';
import express from 'express';
import { addThing, escapeHtmlForIdClass, getProperty, setProperty } from '../test-utils';
import { waitForExpect } from '../../expect-utils';
import { ThingsPage } from '../page-object/things-page';
import util from 'util';
import path from 'path';
import { AddressInfo } from 'net';
import { Server } from 'http';

describe('Thing', () => {
  it('should render an unknown thing and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'UnknownThing',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

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
  });

  it('should render a thing with spaced property names', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'spacedPropertyThings',
      title: 'battery sensor',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    const detailPage = await things[0].openDetailPage();

    await detailPage.waitForBooleanProperties();
    const booleanProps = await detailPage.booleanProperties();
    expect(booleanProps.length).toEqual(1);
    const booleanValue = await booleanProps[0].getValue();
    expect(booleanValue).toBeTruthy();
    const booleanId = await booleanProps[0].getId();
    expect(booleanId).toEqual(`boolean-${escapeHtmlForIdClass('spaced boolean')}`);

    const numberProps = await detailPage.numberProperties();
    expect(numberProps.length).toEqual(1);
    const numberValue = await numberProps[0].getValue();
    expect(numberValue).toEqual(10);
    const numberId = await numberProps[0].getId();
    expect(numberId).toEqual(`number-${escapeHtmlForIdClass('spaced number')}`);

    const stringProps = await detailPage.stringProperties();
    expect(stringProps.length).toEqual(1);
    const stringValue = await stringProps[0].getValue();
    expect(stringValue).toEqual('foo');
    const stringId = await stringProps[0].getId();
    expect(stringId).toEqual(`string-${escapeHtmlForIdClass('spaced string')}`);
  });

  // TODO: Fix or remove test case (https://github.com/WebThingsIO/gateway/issues/2906)
  it.skip('should reset property value when setProperty is rejected', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'UnknownThing',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
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
    await thingsPage.wait();
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

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
  });

  it('should render an onOffLight and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'onOffLight',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
      '@type': ['Light', 'OnOffSwitch'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForOffThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    await things[0].click();
    await waitForExpect(async () => {
      const on = await getProperty(desc.id, 'power');
      expect(on).toBeTruthy();
    });
    await thingsPage.waitForOnThings();

    await setProperty(desc.id, 'power', false);
    await thingsPage.waitForOffThings();

    const detailPage = await things[0].openDetailPage();
    expect(detailPage).toBeTruthy();
  });

  it('should render an onOffSwitch and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'onOffSwitch',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForOffThings();
    let things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    await things[0].click();
    await waitForExpect(async () => {
      const on = await getProperty(desc.id, 'power');
      expect(on).toBeTruthy();
    });
    await thingsPage.waitForOnThings();

    await setProperty(desc.id, 'power', false);
    await thingsPage.waitForOffThings();

    things = await thingsPage.things();
    const detailPage = await things[0].openDetailPage();
    expect(detailPage).toBeTruthy();
  });

  it('should render a dimmableLight and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'dimmableLight',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
      '@type': ['Light', 'OnOffSwitch'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForOffThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    await things[0].click();
    await waitForExpect(async () => {
      const on = await getProperty(desc.id, 'power');
      expect(on).toBeTruthy();
    });
    await thingsPage.waitForOnThings();

    await setProperty(desc.id, 'brightness', 50);
    await waitForExpect(async () => {
      const things = await thingsPage.things();
      const level = await things[0].thingLevelDisplayed();
      expect(level).toEqual('50%');
    });

    await setProperty(desc.id, 'power', false);
    await thingsPage.waitForOffThings();

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
  });

  it('should render an onOffColorLight and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'onOffColorLight',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
      '@type': ['Light', 'ColorControl', 'OnOffSwitch'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForOffThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    await things[0].click();
    await waitForExpect(async () => {
      const on = await getProperty(desc.id, 'power');
      expect(on).toBeTruthy();
    });
    await thingsPage.waitForOnThings();

    await setProperty(desc.id, 'rgb', '#6789ab');
    await waitForExpect(async () => {
      const things = await thingsPage.things();
      const level = await things[0].thingColorDisplayed();
      expect(level).toEqual('#6789ab');
    });

    await setProperty(desc.id, 'power', false);
    await thingsPage.waitForOffThings();

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
  });

  it('should render a dimmableColorLight and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'dimmableColorLight',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
      '@type': ['Light', 'ColorControl', 'OnOffSwitch'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForOffThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    await things[0].click();
    await waitForExpect(async () => {
      const on = await getProperty(desc.id, 'power');
      expect(on).toBeTruthy();
    });
    await thingsPage.waitForOnThings();

    await setProperty(desc.id, 'brightness', 50);
    await waitForExpect(async () => {
      const things = await thingsPage.things();
      const level = await things[0].thingLevelDisplayed();
      expect(level).toEqual('50%');
    });

    await setProperty(desc.id, 'rgb', '#56789a');
    await waitForExpect(async () => {
      const things = await thingsPage.things();
      const level = await things[0].thingColorDisplayed();
      expect(level).toEqual('#56789a');
    });

    await setProperty(desc.id, 'power', false);
    await thingsPage.waitForOffThings();

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
  });

  it('should render a multiLevelSwitch and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'multiLevelSwitch',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
      '@type': ['MultiLevelSwitch', 'OnOffSwitch'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForOffThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    await things[0].click();
    await waitForExpect(async () => {
      const on = await getProperty(desc.id, 'power');
      expect(on).toBeTruthy();
    });
    await thingsPage.waitForOnThings();

    await setProperty(desc.id, 'percent', 50);
    await waitForExpect(async () => {
      const things = await thingsPage.things();
      const level = await things[0].thingLevelDisplayed();
      expect(level).toEqual('50%');
    });

    await setProperty(desc.id, 'power', false);
    await thingsPage.waitForOffThings();

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
  });

  it('should render a smartPlug and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'smartPlug',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
      '@type': ['SmartPlug', 'EnergyMonitor', 'MultiLevelSwitch', 'OnOffSwitch'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForOffThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    await things[0].click();
    await waitForExpect(async () => {
      const on = await getProperty(desc.id, 'power');
      expect(on).toBeTruthy();
    });
    await thingsPage.waitForOnThings();

    await setProperty(desc.id, 'energyPower', 50);
    await waitForExpect(async () => {
      const things = await thingsPage.things();
      const level = await things[0].thingPowerDisplayed();
      expect(level).toEqual('50 W');
    });

    await setProperty(desc.id, 'power', false);
    await thingsPage.waitForOffThings();

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

    // Check power property
    const powerProperty = await detailPage.powerProperty();
    const power1 = await powerProperty.getDisplayedText();
    expect(power1).toEqual('50W');
    await setProperty(desc.id, 'energyPower', 60);
    await waitForExpect(async () => {
      const power2 = await powerProperty.getDisplayedText();
      expect(power2).toEqual('60W');
    });

    // Check voltage property
    const voltageProperty = await detailPage.voltageProperty();
    const voltage1 = await voltageProperty.getDisplayedText();
    expect(voltage1).toEqual('0V');
    await setProperty(desc.id, 'energyVoltage', 30);
    await waitForExpect(async () => {
      const voltage2 = await voltageProperty.getDisplayedText();
      expect(voltage2).toEqual('30V');
    });

    // Check current property
    const currentProperty = await detailPage.currentProperty();
    const current1 = await currentProperty.getDisplayedText();
    expect(current1).toEqual('0.0A');
    await setProperty(desc.id, 'energyCurrent', 40);
    await waitForExpect(async () => {
      const current2 = await currentProperty.getDisplayedText();
      expect(current2).toEqual('40.0A');
    });

    // Check current property
    const frequencyProperty = await detailPage.frequencyProperty();
    const frequency1 = await frequencyProperty.getDisplayedText();
    expect(frequency1).toEqual('0Hz');
    await setProperty(desc.id, 'energyFrequency', 10);
    await waitForExpect(async () => {
      const frequency2 = await frequencyProperty.getDisplayedText();
      expect(frequency2).toEqual('10Hz');
    });
  });

  it('should render a binarySensor and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'binarySensor',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForOffThings();
    let things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    await setProperty(desc.id, 'active', true);
    await thingsPage.waitForOnThings();

    await setProperty(desc.id, 'active', false);
    await thingsPage.waitForOffThings();

    things = await thingsPage.things();
    const detailPage = await things[0].openDetailPage();
    expect(detailPage).toBeTruthy();
  });

  it('should render a multiLevelSensor and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'multiLevelSensor',
      title: 'foofoo',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
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
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    await setProperty(desc.id, 'percent', 50);
    await waitForExpect(async () => {
      const things = await thingsPage.things();
      const level = await things[0].thingLevelDisplayed();
      expect(level).toEqual('50%');
    });

    const things2 = await thingsPage.things();
    const detailPage = await things2[0].openDetailPage();
    expect(detailPage).toBeTruthy();
  });

  it('should render a humidity sensor and be able to change properties', async () => {
    const browser = getBrowser();
    const desc = {
      id: 'humiditySensor',
      title: 'Humidity',
      '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
      '@type': ['HumiditySensor'],
      properties: {
        humidity: {
          '@type': 'HumidityProperty',
          value: 0,
          type: 'number',
          unit: 'percent',
        },
      },
    };
    await addThing(desc);

    const thingsPage = new ThingsPage(browser);
    await thingsPage.wait();
    await thingsPage.open();

    await thingsPage.waitForThings();
    const things = await thingsPage.things();
    expect(things.length).toEqual(1);
    const thingTitle = await things[0].thingTitle();
    expect(thingTitle).toEqual(desc.title);

    await setProperty(desc.id, 'humidity', 50);
    await waitForExpect(async () => {
      const things = await thingsPage.things();
      const level = await things[0].thingLevelDisplayed();
      expect(level).toEqual('50%');
    });

    const things2 = await thingsPage.things();
    const detailPage = await things2[0].openDetailPage();
    expect(detailPage).toBeTruthy();
  });

  describe('Assets based things', () => {
    let assetServer: Server;

    beforeAll(async () => {
      const app = express();
      app.use('/assets', express.static(path.join(__dirname, 'assets')));
      assetServer = app.listen();

      return new Promise((resolve, reject) => {
        assetServer.once('listening', resolve).once('error', reject);
      });
    });

    it('should render camera image and show image', async () => {
      const browser = getBrowser();
      const desc = {
        id: 'Camera',
        title: 'Camera',
        '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
        '@type': ['Camera'],
        properties: {
          photo: {
            '@type': 'ImageProperty',
            type: 'null',
            forms: [
              {
                href: `http://localhost:${
                  (<AddressInfo>assetServer.address()!).port
                }/assets/image.png`,
                contentType: 'image/png',
              },
            ],
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
      const detailPage = await things[0].openDetailPage();
      expect(detailPage).toBeTruthy();
      const photoProperty = await detailPage.photoProperty();
      expect(photoProperty).toBeTruthy();
      await photoProperty.click();

      await browser.waitUntil(
        async () => {
          const el = await browser.$('.media-modal-image');
          console.log(!el.error, el.error?.message);

          return !el.error;
        },
        { timeout: 6000000 }
      );
      const img = await browser.$('.media-modal-image');
      expect(await img.getAttribute('src')).toBeTruthy();
    });

    it('should render video camera and show video', async () => {
      const browser = getBrowser();
      const desc = {
        id: 'VideoCamera',
        title: 'VideoCamera',
        '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
        '@type': ['VideoCamera'],
        properties: {
          video: {
            '@type': 'VideoProperty',
            type: 'null',
            forms: [
              {
                href: `http://localhost:${
                  (<AddressInfo>assetServer.address()!).port
                }/assets/test.m3u8`,
                contentType: 'application/vnd.apple.mpegurl',
              },
            ],
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
      const detailPage = await things[0].openDetailPage();

      expect(detailPage).toBeTruthy();
      const videoProperty = await detailPage.videoProperty();
      expect(videoProperty).toBeTruthy();
      await videoProperty.click();

      await browser.waitUntil(
        async () => {
          const el = await browser.$('.media-modal-video');
          return !el.error;
        },
        { timeout: 6000000 }
      );

      const videoElement = await browser.$('.media-modal-video');
      const result = await videoElement.executeAsync(function (done) {
        // Browser context disabling unwanted ts features
        /* eslint-disable @typescript-eslint/ban-ts-comment, no-undefined */
        const video = document.querySelector('.media-modal-video');
        // @ts-ignore
        video.addEventListener('error', function (error) {
          done(error);
        });

        // @ts-ignore
        video.addEventListener('playing', function () {
          done(undefined);
        });

        // @ts-ignore
        video.play().catch((e) => {
          done(e);
        });
        /* eslint-enable @typescript-eslint/ban-ts-comment, no-undefined */
      });
      expect(result).toBeUndefined();
    });

    afterAll(() => {
      assetServer.close();
    });
  });
});
