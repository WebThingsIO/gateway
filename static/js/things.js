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

/* globals AddThingScreen, Thing, OnOffSwitch, BinarySensor, ColorLight,
 DimmableLight, DimmableColorLight, OnOffLight, MultiLevelSwitch,
 MultiLevelSensor, SmartPlug */

// eslint-disable-next-line
var ThingsScreen = {

  NO_THINGS_MESSAGE: 'No devices yet. Click + to scan for available devices.',
  THING_NOT_FOUND_MESSAGE: 'Thing not found.',

  /**
   * Initialise Things Screen.
   */
  init: function() {
    this.thingsElement = document.getElementById('things');
    this.thingTitleElement = document.getElementById('thing-title');
    this.addButton = document.getElementById('add-button');
    this.menuButton = document.getElementById('menu-button');
    this.backButton = document.getElementById('back-button');
    window.addEventListener('_thingchange', this.showThings.bind(this));
    this.backButton.addEventListener('click', () => window.history.back());
    this.addButton.addEventListener('click',
      AddThingScreen.show.bind(AddThingScreen));
  },

  /**
   * Show things screen.
   *
   * @param {String} thingId Optional thing ID to show, otherwise show all.
   */
  show: function(thingId) {
    if (thingId) {
      this.backButton.classList.remove('hidden');
      this.menuButton.classList.add('hidden');
      this.showThing(thingId);
    } else {
      this.menuButton.classList.remove('hidden');
      this.backButton.classList.add('hidden');
      this.thingTitleElement.classList.add('hidden');
      this.showThings();
    }
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
            case 'onOffLight':
              console.log('rendering new on/off light');
              // eslint-disable-next-line no-unused-vars
              var newOnOffLight = new OnOffLight(description);
              break;
            case 'onOffColorLight':
              console.log('rendering new color light');
              // eslint-disable-next-line no-unused-vars
              var newColorLight = new ColorLight(description);
              break;
            case 'dimmableLight':
              console.log('rendering new dimmable light');
              // eslint-disable-next-line no-unused-vars
              var newDimmableLight = new DimmableLight(description);
              break;
            case 'dimmableColorLight':
              console.log('rendering new dimmable color light');
              // eslint-disable-next-line no-unused-vars
              var newDimmableColorLight = new DimmableColorLight(description);
              break;
            case 'binarySensor':
              console.log('rendering new binary sensor');
              // eslint-disable-next-line no-unused-vars
              var newBinarySensor = new BinarySensor(description);
              break;
            case 'multiLevelSensor':
              console.log('rendering new multi level sensor');
              // eslint-disable-next-line no-unused-vars
              var newMultiLevelSensor = new MultiLevelSensor(description);
              break;
            case 'multiLevelSwitch':
              console.log('rendering new multi level switch');
              // eslint-disable-next-line no-unused-vars
              var newMultiLevelSwitch = new MultiLevelSwitch(description);
              break;
            case 'smartPlug':
              console.log('rendering new smart plug');
              // eslint-disable-next-line no-unused-vars
              var newSmartPlug = new SmartPlug(description);
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
        let thing;
        switch(description.type) {
          case 'onOffSwitch':
            console.log('rendering new on/off switch');
            thing = new OnOffSwitch(description, 'htmlDetail');
            break;
          case 'binarySensor':
            console.log('rendering new binary sensor');
            thing = new BinarySensor(description, 'htmlDetail');
            break;
          case 'multiLevelSensor':
            console.log('rendering new multi level sensor');
            thing = new MultiLevelSensor(description, 'htmlDetail');
            break;
          case 'onOffLight':
            console.log('rendering new on/off light');
            thing = new OnOffLight(description, 'htmlDetail');
            break;
          case 'onOffColorLight':
            console.log('rendering new color light');
            thing = new ColorLight(description, 'htmlDetail');
            break;
          case 'dimmableLight':
            console.log('rendering new dimmable light');
            thing = new DimmableLight(description, 'htmlDetail');
            break;
          case 'dimmableColorLight':
            console.log('rendering new dimmable color light');
            thing = new DimmableColorLight(description, 'htmlDetail');
            break;
          case 'multiLevelSwitch':
            console.log('rendering new multi level switch');
            thing = new MultiLevelSwitch(description, 'htmlDetail');
            break;
          case 'smartPlug':
            console.log('rendering new smart plug');
            // eslint-disable-next-line no-unused-vars
            thing = new SmartPlug(description, 'htmlDetail');
            break;
          default:
            console.log('rendering new thing');
            // eslint-disable-next-line no-unused-vars
            thing = new Thing(description, 'htmlDetail');
            break;
        }

        document.getElementById('thing-title-icon').src = thing.pngBaseIcon;
        document.getElementById('thing-title-name').innerText = thing.name;
        this.thingTitleElement.classList.remove('hidden');
      }).bind(this));
    }).bind(this));
  }
};
