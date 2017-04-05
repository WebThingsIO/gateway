/**
 * Wraps up a promise in a slightly more convenient manner for passing 
 * around, or saving. 
 *
 * @module Deferred
 */

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

module.exports = Deferred;
