/**
 * Speech Recognition Helper.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

// eslint-disable-next-line no-unused-vars
var Speech = {

    /**
    * Initialise menu.
    */
    init: function(app) {
        app.speechButton = document.getElementById('speech-button');
        app.speechButton.addEventListener('click', this.listen.bind(this));
        // eslint-disable-next-line no-undef
        this.stm = SpeakToMe({
            listener: this.listener.bind(this)
        });
        this.listening = false;
    },

    /**
    * Starts listening
    */
    listen: function() {
        if (this.listening) {
          this.listening = false;
          this.stm.stop();
          document.getElementById('speech-button').style.backgroundImage =
              `url('/images/microphone.svg')`;
        } else {
          document.getElementById('speech-button').style.backgroundImage =
              `url('/images/microphone-active.svg')`;
          this.stm.listen();
          this.listening = true;
        }
    },

    /**
     * Listener for the api. Receives a msg containing the current state
     * @param msg
     */
    listener: function(msg) {
        if (msg.state === 'result') {
          var x = document.getElementById('snackbar');
          const displayNotification = function(msg, audio) {
            x.innerHTML = msg;
            x.className = 'show';
            setTimeout(function(){ x.className =
                x.className.replace('show', ''); }, 3000);
            new Audio(`/audio/${encodeURIComponent(audio)}.mp3`).play();
          }
          document.getElementById('stm-levels').classList.add('hidden');
          document.getElementById('speech-button').style.backgroundImage =
              `url('/images/microphone.svg')`;
          // sort results to get the one with the highest confidence
          var results = msg.data.sort(function(a, b) {
              return b.confidence - a.confidence;
          });
          if (results.length < 1) {
              displayNotification(
                  'Sorry, we couldn\'t understand your command.', 'failure');
              console.log('Error: (results.length <= 1)');
              return;
          }
          console.log(results[0].text, results[0].confidence);
          var opts = {
            method: 'POST',
            cache: 'default',
            body: `{"text":"${results[0].text.replace(/"/g, '\\"')}"}`,
            headers: {
                'Authorization': `Bearer ${window.API.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
          };

          let cmdError;
          fetch('/commands', opts).then(function(response) {
             if(!response.ok) {
                 cmdError = true;
             }
             return response.json();
          }).then(function() {
              if (cmdError) {
                  displayNotification(
                      'Sorry, the command wasn\'t found.', 'failure');
              } else {
                  displayNotification(
                      'The command was successfully executed.', 'success');
              }
          }).catch(function() {
              displayNotification(
                  'Sorry, we found a problem processing your command.',
                  'failure');
          });
        }
        else if (msg.state === 'ready') {
          this.listening = false;
        } else if (msg.state === 'listening') {
            let mediaStream = this.stm.getmediaStream();
            if (mediaStream) {
                document.getElementById('stm-levels')
                  .classList.remove('hidden');

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
        }
        else if (msg.state === 'processing') {
            this.analyzerNode.disconnect(this.outputNode);
            this.sourceNode.disconnect(this.analyzerNode);
            this.audioContext.close();
        }
    },

    // Helper to handle background visualization
    visualize: function(analyzerNode) {
        let api = this;
        const MIN_DB_LEVEL = -85; // The dB level that's 0 in the display
        const MAX_DB_LEVEL = -30; // The dB level that's 100% in the  display

        // Set up the analyzer node, and allocate an array for its data
        // FFT size 64 gives us 32 bins. But those bins hold frequencies up to
        // 22kHz or more, and we only care about visualizing lower frequencies
        // which is where most human voice lies, so we use fewer bins
        analyzerNode.fftSize = 64;
        const frequencyBins = new Float32Array(14);

        // Clear the canvas
        const levels = document.getElementById('stm-levels');
        const xPos = levels.width/2 + 78;
        const yPos = levels.height/2 - 40;
        const context = levels.getContext('2d');
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

        // Loop through the values and draw the bars
        context.strokeStyle = '#d1d2d3';

        for (let i = 0; i < n; i++) {
            const value = frequencyBins[i + skip];
            const diameter =
                ((levels.height * (value - MIN_DB_LEVEL) / dbRange) * 3) - 70;
            if (diameter < 0) {
                continue;
            }
            //console.log(xPos, yPos, diameter - 10, diameter/2 - 10);
            // Display a bar for this value.
            var alpha = diameter/500;
            if(alpha > .2) alpha = .2;
            else if (alpha < .1) alpha = .1;

            context.lineWidth = alpha*alpha*150;
            context.globalAlpha = alpha*alpha*5;
            context.beginPath();
            context.ellipse(
                xPos,
                yPos,
                diameter/2,
                diameter/4,
                0,
                0,
                2 * Math.PI
            );
            if(diameter > 90 && diameter < 360) context.stroke();
        }
        // Update the visualization the next time we can
        requestAnimationFrame(function() {
            api.visualize(analyzerNode);
        });
    }
}
