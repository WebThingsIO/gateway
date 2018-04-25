require('../jsdom-common');
const {_fireEvent, sleep, addThing} = require('./test-utils');


describe('OnOffSwitch', () => {
  let thing;
  const desc = {
    id: 'onOffSwitchId',
    name: 'onOffSwitchName',
    type: 'onOffSwitch',
    properties: {
      on: {type: 'boolean', value: false},
    },
    actions: {
      blink: {
        description: 'Blink the switch on and off',
      },
    },
    events: {
      surge: {
        description: 'Surge in power detected',
      },
    },
  };

  beforeEach(async () => {
    thing = await addThing(desc);
  });

  it('should render a thing name', () => {
    const node = document.body.querySelector('#things .thing-name');
    expect(node.textContent).toEqual('onOffSwitchName');
  });

  it('should be switch off with input false', async () => {
    await sleep(200);
    const node = document.body.querySelector('.on-off-switch.off');
    expect(node).not.toBeNull();
  });

  it('should handle a click event', async () => {
    await sleep(200);
    let node = document.body.querySelector('.on-off-switch.off');
    expect(node).not.toBeNull();
    thing.element.click();
    await sleep(200);
    node = document.body.querySelector('.on-off-switch.on');
    expect(node).not.toBeNull();
  });
});
