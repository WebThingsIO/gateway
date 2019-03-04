const DatabaseMigrate = require('../../rules-engine/DatabaseMigrate');

const oldRule = {
  enabled: true,
  trigger: {
    type: 'MultiTrigger',
    op: 'AND',
    triggers: [{
      property: {
        name: 'on',
        type: 'boolean',
        href: '/things/light1/properties/on',
      },
      type: 'PulseEffect',
      value: true,
    }],
  },
  effect: {
    type: 'MultiEffect',
    effects: [{
      type: 'ActionEffect',
      thing: {
        href: '/things/light1',
      },
      action: 'blink',
    }],
  },
};

const newRule = {
  enabled: true,
  trigger: {
    type: 'MultiTrigger',
    op: 'AND',
    triggers: [{
      property: {
        type: 'boolean',
        thing: 'light1',
        id: 'on',
      },
      type: 'PulseEffect',
      value: true,
    }],
  },
  effect: {
    type: 'MultiEffect',
    effects: [{
      type: 'ActionEffect',
      thing: 'light1',
      action: 'blink',
    }],
  },
};

describe('rule migrate', () => {
  it('should correctly migrate a rule', () => {
    const newOldRule = DatabaseMigrate.migrate(oldRule);
    expect(newOldRule).toMatchObject(newRule);
  });

  it('should not migrate a new-style rule', () => {
    const changed = DatabaseMigrate.migrate(newRule);
    expect(changed).toBeFalsy();
  });
});
