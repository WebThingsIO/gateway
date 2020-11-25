/**
 * Transition dialog.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('../api');

const TransitionDialog = {
  /**
   * Initialize transition dialog.
   */
  init: function() {
    this.elements = {
      banner: {
        main: document.getElementById('action-required-area'),
        close: document.getElementById('action-required-close'),
        dismiss: document.getElementById('action-required-dont-ask-again'),
        choose: document.getElementById('action-required-choose'),
      },
      dialog: {
        main: document.getElementById('transition-dialog'),
        step1: {
          close: document.getElementById('transition-dialog-step-1-close'),
        },
        step2: {
          close: document.getElementById('transition-dialog-step-2-close'),
        },
      },
    };

    // Close buttons
    this.elements.banner.close.addEventListener('click', () => {
      this.elements.banner.main.classList.add('hidden');
    });
    this.elements.dialog.step1.close.addEventListener('click', () => {
      this.elements.dialog.main.classList.add('hidden');
    });
    this.elements.dialog.step2.close.addEventListener('click', () => {
      this.elements.dialog.main.classList.add('hidden');
    });

    // Dismiss button
    this.elements.banner.dismiss.addEventListener('click', () => {
      this.elements.banner.main.classList.add('hidden');

      API.putJson('/settings/transition', {skipped: true}).catch((e) => {
        console.error('Failed to skip transition:', e);
      });
    });

    this.elements.banner.choose.addEventListener('click', () => {
      this.elements.banner.main.classList.add('hidden');
      this.elements.dialog.main.classList.remove('hidden');
    });

    this.settings = {};

    API.getJson('/settings/transition').then((body) => {
      this.settings = body;

      if (!body.complete && !body.skipped) {
        this.elements.banner.main.classList.remove('hidden');
      }
    }).catch((e) => {
      console.error('Failed to get transition settings:', e);
    });
  },
};

module.exports = TransitionDialog;
