const effects = require('../../rules-engine/effects');

function transformEffect(effect) {
  const transformed = JSON.parse(JSON.stringify(effect));
  transformed.property.href = transformed.property.links[0].href;
  delete transformed.property.links;
  return transformed;
}

const pulseEffect = {
  property: {
    name: 'on',
    type: 'boolean',
    links: [
      {
        rel: 'property',
        href: '/things/light1/properties/on',
      },
    ],
  },
  type: 'PulseEffect',
  value: true,
};

const setEffect = {
  property: {
    name: 'temp',
    type: 'number',
    links: [
      {
        rel: 'property',
        href: '/things/thermostat/properties/temp',
      },
    ],
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

const transformedBothEffect = {
  effects: [
    transformEffect(pulseEffect),
    transformEffect(setEffect),
  ],
  type: 'MultiEffect',
};

describe('effects', function() {
  it('should parse a PulseEffect', () => {
    const effect = effects.fromDescription(pulseEffect);
    expect(effect).toMatchObject(transformEffect(pulseEffect));
  });

  it('should parse a SetEffect', () => {
    const effect = effects.fromDescription(setEffect);
    expect(effect).toMatchObject(transformEffect(setEffect));
  });

  it('should parse a MultiEffect', () => {
    const effect = effects.fromDescription(bothEffect);
    expect(effect).toMatchObject(transformedBothEffect);
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
