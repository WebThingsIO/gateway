const effects = require('../../rules-engine/effects');

const pulseEffect = {
  property: {
    type: 'boolean',
    thing: 'light1',
    id: 'on',
  },
  type: 'PulseEffect',
  value: true,
};

const setEffect = {
  property: {
    type: 'number',
    thing: 'thermostat',
    id: 'temp',
    unit: 'celsius',
    description: 'thermostat setpoint',
  },
  type: 'SetEffect',
  value: 30,
};

const bothEffect = {
  effects: [
    pulseEffect,
    setEffect,
  ],
  type: 'MultiEffect',
};

describe('effects', () => {
  it('should parse a PulseEffect', () => {
    const effect = effects.fromDescription(pulseEffect);
    expect(effect).toMatchObject(pulseEffect);
  });

  it('should parse a SetEffect', () => {
    const effect = effects.fromDescription(setEffect);
    expect(effect).toMatchObject(setEffect);
  });

  it('should parse a MultiEffect', () => {
    const effect = effects.fromDescription(bothEffect);
    expect(effect).toMatchObject(bothEffect);
  });

  it('should reject an unknown effect type', () => {
    let err = null;
    try {
      effects.fromDescription({type: 'LimaEffect'});
    } catch (e) {
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
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });

  it('should reject an effect without a property', () => {
    let err = null;
    try {
      const brokenEffect = Object.assign(
        {},
        setEffect
      );
      delete brokenEffect.property;

      effects.fromDescription(brokenEffect);
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });
});
