/**
 * Rule utilities
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Icons = require('../icons');

const RuleUtils = {
  icon: (description) => {
    if (description.selectedCapability) {
      if (Icons.capabilityHasIcon(description.selectedCapability) ||
          !description.iconHref) {
        return Icons.capabilityToIcon(description.selectedCapability);
      } else {
        return description.iconHref;
      }
    } else if (!description.iconHref) {
      return Icons.defaultIcon();
    } else {
      return description.iconHref;
    }
  },
  // Helper function for selecting the thing corresponding to a property
  byProperty: (property) => (option) => {
    if (!property) {
      console.warn('byProperty property undefined', new Error().stack);
      return false;
    }
    const propHref =
      `/things/${encodeURIComponent(property.thing)}/properties/${
        encodeURIComponent(property.id)}`;
    const optProp = option.properties[property.id];
    return optProp && optProp.links.filter((l) => {
      return (!l.rel || l.rel === 'property') && l.href === propHref;
    }).length > 0;
  },
  // Helper function for selecting the thing corresponding to an href
  byThing: (thing) => (otherThing) => {
    return otherThing.href === `/things/${encodeURIComponent(thing)}`;
  },
  thingFromPart: (gateway, part) => {
    let thing = null;
    if (part.type === 'EventTrigger' || part.type === 'ActionEffect') {
      thing = gateway.things.filter(
        RuleUtils.byThing(part.thing)
      )[0];
    } else if (part.property) {
      thing = gateway.things.filter(
        RuleUtils.byProperty(part.property)
      )[0];
    }
    return thing;
  },
  extractProperty: (href) => {
    return decodeURIComponent(href.match(/properties\/([^/]+)/)[1]);
  },
  extractThing: (href) => decodeURIComponent(href.match(/things\/([^/]+)/)[1]),
};

module.exports = RuleUtils;
