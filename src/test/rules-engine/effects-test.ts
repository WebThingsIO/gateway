import * as Effects from '../../rules-engine/effects/index';
import { EffectDescription } from '../../rules-engine/effects/Effect';
import { PropertyEffectDescription } from '../../rules-engine/effects/PropertyEffect';

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
  effects: [pulseEffect, setEffect],
  type: 'MultiEffect',
};

describe('effects', () => {
  it('should parse a PulseEffect', () => {
    const effect = Effects.fromDescription(pulseEffect);
    expect(effect).toMatchObject(pulseEffect);
  });

  it('should parse a SetEffect', () => {
    const effect = Effects.fromDescription(setEffect);
    expect(effect).toMatchObject(setEffect);
  });

  it('should parse a MultiEffect', () => {
    const effect = Effects.fromDescription(bothEffect);
    expect(effect).toMatchObject(bothEffect);
  });

  it('should reject an unknown effect type', () => {
    let err = null;
    try {
      Effects.fromDescription({ type: 'LimaEffect' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });

  it('should reject a value type disagreeing with property type', () => {
    let err = null;
    try {
      Effects.fromDescription(Object.assign({}, pulseEffect, { value: 12 }));
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });

  it('should reject an effect without a property', () => {
    let err = null;
    try {
      const brokenEffect: Partial<PropertyEffectDescription> = Object.assign({}, setEffect);
      delete brokenEffect.property;

      Effects.fromDescription(<EffectDescription>brokenEffect);
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });
});
