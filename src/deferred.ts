/**
 * Wraps up a promise in a slightly more convenient manner for passing
 * around, or saving.
 *
 * @module Deferred
 */

let id = 0;

export default class Deferred<T, E> {
  private id = ++id;

  private promise: Promise<T>;

  private resolveFunc?: ((_value: T) => void);

  private rejectFunc?: ((_reason: E) => void);

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolveFunc = resolve;
      this.rejectFunc = reject;
    });
  }

  resolve(arg: T): void {
    if (this.resolveFunc) {
      return this.resolveFunc(arg);
    }
  }

  reject(arg: E): void {
    if (this.rejectFunc) {
      return this.rejectFunc(arg);
    }
  }

  getId(): number {
    return this.id;
  }

  getPromise(): Promise<T> {
    return this.promise;
  }
}
