/**
 * Various utilities.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');

module.exports = {
  /**
   * Compute a SHA-256 checksum of a file.
   *
   * @param {String} fname File path
   * @returns A checksum as a lower case hex string.
   */
  hashFile: (fname) => {
    const hash = crypto.createHash('sha256');

    let fd;
    try {
      fd = fs.openSync(fname, 'r');
      const buffer = new Uint8Array(4096);

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const bytes = fs.readSync(fd, buffer, 0, 4096);
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
  },

  /**
   * Escape text such that it's safe to be placed in HTML.
   */
  escapeHtml: (text) => {
    if (typeof text !== 'string') {
      text = `${text}`;
    }

    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },
};
