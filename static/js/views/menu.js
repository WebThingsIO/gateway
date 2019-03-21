/**
 * Main Menu.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('../api');

// eslint-disable-next-line no-unused-vars
const Menu = {
  /**
   * Initialise menu.
   */
  init: function() {
    this.element = document.getElementById('main-menu');
    this.scrim = document.getElementById('menu-scrim');
    this.hidden = true;
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.scrim.addEventListener('click', this.handleScrimClick.bind(this));
    this.items = {};
    this.items.assistant = [
      document.getElementById('assistant-menu-item'),
      document.getElementById('speech-wrapper'),
    ];
    this.items.things = [document.getElementById('things-menu-item')];
    this.items.settings = [document.getElementById('settings-menu-item')];
    this.items.floorplan = [document.getElementById('floorplan-menu-item')];
    this.items.rules = [document.getElementById('rules-menu-item')];
    this.items.rule = [document.getElementById('rules-menu-item')];
    this.items.logs = [document.getElementById('logs-menu-item')];
    this.currentItem = 'things';

    this.getExperimentSetting('assistant');
    this.getExperimentSetting('logs');
  },

  /**
   * Update a menu item's visibility based on whether its corresponding
   * experiment is enabled
   * @param {String} experiment
   */
  getExperimentSetting: (experiment) => {
    API.getExperimentSetting(experiment).then((value) => {
      if (value) {
        Menu.showItem(experiment);
      } else {
        Menu.hideItem(experiment);
      }
    }).catch((e) => {
      console.warn(`${experiment} experiment setting is not yet set ${e}`);
    });
  },

  /**
  * Show menu.
  */
  show: function() {
    this.element.classList.remove('hidden');
    this.scrim.classList.remove('hidden');
    this.hidden = false;
  },

  /**
  * Hide menu.
  */
  hide: function() {
    this.element.classList.add('hidden');
    this.scrim.classList.add('hidden');
    this.hidden = true;
  },

  /**
   * Toggle menu visibility
   */
  toggle: function() {
    if (this.hidden) {
      this.show();
    } else {
      this.hide();
    }
  },

  /**
   * Handle a click event.
   *
   * @param {Event} Click event.
   */
  handleClick: function(e) {
    if (e.target.tagName != 'A') {
      return;
    }
    this.hide();
  },

  /**
   * Handle a click event on scrim.
   *
   * @param {Event} Click event.
   */
  handleScrimClick: function(_e) {
    this.hide();
  },

  /**
   * Select an item.
   *
   * @param {String} item Item ID.
   */
  selectItem: function(item) {
    if (!this.items[item]) {
      console.error(`Tried to select a menu item that didnt exist ${item}`);
      return;
    }
    for (const elt of this.items[this.currentItem]) {
      elt.classList.remove('selected');
    }
    for (const elt of this.items[item]) {
      elt.classList.add('selected');
    }
    this.currentItem = item;
  },

  /**
   * Enable a menu item.
   */
  showItem: function(item) {
    for (const elt of this.items[item]) {
      elt.classList.remove('hidden');
    }
  },

  /*
   * Disable a menu item.
   */
  hideItem: function(item) {
    for (const elt of this.items[item]) {
      elt.classList.add('hidden');
    }
  },
};

module.exports = Menu;
