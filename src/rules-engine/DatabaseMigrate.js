'use strict';

function extractProperty(href) {
  return href.match(/properties\/([^/]+)/)[1];
}

function extractThing(href) {
  return href.match(/things\/([^/]+)/)[1];
}

function migrateTimeTrigger(trigger) {
  if (trigger.localized) {
    return;
  }

  // If the time trigger has not been localized, it's still in UTC time
  const parts = trigger.time.split(':');
  let hours = parseInt(parts[0], 10);
  let minutes = parseInt(parts[1], 10);

  // Convert from UTC to local
  const oldTime = new Date();
  const offset = oldTime.getTimezoneOffset();
  oldTime.setUTCHours(hours, minutes, 0, 0);
  const newTime = new Date(oldTime + (offset * 60 * 1000));

  hours = newTime.getHours().toString().padStart(2, '0');
  minutes = newTime.getMinutes().toString().padStart(2, '0');

  return {
    type: 'TimeTrigger',
    time: `${hours}:${minutes}`,
    localized: true,
  };
}

function migrateProperty(prop) {
  if (!prop.href) {
    return;
  }
  const base = Object.assign({}, prop);
  delete base.href;
  return Object.assign(base, {
    id: extractProperty(prop.href),
    thing: extractThing(prop.href),
  });
}

function migrateThing(thing) {
  console.log('migrateThing', thing);
  if (typeof thing !== 'object') {
    return;
  }
  if (!thing.href) {
    return;
  }
  return extractThing(thing.href);
}

function migratePart(part) {
  let changed = false;
  const newPart = Object.assign({}, part);
  if (part.triggers) {
    newPart.triggers = part.triggers.map((child) => {
      const newChild = migratePart(child);
      if (newChild) {
        changed = true;
      }
      return newChild || child;
    });
  }

  if (part.effects) {
    newPart.effects = part.effects.map((child) => {
      const newChild = migratePart(child);
      if (newChild) {
        changed = true;
      }
      return newChild || child;
    });
  }

  if (part.type === 'TimeTrigger') {
    const newTrigger = migrateTimeTrigger(part);
    if (newTrigger) {
      changed = true;
      Object.assign(newPart, newTrigger);
    }
  } else if (part.property) {
    const newProp = migrateProperty(part.property);
    if (newProp) {
      changed = true;
    }
    newPart.property = newProp || part.property;
  } else if (part.thing) {
    const newThing = migrateThing(part.thing);
    if (newThing) {
      changed = true;
    }
    newPart.thing = newThing || part.thing;
  }

  if (!changed) {
    return;
  }

  return newPart;
}

function migrate(oldRule) {
  const newRule = Object.assign({}, oldRule);
  const newTrigger = migratePart(oldRule.trigger);
  let changed = false;
  if (newTrigger) {
    changed = true;
    newRule.trigger = newTrigger;
  }
  const newEffect = migratePart(oldRule.effect);
  if (newEffect) {
    changed = true;
    newRule.effect = newEffect;
  }

  if (!changed) {
    return;
  }
  return newRule;
}

module.exports = {
  migrate,
};
