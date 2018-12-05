const triggers = require('../../rules-engine/triggers');

function transformTrigger(trigger) {
  const transformed = JSON.parse(JSON.stringify(trigger));
  transformed.property.href = transformed.property.links[0].href;
  delete transformed.property.links;
  return transformed;
}

const booleanTrigger = {
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
  type: 'BooleanTrigger',
  onValue: true,
};

const levelTrigger = {
  property: {
    name: 'hue',
    type: 'number',
    links: [
      {
        rel: 'property',
        href: '/things/light2/properties/hue',
      },
    ],
  },
  type: 'LevelTrigger',
  levelType: 'LESS',
  value: 120,
};

const equalityTrigger = {
  property: {
    name: 'color',
    type: 'string',
    links: [
      {
        rel: 'property',
        href: '/things/light2/properties/color',
      },
    ],
  },
  type: 'EqualityTrigger',
  value: '#ff7700',
};

const andTrigger = {
  triggers: [
    booleanTrigger,
    levelTrigger,
  ],
  type: 'MultiTrigger',
  op: 'AND',
};

const transformedAndTrigger = {
  triggers: [
    transformTrigger(booleanTrigger),
    transformTrigger(levelTrigger),
  ],
  type: 'MultiTrigger',
  op: 'AND',
};

describe('triggers', function() {
  it('should parse a BooleanTrigger', () => {
    const trigger = triggers.fromDescription(booleanTrigger);
    expect(trigger).toMatchObject(transformTrigger(booleanTrigger));
  });

  it('should parse a LevelTrigger', () => {
    const trigger = triggers.fromDescription(levelTrigger);
    expect(trigger).toMatchObject(transformTrigger(levelTrigger));
  });

  it('should parse an EqualityTrigger', () => {
    const trigger = triggers.fromDescription(equalityTrigger);
    expect(trigger).toMatchObject(transformTrigger(equalityTrigger));
  });

  it('should parse a MultiTrigger', () => {
    const trigger = triggers.fromDescription(andTrigger);
    expect(trigger).toMatchObject(transformedAndTrigger);
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
        {value: true}
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
      const brokenTrigger = Object.assign(
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

