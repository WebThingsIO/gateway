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

/* globals App, NewThing */

var AddThingScreen = {

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
    this.pairingTimeout = null;
    this.visibleThings = new Set();
    // Add event listeners
    this.backButton.addEventListener('click', this.hide.bind(this));
    this.cancelButton.addEventListener('click', this.hide.bind(this));
    this.addonsHintAnchor.addEventListener('click', this.hide.bind(this));
  },

  /**
   * Create a new "pair" action on the gateway.
   */
  requestPairing: function() {
    this.scanStatus.classList.remove('hidden');
    this.addonsHint.classList.add('hidden');

    let proto = 'ws:';
    if (window.location.protocol === 'https:') {
      proto = 'wss:';
    }
    const path = `${proto}//${App.HOST}/new_things?jwt=${window.API.jwt}`;

    // Create a websocket to start listening for new things
    this.socket = new WebSocket(path);
    this.socket.onmessage = (function(event) {
      this.showNewThing(JSON.parse(event.data));
    }).bind(this);

    // Timeout, in seconds.
    const timeout = 60;

    var action = {
      'name': 'pair',
      'parameters': {
        'timeout': timeout,
      },
    };
    fetch('/actions', {
      method: 'POST',
      body: JSON.stringify(action),
      headers: {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response.json();
    }).then((json) => {
      AddThingScreen.actionUrl = json.href;

      this.pairingTimeout = setTimeout(() => {
        this.scanStatus.classList.add('hidden');

        if (this.visibleThings.size === 0) {
          this.addonsHint.classList.remove('hidden');
        }

        this.pairingTimeout = null;
        this.requestCancelPairing();
      }, timeout * 1000);

      console.log('Pairing request created with URL ' + json.href);
    })
    .catch(function(error) {
      console.error('Pairing request failed: ' + error);
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

    var url = AddThingScreen.actionUrl;
    if(!url) {
      return;
    }
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.API.jwt}`
      }
    })
    .then(function(response) {
      if (response.ok) {
        AddThingScreen.actionUrl = null;
        console.log('Successfully cancelled pairing request.');
      } else {
        console.error('Error cancelling pairing request ' +
          response.statusText);
      }
    })
    .catch(function(error) {
      console.error('Error cancelling pairing request ' + error);
    });
  },

  /**
   * Show Add Thing Screen.
   */
  show: function() {
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
    var newEvent = new CustomEvent('_thingchange');
    window.dispatchEvent(newEvent);
  },

  showNewThing: function(thing) {
    if (!this.visibleThings.has(thing.id)) {
      this.visibleThings.add(thing.id);
      new NewThing(thing.id, thing);
    }
  }

};
