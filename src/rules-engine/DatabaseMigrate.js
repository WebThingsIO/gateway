'use strict';

function extractProperty(href) {
  return href.match(/properties\/([^/]+)/)[1];
}

function extractThing(href) {
  return href.match(/things\/([^/]+)/)[1];
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

  if (part.property) {
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
