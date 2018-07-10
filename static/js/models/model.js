/**
 * Abstract Model class.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

class Model {
  constructor() {
    this.handlers = new Map();
    return this;
  }

  /**
   * Cleanup objects.
   */
  cleanup() {
    this.handlers.forEach((value) => {
      value.clear();
    });
    this.handlers.clear();
  }

  /**
   * Unsubscribe changing state events.
   * @param {string} event - an event the handler subscribed
   * @param {function} handler - the handler subscribed
   */
  unsubscribe(event, handler) {
    if (!this.handlers.has(event)) {
      return;
    }

    const eventHandlers = this.handlers.get(event);
    eventHandlers.delete(handler);
  }

  /**
   * Subscribe changing state events.
   * @param {string} event - an event the handler subscribe
   * @param {function} handler - the handler for getting state.
   */
  subscribe(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Map());
    }

    const eventHandlers = this.handlers.get(event);
    eventHandlers.set(handler, handler);
  }

  /**
   * Call the handlers which subscribed.
   * @param {string} event - an event
   * @param {*} state - a state which is pushed to handlers
   */
  async handleEvent(event, state) {
    if (!this.handlers.has(event)) {
      return;
    }
    const eventHandlers = this.handlers.get(event);
    for (const handler of eventHandlers.keys()) {
      try {
        await handler(state);
      } catch (e) {
        console.error(
          `Error occurred in handler event:${event} state:${state} ${e}`
        );
      }
    }
  }
}

module.exports = Model;
