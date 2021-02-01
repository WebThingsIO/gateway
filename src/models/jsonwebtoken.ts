/**
 * JSONWebToken Model.
 *
 * Contains logic to create and verify JWT tokens.
 *
 * This file contains the logic to generate public/private key pairs and return
 * them in the format openssl/crypto expects.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {v4 as uuidv4} from 'uuid';
import * as jwt from 'jsonwebtoken';

import * as ec from '../ec-crypto';
import Database from '../db';
import * as Settings from './settings';

const ROLE_USER_TOKEN = 'user_token';

interface Payload {
  role: string;
  scope?: string;
  client_id?: string;
}

export interface TokenData {
  user: number;
  issuedAt: Date;
  publicKey: string;
  keyId: string;
  payload: Payload;
}

export default class JSONWebToken {
  private user: number;

  private issuedAt: Date;

  private publicKey: string;

  private keyId: string;

  private payload: Payload | null;

  getUser(): number {
    return this.user;
  }

  getIssuedAt(): Date {
    return this.issuedAt;
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  getKeyId(): string {
    return this.keyId;
  }

  getPayload(): Payload | null {
    return this.payload;
  }

  /**
   * Verify a JWT by it's signature.
   *
   * @return {JSONWebToken|null} null when invalid JSONWebToken when valid.
   */
  static async verifyJWT(sig: string): Promise<JSONWebToken | null> {
    const decoded = jwt.decode(sig, {
      complete: true,
      json: true,
    });

    if (!decoded || !decoded.header || !decoded.header.kid) {
      return null;
    }

    const {kid} = decoded.header;

    const tokenData = <TokenData><unknown>(await Database.getJSONWebTokenByKeyId(kid));
    if (!tokenData) {
      return null;
    }

    const token = new JSONWebToken(tokenData);
    token.payload = token.verify(sig);
    if (token.payload) {
      return token;
    }

    return null;
  }

  /**
   * Issue a JWT token and store it in the database.
   *
   * @param {User} user to issue token for.
   * @return {string} the JWT token signature.
   */
  static async issueToken(user: number): Promise<string> {
    const {sig, token} = await this.create(user);
    await Database.createJSONWebToken(token);
    return sig;
  }

  /**
   * Issue a JWT token for an OAuth2 client and store it in the
   * database.
   *
   * @param {ClientRegistry} client to issue token for.
   * @param {number} user user id associated with token
   * @param {Payload} payload of token
   * @return {string} the JWT token signature.
   */
  static async issueOAuthToken(client: {id: string}, user: number, payload: Payload):
  Promise<string> {
    const {sig, token} = await this.create(user, Object.assign({
      client_id: client.id,
    }, payload));
    await Database.createJSONWebToken(token);
    return sig;
  }

  /**
   * Remove a JWT token from the database by it's key id.
   *
   * @param {string} keyId of the record to remove.
   * @return bool true when a record was deleted.
   */
  static async revokeToken(keyId: string): Promise<boolean> {
    return await Database.deleteJSONWebTokenByKeyId(keyId);
  }

  /**
   * @param number user id of the user to create a token for.
   * @return {Object} containing .sig (the jwt signature) and .token
   *  for storage in the database.
   */
  static async create(user: number, payload = {role: ROLE_USER_TOKEN}):
  Promise<{sig: string, token: TokenData}> {
    const pair = ec.generateKeyPair();

    const keyId = uuidv4();
    const issuer = await Settings.getTunnelInfo();
    const options: jwt.SignOptions = {
      algorithm: ec.JWT_ALGORITHM,
      keyid: keyId,
    };
    if (issuer) {
      options.issuer = issuer;
    }

    const sig = jwt.sign(payload, pair.private, options);

    const token = {
      user,
      issuedAt: new Date(),
      publicKey: pair.public,
      keyId,
      payload,
    };

    return {sig, token};
  }

  constructor(obj: TokenData) {
    const {user, issuedAt, publicKey, keyId} = obj;
    this.user = user;
    this.issuedAt = issuedAt;
    this.publicKey = publicKey;
    this.keyId = keyId;
    this.payload = null;
  }

  /**
   * Verify that the given JWT matches this token.
   *
   * @param string sig jwt token.
   * @returns {Object|null} jwt payload if signature matches.
   */
  verify(sig: string): Payload | null {
    try {
      return <Payload>jwt.verify(sig, this.publicKey, {
        algorithms: [ec.JWT_ALGORITHM],
      });
    } catch (err) {
      // If this error is thrown we know the token is invalid.
      if (err.name === 'JsonWebTokenError') {
        return null;
      }
      throw err;
    }
  }
}
