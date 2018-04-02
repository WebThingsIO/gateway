/**
 * Wraps up a promise in a slightly more convenient manner for passing
 * around, or saving.
 *
 * @module Deferred
 */

'use strict';

const DEBUG = false;

let id = 0;

class Deferred {
  constructor() {
    this.id = ++id;
    this.promise = new Promise((resolve, reject) => {
      this.resolveFunc = resolve;
      this.rejectFunc = reject;
    });
    if (DEBUG) {
      console.log('Deferred: Created deferred promise id:', this.id);
    }
  }

  resolve(arg) {
    if (DEBUG) {
      console.log('Deferred: Resolving deferred promise id:', this.id,
                  'arg:', arg);
    }
    return this.resolveFunc(arg);
  }

  reject(arg) {
    if (DEBUG) {
      console.log('Deferred: Rejecting deferred promise id:', this.id,
                  'arg:', arg);
    }
    return this.rejectFunc(arg);
  }
}

module.exports = Deferred;
