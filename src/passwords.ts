/**
 * Password utilities.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';

const rounds = 2;

/**
 * Hash a password asynchronously
 * @param {String} password
 * @return {Promise<String>} hashed password
 */
export function hash(password: string): Promise<string> {
  return bcrypt.hash(password, rounds);
}

/**
 * Hash a password synchronously.
 * WARNING: This will block for a very long time
 *
 * @param {String} password
 * @return {String} hashed password
 */
export function hashSync(password: string): string {
  return bcrypt.hashSync(password, rounds);
}

/**
 * Compare two password hashes asynchronously
 * @param {String} passwordText - a plain text password
 * @param {String} passwordHash - the expected hash
 * @return {Promise<boolean>} If the hashes are equal
 */
export function compare(passwordText: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(passwordText, passwordHash);
}

/**
 * Compare two password hashes
 * @param {String} passwordText - a plain text password
 * @param {String} passwordHash - the expected hash
 * @return {boolean} If the hashes are equal
 */
export function compareSync(passwordText: string, passwordHash: string): boolean {
  return bcrypt.compareSync(passwordText, passwordHash);
}

/**
 * Verify a TOTP token
 * @param {string} sharedSecret - the MFA shared secret
 * @param {object} token - an MFA token, must contain a totp member
 * @return {boolean} If the token has been verified
 */
export function verifyMfaToken(sharedSecret: string, token: { totp: string }): boolean {
  // only supporting TOTP for now
  if (token.totp) {
    return speakeasy.totp.verify({
      secret: sharedSecret,
      encoding: 'base32',
      window: 1,
      token: token.totp,
    });
  }

  return false;
}
