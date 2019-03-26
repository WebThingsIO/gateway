/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

/**
 * A simple helper class for sending JSON-formatted errors to clients
 */
class APIError extends Error {
  constructor(message, originalError) {
    super(message);
    if (originalError) {
      this.message += `: ${originalError.message}`;
    }
    console.error(`new API Error: ${this.message}`);
  }

  toString() {
    return JSON.stringify({error: true, message: this.message});
  }
}

module.exports = APIError;
