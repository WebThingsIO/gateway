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

const API = require('./api');
const AddThingScreen = require('./add-thing');
const UnknownThing = require('./unknown-thing');
const OnOffSwitch = require('./on-off-switch');
const BinarySensor = require('./binary-sensor');
const ColorLight = require('./color-light');
const DimmableLight = require('./dimmable-light');
const DimmableColorLight = require('./dimmable-color-light');
const OnOffLight = require('./on-off-light');
const MultiLevelSwitch = require('./multi-level-switch');
const MultiLevelSensor = require('./multi-level-sensor');
const SmartPlug = require('./smart-plug');

// eslint-disable-next-line no-unused-vars
const ThingsScreen = {

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
      this.addButton.classList.add('hidden');
      this.backButton.classList.remove('hidden');
      this.menuButton.classList.add('hidden');
      this.showThing(thingId);
    } else {
      this.addButton.classList.remove('hidden');
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
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
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
          switch (description.type) {
            case 'onOffSwitch':
              console.log('rendering new on/off switch');
              new OnOffSwitch(description);
              break;
            case 'onOffLight':
              console.log('rendering new on/off light');
              new OnOffLight(description);
              break;
            case 'onOffColorLight':
              console.log('rendering new color light');
              new ColorLight(description);
              break;
            case 'dimmableLight':
              console.log('rendering new dimmable light');
              new DimmableLight(description);
              break;
            case 'dimmableColorLight':
              console.log('rendering new dimmable color light');
              new DimmableColorLight(description);
              break;
            case 'binarySensor':
              console.log('rendering new binary sensor');
              new BinarySensor(description);
              break;
            case 'multiLevelSensor':
              console.log('rendering new multi level sensor');
              new MultiLevelSensor(description);
              break;
            case 'multiLevelSwitch':
              console.log('rendering new multi level switch');
              new MultiLevelSwitch(description);
              break;
            case 'smartPlug':
              console.log('rendering new smart plug');
              new SmartPlug(description);
              break;
            default:
              console.log('rendering new thing');
              new UnknownThing(description);
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
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    };
    // Fetch a thing from the server
    fetch(`/things/${encodeURIComponent(id)}`, opts).then((function(response) {
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
        switch (description.type) {
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
            thing = new UnknownThing(description, 'htmlDetail');
            break;
        }

        document.getElementById('thing-title-icon').src = thing.pngBaseIcon;
        document.getElementById('thing-title-name').innerText = thing.name;

        const speechWrapper = document.getElementById('speech-wrapper');
        if (speechWrapper.classList.contains('hidden')) {
          this.thingTitleElement.classList.remove('speech-enabled');
        } else {
          this.thingTitleElement.classList.add('speech-enabled');
        }

        this.thingTitleElement.classList.remove('hidden');
      }).bind(this));
    }).bind(this));
  },
};

module.exports = ThingsScreen;
