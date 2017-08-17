/**
 * Main Menu.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// eslint-disable-next-line no-unused-vars
var Menu = {
   /**
    * Initialise menu.
    */
  init: function() {
    this.element = document.getElementById('main-menu');
    this.hidden = true;
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.items = [];
    this.items.things = document.getElementById('things-menu-item');
    this.items.adapters = document.getElementById('adapters-menu-item');
    this.items.settings = document.getElementById('settings-menu-item');
    this.items.floorplan = document.getElementById('floorplan-menu-item');
    this.currentItem = 'things';
    window.API.getExperimentSetting('floorplan').then(function(value) {
      if (value) {
        Menu.showItem('floorplan');
      } else {
        Menu.hideItem('floorplan');
      }
    }).catch(function(e) {
      console.log('Floorplan experiment setting is not yet set ' + e);
    });
  },

  /**
  * Show menu.
  */
  show: function() {
   this.element.classList.remove('hidden');
   this.hidden = false;
  },

  /**
  * Hide menu.
  */
  hide: function() {
   this.element.classList.add('hidden');
   this.hidden = true;
  },

  /**
   * Toggle menu visibility
   */
  toggle: function() {
    if(this.hidden) {
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
    if(e.target.tagName != 'A') {
      return;
    }
    this.hide();
  },

  /**
   * Select an item.
   *
   * @param {String} item Item ID.
   */
  selectItem: function(item) {
    if (!this.items[item]) {
      console.error('Tried to select a menu item that didnt exist ' + item);
        return;
    }
    this.items[this.currentItem].classList.remove('selected');
    this.items[item].classList.add('selected');
    this.currentItem = item;
  },

  /**
   * Enable a menu item.
   */
  showItem: function(item) {
    this.items[item].classList.remove('hidden');
  },

 /*
  * Disable a menu item.
  */
  hideItem: function(item) {
    this.items[item].classList.add('hidden');
  }
};
