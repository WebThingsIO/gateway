/**
 * Elliptic curve helpers for the ES256 curve.
 *
 * This file contains the logic to generate public/private key pairs and return
 * them in the format openssl/crypto expects.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import * as asn1 from 'asn1.js';
import * as crypto from 'crypto';

/**
 * This curve goes by different names in different standards.
 *
 * These are all equivilent for our uses:
 *
 * prime256v1 = ES256 (JWT) = secp256r1 (rfc5480) = P256 (NIST).
 */
const CURVE = 'prime256v1';

// https://tools.ietf.org/html/rfc5915#section-3
const ECPrivateKeyASN = asn1.define('ECPrivateKey', function() {
  this.seq().obj(
    this.key('version').int(),
    this.key('privateKey').octstr(),
    this.key('parameters').explicit(0).objid().optional(),
    this.key('publicKey').explicit(1).bitstr().optional()
  );
});

// https://tools.ietf.org/html/rfc3280#section-4.1
const SubjectPublicKeyInfoASN = asn1.define('SubjectPublicKeyInfo', function() {
  this.seq().obj(
    this.key('algorithm').seq().obj(
      this.key('id').objid(),
      this.key('namedCurve').objid()
    ),
    this.key('pub').bitstr()
  )
});

// Chosen because it is _must_ implement.
// https://tools.ietf.org/html/rfc5480#section-2.1.1
const UNRESTRICTED_ALGORITHM_ID = [1, 2, 840, 10045, 2, 1];
// https://tools.ietf.org/html/rfc5480#section-2.1.1.1 (secp256r1)
const SECP256R1_CURVE = [1, 2, 840, 10045, 3, 1, 7];

/**
 * Generate a public/private key pair.
 *
 * The returned keys are formatted in PEM for use with openssl (crypto).
 *
 * @return {Object} .public in PEM. .prviate in PEM.
 */
export function generateKeyPair() {
  const key = crypto.createECDH(CURVE);
  key.generateKeys();

  const priv = ECPrivateKeyASN.encode({
    version: 1,
    privateKey: key.getPrivateKey(),
    parameters: SECP256R1_CURVE,
  }, 'pem', {
    // https://tools.ietf.org/html/rfc5915#section-4
    label: 'EC PRIVATE KEY',
  });

  const pub = SubjectPublicKeyInfoASN.encode({
    pub: {
      unused: 0,
      data: key.getPublicKey(),
    },
    algorithm: {
      id: UNRESTRICTED_ALGORITHM_ID,
      namedCurve: SECP256R1_CURVE,
    },
  }, 'pem', {
    label: 'PUBLIC KEY',
  });

  return { public: pub, private: priv };
}

export const JWT_ALGORITHM = 'ES256';
