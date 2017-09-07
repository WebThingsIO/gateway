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
        } else {
          this.stm.listen();
          this.listening = true;
        }
    },

    /**
     * Listener for the api. Receives a msg containing the current state
     * @param msg
     */
    listener: function(msg) {
        if (msg.state == 'result') {
          // sort results to get the one with the highest confidence
          var results = msg.data.sort(function(a, b) {
              return a.confidence - b.confidence;
          });
          // call the intent rest api with the sentence we decoded
          // I want to keep the output here until we have the toast and
          // the communication with the Intent API landed and working
          // so I could debug the results
          console.log(results[0].text, results[0].confidence);
        }
        else if (msg.state == 'ready') {
          this.listening = false;
        }
    }
}
