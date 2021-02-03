/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * A simple helper class for sending JSON-formatted errors to clients
 */
export default class APIError extends Error {
  constructor(message: string, originalError?: Error) {
    super(message);
    if (originalError) {
      this.message += `: ${originalError.message}`;
    }
    console.error(`new API Error: ${this.message}`);
  }

  toString(): string {
    return JSON.stringify({ error: true, message: this.message });
  }
}
