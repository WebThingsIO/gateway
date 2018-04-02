const triggers = require('../../rules-engine/triggers');

const booleanTrigger = {
  property: {
    name: 'on',
    type: 'boolean',
    href:
      '/things/light1/properties/on',
  },
  type: 'BooleanTrigger',
  onValue: true,
};

const levelTrigger = {
  property: {
    name: 'hue',
    type: 'number',
    href:
      '/things/light2/properties/hue',
  },
  type: 'LevelTrigger',
  levelType: 'LESS',
  level: 120,
};

describe('triggers', function() {
  it('should parse a BooleanTrigger', () => {
    let trigger = triggers.fromDescription(booleanTrigger);
    expect(trigger).toMatchObject(booleanTrigger);
  });

  it('should parse a LevelTrigger', () => {
    let trigger = triggers.fromDescription(levelTrigger);
    expect(trigger).toMatchObject(levelTrigger);
  });

  it('should reject an unknown trigger type', () => {
    let err = null;
    try {
      triggers.fromDescription({type: 'LimaTrigger'});
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });

  it('should reject a number type onValue', () => {
    let err = null;
    try {
      triggers.fromDescription(Object.assign(
        {},
        booleanTrigger,
        {onValue: 12}
      ));
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });

  it('should reject a boolean type level', () => {
    let err = null;
    try {
      triggers.fromDescription(Object.assign(
        {},
        levelTrigger,
        {level: true}
      ));
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });

  it('should reject an unknown levelType', () => {
    let err = null;
    try {
      triggers.fromDescription(Object.assign(
        {},
        levelTrigger,
        {levelType: 'GARBANZO'}
      ));
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });


  it('should reject an trigger without a property', () => {
    let err = null;
    try {
      let brokenTrigger = Object.assign(
        {},
        levelTrigger
      );
      delete brokenTrigger.property;

      triggers.fromDescription(brokenTrigger);
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });
});

