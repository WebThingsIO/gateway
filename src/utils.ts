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

/**
 * Compute a SHA-256 checksum of a file.
 *
 * @param {String} fname File path
 * @returns A checksum as a lower case hex string.
 */
export function hashFile(fname: string): string|null {
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
