/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Mirrors the WS API but automatically reopens on connection
 * interruption/error
 */
class ReopeningWebSocket {
  constructor(href) {
    this.href = href;
    this.ws = null;
    this.closing = false;
    this.opening = false;

    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.reopen = this.reopen.bind(this);
    this.closePermanently = this.closePermanently.bind(this);

    this.listeners = {
      open: [],
      message: [],
    };

    this.open();
  }

  open() {
    if (this.closing) {
      return;
    }

    this.opening = true;
    this.ws = new WebSocket(this.href);
    window.addEventListener('beforeunload', this.closePermanently);
    this.ws.addEventListener('open', this.onOpen);
    this.ws.addEventListener('message', this.onMessage);
    this.ws.addEventListener('close', this.reopen);
    this.ws.addEventListener('error', this.reopen);
  }

  /**
   * @param {string} name - Name of event to listen for
   * @param {Function} listener - Called when underlying websocket emits event
   */
  addEventListener(name, listener) {
    if (name !== 'open' && name != 'message') {
      throw new Error(`Event ${name} not supported`);
    }

    if (name === 'open' && !this.opening) {
      // readyState would cause race condition
      listener();
    }

    this.listeners[name].push(listener);
  }

  onOpen() {
    this.backoff = 1000;
    this.opening = false;
    for (const listener of this.listeners.open) {
      listener();
    }
  }

  onMessage(event) {
    for (const listener of this.listeners.message) {
      listener(event);
    }
  }

  reopen() {
    this.ws.removeEventListener('open', this.onOpen);
    this.ws.removeEventListener('message', this.onMessage);
    this.ws.removeEventListener('close', this.reopen);
    this.ws.removeEventListener('error', this.reopen);
    this.ws.close();
    this.ws = null;
    window.removeEventListener('beforeunload', this.closePermanently);

    setTimeout(() => {
      this.backoff *= 2;
      if (this.backoff > 30000) {
        this.backoff = 30000;
      }
      this.open();
    }, this.backoff);
  }

  send(msg) {
    return this.ws.send(msg);
  }

  closePermanently() {
    this.closing = true;
    this.listeners = {};

    if (this.ws) {
      this.ws.removeEventListener('open', this.onOpen);
      this.ws.removeEventListener('message', this.onMessage);
      this.ws.removeEventListener('close', this.reopen);
      this.ws.removeEventListener('error', this.reopen);
      if (this.ws.readyState === WebSocket.OPEN ||
          this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }
  }
}

module.exports = ReopeningWebSocket;
