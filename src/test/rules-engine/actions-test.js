const actions = require('../../rules-engine/actions');

const pulseAction = {
  property: {
    name: 'on',
    type: 'boolean',
    href: '/things/light1/properties/on'
  },
  type: 'PulseAction',
  value: true
};

const setAction = {
  property: {
    name: 'temp',
    type: 'number',
    href: '/things/thermostat/properties/temp',
    unit: 'celsius',
    description: 'thermostat setpoint'
  },
  type: 'SetAction',
  value: 30
};

describe('actions', function() {
  it('should parse a PulseAction', () => {
    let action = actions.fromDescription(pulseAction);
    expect(action).toMatchObject(pulseAction);
  });

  it('should parse a SetAction', () => {
    let action = actions.fromDescription(setAction);
    expect(action).toMatchObject(setAction);
  });

  it('should reject an unknown action type', () => {
    let err = null;
    try {
      actions.fromDescription({type: 'LimaAction'});
    } catch(e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });

  it('should reject a value type disagreeing with property type', () => {
    let err = null;
    try {
      actions.fromDescription(Object.assign(
        {},
        pulseAction,
        {value: 12}
      ));
    } catch(e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });

  it('should reject an action without a property', () => {
    let err = null;
    try {
      let brokenAction = Object.assign(
        {},
        setAction
      );
      delete brokenAction.property;

      actions.fromDescription(brokenAction);
    } catch(e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });
});
