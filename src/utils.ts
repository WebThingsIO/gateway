/**
 * Various utilities.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import crypto from 'crypto';
import fs from 'fs';
import * as Platform from './platform';
import pkg from './package.json';
import { Event as EventSchema } from 'gateway-addon/lib/schema';
import * as Constants from './constants';

/**
 * Compute a SHA-256 checksum of a file.
 *
 * @param {String} fname File path
 * @returns A checksum as a lower case hex string.
 */
export function hashFile(fname: string): string | null {
  const hash = crypto.createHash('sha256');

  let fd;
  try {
    fd = fs.openSync(fname, 'r');
    const buffer = new Uint8Array(4096);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const bytes = fs.readSync(fd, buffer, 0, 4096, null);
      if (bytes <= 0) {
        break;
      }
      hash.update(buffer.slice(0, bytes));
    }
  } catch (e) {
    console.error(e);
    return null;
  } finally {
    if (fd) {
      fs.closeSync(fd);
    }
  }

  return hash.digest('hex').toLowerCase();
}

/**
 * Escape text such that it's safe to be placed in HTML.
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    text = `${text}`;
  }

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getGatewayUserAgent(): string {
  const primary = `webthings-gateway/${pkg.version}`;
  const secondary = `(${Platform.getArchitecture()}; ${Platform.getOS()})`;
  const tertiary = Platform.isContainer() ? ' (container)' : '';

  return `${primary} ${secondary}${tertiary}`;
}

export function isW3CThingDescription(thingDescription: {
  '@context': string | string[];
}): boolean {
  if (typeof thingDescription['@context'] === 'string') {
    return (
      thingDescription['@context'] === Constants.WOT_TD_1_CONTEXT ||
      thingDescription['@context'] === Constants.WOT_TD_1_1_CONTEXT ||
      thingDescription['@context'] === Constants.WOT_TD_NS_CONTEXT
    );
  }

  if (Array.isArray(thingDescription['@context'])) {
    return (
      thingDescription['@context'].includes(Constants.WOT_TD_1_CONTEXT) ||
      thingDescription['@context'].includes(Constants.WOT_TD_1_1_CONTEXT) ||
      thingDescription['@context'].includes(Constants.WOT_TD_NS_CONTEXT)
    );
  }

  return false;
}

/**
 * Make sure the @context value of a Thing Description contains both
 * W3C WoT TD 1.1 and WebThings contexts.
 *
 * @param context {(string|string[])} The non-standardised context value.
 * @returns string[] The standardised context array.
 */
export function standardizeContext(context: string | string[]): string[] {
  // If expected contexts already present then return null
  if (
    Array.isArray(context) &&
    context.includes(Constants.WOT_TD_1_1_CONTEXT) &&
    context.includes(Constants.WEBTHINGS_CONTEXT)
  ) {
    return context;
  }

  // If @context is a string, make it an array
  if (typeof context === 'string') {
    context = [context];
  }

  // Remove legacy iot.mozilla.org @context
  if (context.includes(Constants.MOZ_IOT_CONTEXT)) {
    context.splice(context.indexOf(Constants.MOZ_IOT_CONTEXT));
  }

  // If @context doesn't contain W3C TD 1.1 context then add it to the start
  if (!context.includes(Constants.WOT_TD_1_1_CONTEXT)) {
    context.unshift(Constants.WOT_TD_1_1_CONTEXT);
  }

  // If @context doesn't contain WebThings context then add it to the end
  if (!context.includes(Constants.WEBTHINGS_CONTEXT)) {
    context.push(Constants.WEBTHINGS_CONTEXT);
  }

  return context;
}

/**
 * Convert event descriptions from the legacy format in the Web Thing API
 * (https://webthings.io/api/#event-object) to the W3C WoT TD standard format
 * (https://w3c.github.io/wot-thing-description/#eventaffordance).
 *
 * @param {EventSchema} description
 * @returns {EventSchema}
 */
export function standardizeEventDescription(description: EventSchema): EventSchema {
  if (description.hasOwnProperty('href')) {
    delete description.href;
    console.warn('The href member of event descriptions is deprecated');
  }
  description.data = description.data || {};
  if (description.hasOwnProperty('type')) {
    description.data.type = description.type;
    delete description.type;
    console.warn('The type member of event descriptions is deprecated, please use data.type');
  }
  if (description.hasOwnProperty('unit')) {
    description.data.unit = description.unit;
    delete description.unit;
    console.warn('The unit member of event descriptions is deprecated, please use data.unit');
  }
  if (description.hasOwnProperty('minimum')) {
    description.data.minimum = description.minimum;
    delete description.minimum;
    console.warn('The minimum member of event descriptions is deprecated, please use data.minimum');
  }
  if (description.hasOwnProperty('maximum')) {
    description.data.maximum = description.maximum;
    delete description.maximum;
    console.warn('The maximum member of event descriptions is deprecated, please use data.maximum');
  }
  if (description.hasOwnProperty('multipleOf')) {
    description.data.multipleOf = description.multipleOf;
    delete description.multipleOf;
    console.warn(
      'The multipleOf member of event descriptions is deprecated, please use data.multipleOf'
    );
  }
  if (description.hasOwnProperty('enum')) {
    description.data.enum = description.enum;
    delete description.enum;
    console.warn('The enum member of event descriptions is deprecated, please use data.enum');
  }
  return description;
}
