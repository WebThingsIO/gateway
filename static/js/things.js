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
  THING_NOT_FOUND_MESSAGE: 'Thing not found.',

  /**
   * Initialise Things Screen.
   *
   * @param {String} thingId Optional thing ID to show, otherwise show all.
   */
  init: function(thingId) {
    this.thingsElement = document.getElementById('things');
    this.addButton = document.getElementById('add-button');
    if (thingId) {
      this.showThing(thingId);
    } else {
      this.showThings();
    }
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
  },

  /**
   * Display a single Thing.
   *
   * @param {String} id The ID of the Thing to show.
   */
  showThing: function(id) {
    const opts = {
      headers: {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json'
      }
    };
    // Fetch a thing from the server
    fetch('/things/' + id, opts).then((function(response) {
      if (response.status == 404) {
        this.thingsElement.innerHTML = this.THING_NOT_FOUND_MESSAGE;
        return;
      }
      response.json().then((function(description) {
        if (!description) {
          this.thingsElement.innerHTML = this.THING_NOT_FOUND_MESSAGE;
          return;
        }
        this.thingsElement.innerHTML = '';
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
      }).bind(this));
    }).bind(this));
  }
};
