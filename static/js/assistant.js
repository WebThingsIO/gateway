/**
 * Smart Assistant.
 *
 * A chat-style UI to control things with spoken and written commands.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');

// eslint-disable-next-line no-unused-vars
const AssistantScreen = {

  /**
   * Initialise Assistant Screen.
   */
  init: function() {
    this.messages = document.getElementById('assistant-messages');
    this.avatar = document.getElementById('assistant-avatar');
    this.speechButton = document.getElementById('assistant-speech-button');
    this.textInput = document.getElementById('assistant-text-input');
    this.textSubmit = document.getElementById('assistant-text-submit');

    this.textInput.addEventListener('keyup', this.handleInput.bind(this));
    this.textSubmit.addEventListener('click', this.handleSubmit.bind(this));
    this.speechButton.addEventListener('click', this.handleSpeech.bind(this));
    this.avatar.addEventListener('click', this.handleAvatarClick.bind(this));

    this.stm = null;
    // Dynamic loading
    import(/* webpackChunkName: "stm_web.min.js" */
      'speaktome-api/build/stm_web.min.js')
      .then((SpeakToMe) => {
        this.stm = SpeakToMe.default({
          listener: this.listener.bind(this),
        });
      });
    this.listening = false;
  },

  /**
   * Show Assistant screen.
   */
  show: function() {
    document.getElementById('speech-wrapper').classList.add('assistant');
    this.messages.scrollTop = this.messages.scrollHeight;
  },

  submitCommand: function(text) {
    const opts = {
      method: 'POST',
      cache: 'default',
      body: JSON.stringify({text}),
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch('/commands', opts).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    }).then((body) => {
      let verb, preposition = '';
      switch (body.payload.keyword) {
        case 'make':
          verb = 'making';
          break;
        case 'change':
          verb = 'changing';
          break;
        case 'set':
          verb = 'setting';
          preposition = 'to ';
          break;
        case 'dim':
          verb = 'dimming';
          preposition = 'by ';
          break;
        case 'brighten':
          verb = 'brightening';
          preposition = 'by ';
          break;
        case 'turn':
        case 'switch':
        default:
          verb = `${body.payload.keyword}ing`;
          break;
      }

      const value = body.payload.value ? body.payload.value : '';

      this.displayMessage(
        `OK, ${verb} the ${body.payload.thing} ${preposition}${value}.`,
        'incoming'
      );
    }).catch(() => {
      this.displayMessage('Sorry, I didn\'t understand.', 'incoming');
    });
  },

  displayMessage: function(text, direction) {
    const cls =
      direction === 'incoming' ?
        'assistant-message-incoming' :
        'assistant-message-outgoing';

    const node = document.createElement('div');
    node.classList.add(cls);
    node.innerText = text;

    this.messages.appendChild(node);
    this.messages.scrollTop = this.messages.scrollHeight;
  },

  handleInput: function(e) {
    if (e.keyCode === 13) {
      const text = e.target.value;
      this.displayMessage(text, 'outgoing');
      this.submitCommand(text);
      e.target.value = '';
    }
  },

  handleSubmit: function() {
    const text = this.textInput.value;
    this.displayMessage(text, 'outgoing');
    this.submitCommand(text);
    this.textInput.value = '';
  },

  handleSpeech: function() {
    if (this.listening) {
      this.listening = false;
      this.stm.stop();
    } else {
      this.stm.listen();
      this.listening = true;
    }
  },

  handleAvatarClick: function() {
    this.messages.innerHTML = '';
  },

  /**
   * Listener for the api. Receives a msg containing the current state
   * @param msg
   */
  listener: function(msg) {
    if (msg.state === 'result') {
      // sort results to get the one with the highest confidence
      const results = msg.data.sort((a, b) => {
        return b.confidence - a.confidence;
      });
      if (results.length < 1) {
        this.displayMessage('Sorry, I didn\'t get that.', 'incoming');
        console.error('Error: (results.length <= 1)');
        return;
      }
      console.debug(results[0].text, results[0].confidence);
      // TODO: autocapitalize
      this.displayMessage(results[0].text, 'outgoing');
      this.submitCommand(results[0].text);
    } else if (msg.state === 'ready') {
      this.listening = false;
    }
  },


};

module.exports = AssistantScreen;
