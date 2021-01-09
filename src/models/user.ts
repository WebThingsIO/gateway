/**
 * User Model.
 *
 * Represents a user.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import crypto from 'crypto';
import Database from '../db';
import * as Passwords from '../passwords';
import speakeasy from 'speakeasy';

export = class User {
  private id: number|null;

  private email: string;

  private password: string;

  private mfaEnrolled: boolean;

  private mfaSharedSecret: string;

  private mfaBackupCodes: string[];

  private name: string|null;

  constructor(id: number|null, email: string, password: string,
              name: string|null, mfaSharedSecret: string,
              mfaEnrolled: number|boolean, mfaBackupCodes: string) {
    this.id = id;
    this.email = email;
    this.password = password; // Hashed
    this.mfaSharedSecret = mfaSharedSecret;
    this.mfaEnrolled =
      typeof mfaEnrolled === 'number' ? mfaEnrolled === 1 : mfaEnrolled;
    this.mfaBackupCodes = mfaBackupCodes ? JSON.parse(mfaBackupCodes) : [];
    this.name = name;
  }

  static async generate(email: string, rawPassword: string, name: string): Promise<User> {
    const hash = await Passwords.hash(rawPassword);
    return new User(null, email, hash, name, '', false, '');
  }

  /**
   * Get a JSON description for this user.
   *
   * @return {Object} JSON description of user.
   */
  getDescription(): {id: number|null, email: string, name: string|null, mfaEnrolled: boolean} {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      mfaEnrolled: this.mfaEnrolled,
    };
  }

  async generateMfaParams(): Promise<{secret: string, url: string}> {
    const secret = speakeasy.generateSecret({
      issuer: 'WebThings Gateway',
      name: `WebThings:${this.email}`,
      length: 64,
    });

    this.mfaSharedSecret = secret.base32;
    await Database.editUser(this);

    return {
      secret: this.mfaSharedSecret,
      url: secret.otpauth_url!,
    };
  }

  async generateMfaBackupCodes(): Promise<string[]> {
    const codes = new Set<string>();
    while (codes.size !== 10) {
      codes.add(crypto.randomBytes(6).toString('hex'));
    }

    this.mfaBackupCodes = [];
    for (const code of codes) {
      this.mfaBackupCodes.push(await Passwords.hash(code));
    }

    await Database.editUser(this);

    return Array.from(codes);
  }

  getId(): number|null {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getPassword(): string {
    return this.password;
  }

  getName(): string|null {
    return this.name;
  }

  getMfaSharedSecret(): string {
    return this.mfaSharedSecret;
  }

  getMfaBackupCodes(): string[] {
    return this.mfaBackupCodes;
  }

  getMfaEnrolled(): boolean {
    return this.mfaEnrolled;
  }
};
