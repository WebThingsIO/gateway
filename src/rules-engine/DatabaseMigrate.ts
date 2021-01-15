import {RuleDescription} from './Rule';
import {TriggerDescription} from './triggers/Trigger';
import {TimeTriggerDescription} from './triggers/TimeTrigger';

// TODO: remove these
type EffectDescription = any;
type Property = any;

function extractProperty(href: string): string {
  return href.match(/properties\/([^/]+)/)![1];
}

function extractThing(href: string): string {
  return href.match(/things\/([^/]+)/)![1];
}

function migrateTimeTrigger(trigger: TimeTriggerDescription): TimeTriggerDescription|null {
  if (trigger.localized) {
    return null;
  }

  // If the time trigger has not been localized, it's still in UTC time
  const parts = trigger.time.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  // Convert from UTC to local
  const oldTime = new Date();
  const offset = oldTime.getTimezoneOffset();
  oldTime.setUTCHours(hours, minutes, 0, 0);
  const newTime = new Date(oldTime.getTime() + (offset * 60 * 1000));

  const hoursStr = newTime.getHours().toString().padStart(2, '0');
  const minutesStr = newTime.getMinutes().toString().padStart(2, '0');

  return {
    type: 'TimeTrigger',
    time: `${hoursStr}:${minutesStr}`,
    localized: true,
  };
}

function migrateProperty(prop: Property): Property|null {
  if (!prop.href) {
    return null;
  }

  const base = Object.assign({}, prop);
  delete base.href;

  return Object.assign(base, {
    id: extractProperty(prop.href),
    thing: extractThing(prop.href),
  });
}

function migrateThing(thing: Record<string, unknown>): string|null {
  if (typeof thing !== 'object') {
    return null;
  }

  if (!thing.href) {
    return null;
  }

  return extractThing(<string>thing.href);
}

function migratePart(part: TriggerDescription|EffectDescription):
TriggerDescription|EffectDescription|null {
  let changed = false;
  const newPart = Object.assign({}, part);
  if (part.triggers) {
    newPart.triggers = part.triggers.map((child: TriggerDescription) => {
      const newChild = migratePart(child);
      if (newChild) {
        changed = true;
      }

      return newChild || child;
    });
  }

  if (part.effects) {
    newPart.effects = part.effects.map((child: EffectDescription) => {
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
    return null;
  }

  return newPart;
}

export function migrate(oldRule: RuleDescription): RuleDescription|null {
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
    return null;
  }

  return newRule;
}
