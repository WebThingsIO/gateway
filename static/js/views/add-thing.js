/**
 * Add Thing Screen.
 *
 * UI for adding Things to the gateway.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('../api');
const App = require('../app');
const fluent = require('../fluent');
const NewThing = require('./new-thing');
const NewWebThing = require('./new-web-thing');
const SettingsScreen = require('./settings');

const AddThingScreen = {

  /**
   * URL of curent pair action request.
   */
  actionUrl: null,

  /**
   * Initialise Add Thing Screen.
   */
  init: function() {
    this.element = document.getElementById('add-thing-screen');
    this.backButton = document.getElementById('add-thing-back-button');
    this.cancelButton = document.getElementById('add-thing-cancel-button');
    this.newThingsElement = document.getElementById('new-things');
    this.scanStatus = document.getElementById('add-thing-status');
    this.addonsHint = document.getElementById('add-adapters-hint');
    this.addonsHintAnchor =
      document.getElementById('add-adapters-hint-anchor');
    this.addByUrlAnchor = document.getElementById('add-by-url-anchor');
    this.pairingTimeout = null;
    this.visibleThings = new Set();
    // Add event listeners
    this.backButton.addEventListener('click', this.hide.bind(this));
    this.cancelButton.addEventListener('click', this.hide.bind(this));
    this.addonsHintAnchor.addEventListener('click', this.hide.bind(this));
    this.addByUrlAnchor.addEventListener('click',
                                         this.showNewWebThing.bind(this));
    this.closing = false;
  },

  /**
   * Create a new "pair" action on the gateway.
   */
  requestPairing: function() {
    if (this.closing) {
      return;
    }

    this.scanStatus.classList.remove('hidden');
    this.addonsHint.classList.add('hidden');

    let proto = 'ws:';
    if (window.location.protocol === 'https:') {
      proto = 'wss:';
    }
    const path = `${proto}//${App.HOST}/new_things?jwt=${API.jwt}`;

    // Create a websocket to start listening for new things
    this.socket = new WebSocket(path);

    const close = () => {
      this.closing = true;

      if (!this.socket) {
        return;
      }

      if (this.socket.readyState === WebSocket.OPEN ||
          this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close();
      }
    };
    window.addEventListener('beforeunload', close);

    this.socket.onmessage = (event) => {
      this.showNewThing(JSON.parse(event.data));
    };

    // Timeout, in seconds.
    const timeout = 60;

    API.startPairing(timeout).then((json) => {
      this.actionUrl = json.pair.href;

      this.pairingTimeout = setTimeout(() => {
        this.scanStatus.classList.add('hidden');

        if (this.visibleThings.size === 0) {
          this.addonsHint.classList.remove('hidden');
        }

        this.pairingTimeout = null;
        this.requestCancelPairing();
      }, timeout * 1000);
    }).catch((error) => {
      console.error(`Pairing request failed: ${error}`);
    });
  },

  /**
   * Cancel a pairing request.
   */
  requestCancelPairing: function() {
    if (this.pairingTimeout !== null) {
      clearTimeout(this.pairingTimeout);
      this.pairingTimeout = null;
    }

    // Close websocket.
    if (typeof this.socket !== 'undefined') {
      this.socket.close();
      delete this.socket;
    }

    const url = this.actionUrl;
    if (!url) {
      return;
    }

    API.cancelPairing(url).then(() => {
      this.actionUrl = null;
    }).catch((error) => {
      console.error(`Error cancelling pairing request ${error}`);
    });
  },

  /**
   * Show Add Thing Screen.
   */
  show: function() {
    this.addByUrlAnchor.classList.add('hidden');
    SettingsScreen.fetchInstalledAddonList(true).then(() => {
      if (SettingsScreen.installedAddons.has('thing-url-adapter')) {
        const addon = SettingsScreen.installedAddons.get('thing-url-adapter');
        if (addon.enabled) {
          this.addByUrlAnchor.classList.remove('hidden');
        }
      }
    });

    this.cancelButton.textContent = fluent.getMessage('add-thing-cancel');

    this.element.classList.remove('hidden');
    this.newThingsElement.innerHTML = '';
    this.visibleThings.clear();
    this.requestPairing();
  },

  /**
   * Hide Add Thing Screen.
   */
  hide: function() {
    this.element.classList.add('hidden');
    this.requestCancelPairing();
    App.gatewayModel.refreshThings();
  },

  showNewThing: function(thing) {
    if (!this.visibleThings.has(thing.id)) {
      this.visibleThings.add(thing.id);
      new NewThing(thing.id, thing);
    }
  },

  showNewWebThing: (e) => {
    e.preventDefault();
    new NewWebThing();
  },
};

module.exports = AddThingScreen;
