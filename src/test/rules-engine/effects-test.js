const effects = require('../../rules-engine/effects');

const pulseEffect = {
  property: {
    name: 'on',
    type: 'boolean',
    href: '/things/light1/properties/on'
  },
  type: 'PulseEffect',
  value: true
};

const setEffect = {
  property: {
    name: 'temp',
    type: 'number',
    href: '/things/thermostat/properties/temp',
    unit: 'celsius',
    description: 'thermostat setpoint'
  },
  type: 'SetEffect',
  value: 30
};

describe('effects', function() {
  it('should parse a PulseEffect', () => {
    let effect = effects.fromDescription(pulseEffect);
    expect(effect).toMatchObject(pulseEffect);
  });

  it('should parse a SetEffect', () => {
    let effect = effects.fromDescription(setEffect);
    expect(effect).toMatchObject(setEffect);
  });

  it('should reject an unknown effect type', () => {
    let err = null;
    try {
      effects.fromDescription({type: 'LimaEffect'});
    } catch(e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });

  it('should reject a value type disagreeing with property type', () => {
    let err = null;
    try {
      effects.fromDescription(Object.assign(
        {},
        pulseEffect,
        {value: 12}
      ));
    } catch(e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });

  it('should reject an effect without a property', () => {
    let err = null;
    try {
      let brokenEffect = Object.assign(
        {},
        setEffect
      );
      delete brokenEffect.property;

      effects.fromDescription(brokenEffect);
    } catch(e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });
});
