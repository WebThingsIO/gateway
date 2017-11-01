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
    // Add event listeners
    this.backButton.addEventListener('click', this.hide.bind(this));
    this.cancelButton.addEventListener('click', this.hide.bind(this));
  },

  /**
   * Create a new "pair" action on the gateway.
   */
  requestPairing: function() {
    var path = `wss://${App.HOST}/new_things?jwt=${window.API.jwt}`;
    // Create a websocket to start listening for new things
    this.socket = new WebSocket(path);
    this.socket.onmessage = (function(event) {
      this.showNewThing(JSON.parse(event.data));
    }).bind(this);

    var action = {
      'name': 'pair'
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
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      AddThingScreen.actionUrl = json.href;
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
    // eslint-disable-next-line no-unused-vars
    var newThing = new NewThing(thing.id, thing);
  }

};
