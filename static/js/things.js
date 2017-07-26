/**
 * Things Screen.
 *
 * UI for showing Things connected to the gateway.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/* globals AddThingScreen, Thing, OnOffSwitch */

// eslint-disable-next-line
var ThingsScreen = {

  NO_THINGS_MESSAGE: 'No devices.',

  /**
   * Initialise Things Screen.
   */
  init: function() {
    this.thingsElement = document.getElementById('things');
    this.addButton = document.getElementById('add-button');
    this.showThings();
    window.addEventListener('_thingchange', this.showThings.bind(this));
    this.addButton.addEventListener('click',
      AddThingScreen.show.bind(AddThingScreen));
  },

  /**
   * Display all connected web things.
   */
  showThings: function() {
    const opts = {
      headers: {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json'
      }
    };
    // Fetch a list of things from the server
    fetch('/things', opts).then((function(response) {
      return response.json();
    }).bind(this)).then((function(things) {
      if (things.length === 0) {
        this.thingsElement.innerHTML = this.NO_THINGS_MESSAGE;
      } else {
        this.thingsElement.innerHTML = '';
        things.forEach(function(description) {
          switch(description.type) {
            case 'onOffSwitch':
              console.log('rendering new on/off switch');
              // eslint-disable-next-line no-unused-vars
              var newOnOffSwitch = new OnOffSwitch(description);
              break;
            default:
              console.log('rendering new thing');
              // eslint-disable-next-line no-unused-vars
              var newThing = new Thing(description);
              break;
          }
        });
      }
    }).bind(this));
  }
};
