/**
 * Speech Recognition Helper.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const App = require('./app');
const AssistantScreen = require('./views/assistant');
let SpeakToMe;
try {
  SpeakToMe = require('speaktome-api/build/stm_web.min');
} catch (e) {
  console.warn('Error requiring STM', e);
}

// eslint-disable-next-line no-unused-vars
const Speech = {

  /**
   * Initialise menu.
   */
  init: function() {
    this.wrapper = document.getElementById('speech-wrapper');
    this.levels = document.getElementById('stm-levels');
    this.assistantLevels = document.getElementById('assistant-stm-levels');
    this.speechButtons = [];
    this.addSpeechButton(document.getElementById('speech-button'));
    this.addSpeechButton(document.getElementById('assistant-speech-button'));
    if (SpeakToMe) {
      this.stm = SpeakToMe({
        listener: this.listener.bind(this),
      });
    }
    this.listening = false;

    window.requestAnimationFrame(() => {
      const levelsStyle = window.getComputedStyle(this.levels);
      this.levels.width = parseFloat(levelsStyle.width);
      this.levels.height = parseFloat(levelsStyle.height);
      const assistantLevelsStyle =
        window.getComputedStyle(this.assistantLevels);
      this.assistantLevels.width = parseFloat(assistantLevelsStyle.width);
      this.assistantLevels.height = parseFloat(assistantLevelsStyle.height);
    });
  },

  addSpeechButton: function(speechButton) {
    speechButton.addEventListener('click', this.listen.bind(this));
    this.speechButtons.push(speechButton);
  },


  /**
  * Starts listening
  */
  listen: function() {
    if (!this.stm) {
      App.showMessage('Current browser does not support speech', 3000);
      return;
    }
    if (this.listening) {
      this.listening = false;
      this.stm.stop();
      for (const speechButton of this.speechButtons) {
        speechButton.classList.remove('active');
      }
    } else {
      for (const speechButton of this.speechButtons) {
        speechButton.classList.add('active');
      }
      this.stm.listen();
      this.listening = true;
    }
  },

  /**
   * Listener for the api. Receives a msg containing the current state
   * @param msg
   */
  listener: function(msg) {
    const assistantMode = this.wrapper.classList.contains('assistant');
    if (msg.state === 'result') {
      const displayNotification = function(msg, audio) {
        App.showMessage(msg, 3000);
        new Audio(`/audio/${encodeURIComponent(audio)}.mp3`).play();
      };
      this.assistantLevels.classList.add('hidden');
      this.levels.classList.add('hidden');
      for (const speechButton of this.speechButtons) {
        speechButton.classList.remove('active');
      }
      // sort results to get the one with the highest confidence
      const results = msg.data.sort((a, b) => {
        return b.confidence - a.confidence;
      });
      if (results.length < 1) {
        if (assistantMode) {
          AssistantScreen.displayMessage('Sorry, I didn\'t get that.',
                                         'incoming');
        } else {
          displayNotification('Sorry, I didn\'t get that',
                              'failure');
        }

        console.error('Error: (results.length <= 1)');
        return;
      }
      console.debug(results[0].text, results[0].confidence);

      AssistantScreen.displayMessage(results[0].text, 'outgoing');
      const cmd = AssistantScreen.submitCommand(results[0].text);

      if (assistantMode) {
        return;
      }

      cmd.then(({message, success}) => {
        displayNotification(message, success ? 'success' : 'failure');
      });
    } else if (msg.state === 'ready') {
      this.listening = false;
    } else if (msg.state === 'listening') {
      const mediaStream = this.stm.getmediaStream();
      if (mediaStream) {
        if (assistantMode) {
          this.assistantLevels.classList.remove('hidden');
        } else {
          this.levels.classList.remove('hidden');
        }
        // Build the WebAudio graph we'll be using
        this.audioContext = new AudioContext();
        this.sourceNode = this.audioContext.
          createMediaStreamSource(mediaStream);
        this.analyzerNode = this.audioContext.createAnalyser();
        this.outputNode =
          this.audioContext.createMediaStreamDestination();

        // make sure we're doing mono everywhere
        this.sourceNode.channelCount = 1;
        this.analyzerNode.channelCount = 1;
        this.outputNode.channelCount = 1;

        // connect the nodes together
        this.sourceNode.connect(this.analyzerNode);
        this.analyzerNode.connect(this.outputNode);

        this.visualize(this.analyzerNode);
      }
    } else if (msg.state === 'processing') {
      this.analyzerNode.disconnect(this.outputNode);
      this.sourceNode.disconnect(this.analyzerNode);
      this.audioContext.close();
    }
  },

  // Helper to handle background visualization
  visualize: function(analyzerNode) {
    const api = this;
    const MIN_DB_LEVEL = -85; // The dB level that's 0 in the display
    const MAX_DB_LEVEL = -30; // The dB level that's 100% in the  display

    // Set up the analyzer node, and allocate an array for its data
    // FFT size 64 gives us 32 bins. But those bins hold frequencies up to
    // 22kHz or more, and we only care about visualizing lower frequencies
    // which is where most human voice lies, so we use fewer bins
    analyzerNode.fftSize = 64;
    const frequencyBins = new Float32Array(14);

    const assistantMode = this.wrapper.classList.contains('assistant');

    let levels = this.levels;
    if (assistantMode) {
      levels = this.assistantLevels;
    }

    let xPos = levels.width / 2;
    let yPos = levels.height / 2;
    if (!assistantMode) {
      xPos = levels.width - 20 - 56 / 2;
      yPos = 20 + 56 / 2;
    }
    const context = levels.getContext('2d');
    // Clear the canvas
    context.clearRect(0, 0, levels.width, levels.height);

    if (levels.classList.contains('hidden')) {
      return; // If we've been hidden, return right away
    }

    // Get the FFT data
    analyzerNode.getFloatFrequencyData(frequencyBins);

    // Display it as a barchart.
    // Drop bottom few bins, since they are often misleadingly high
    const skip = 2;
    const n = frequencyBins.length - skip;
    const dbRange = MAX_DB_LEVEL - MIN_DB_LEVEL;
    let diameterMin = levels.height / 10;
    const diameterMax = levels.height;
    if (!assistantMode) {
      diameterMin = 60;
    }

    // Loop through the values and draw the bars
    context.strokeStyle = '#d1d2d3';

    for (let i = 0; i < n; i++) {
      const value = frequencyBins[i + skip];
      let diameter =
        ((levels.height * (value - MIN_DB_LEVEL) / dbRange) * 3) - 70;
      if (assistantMode) {
        diameter = ((levels.height * (value - MIN_DB_LEVEL) / dbRange) * 3);
      }

      if (diameter < 0) {
        continue;
      }

      // Display a bar for this value.
      let alpha = diameter / levels.height;
      if (alpha > 0.2) {
        alpha = 0.2;
      } else if (alpha < 0.1) {
        alpha = 0.1;
      }

      context.lineWidth = alpha * alpha * 150;
      context.globalAlpha = alpha * alpha * 5;
      if (diameter > diameterMin && diameter < diameterMax) {
        context.beginPath();
        context.ellipse(
          xPos,
          yPos,
          diameter / 2,
          diameter / 2,
          0,
          0,
          2 * Math.PI
        );
        context.stroke();
      }
    }
    // Update the visualization the next time we can
    requestAnimationFrame(() => {
      api.visualize(analyzerNode);
    });
  },
};

module.exports = Speech;
