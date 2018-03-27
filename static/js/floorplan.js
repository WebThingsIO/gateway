/**
 * Floorplan Screen.
 *
 * Represents things on a floorplan of your home.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
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
const FloorplanScreen = {

  ORIGIN_X: 7,    // X co-ordinate to start placing un-positioned things from.
  ORIGIN_Y: 7,    // X co-ordinate to start placing un-positioned things from.
  THING_GAP: 11, // Gap between unpositioned things along x axis.

  /**
  * Initialise Floorplan Screen.
  */
  init: function() {
    // A list of Things on the floorplan
    this.things = [];

    this.view = document.getElementById('floorplan-view');
    this.floorplan = document.getElementById('floorplan');
    this.editButton = document.getElementById('floorplan-edit-button');
    this.doneButton = document.getElementById('floorplan-done-button');
    this.uploadForm = document.getElementById('floorplan-upload-form');
    this.uploadButton = document.getElementById('floorplan-upload-button');
    this.fileInput = document.getElementById('floorplan-file-input');
    this.thingsElement = document.getElementById('floorplan-things');

    this.editButton.addEventListener('click', this.edit.bind(this));
    this.doneButton.addEventListener('click', this.done.bind(this));
    this.uploadButton.addEventListener('click', this.requestFile.bind(this));
    this.uploadForm.addEventListener('submit', this.blackHole);
    this.fileInput.addEventListener('change', this.upload.bind(this));
  },

  show: function() {
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
      this.things = [];
      this.thingsElement.innerHTML = '';
      if (things.length === 0) {
        return;
      }

      let x = this.ORIGIN_X;
      const y = this.ORIGIN_Y;
      things.forEach(function(description) {
        if (!description.floorplanX || !description.floorplanY) {
          description.floorplanX = x;
          description.floorplanY = y;
          x += this.THING_GAP; // increment x co-ordinate.
        }
        switch (description.type) {
          case 'onOffSwitch':
            console.log('rendering new on/off switch');
            this.things.push(new OnOffSwitch(description, 'svg'));
            break;
          case 'onOffLight':
            console.log('rendering new on/off light');
            this.things.push(new OnOffLight(description, 'svg'));
            break;
          case 'onOffColorLight':
            console.log('rendering new color light');
            this.things.push(new ColorLight(description, 'svg'));
            break;
          case 'dimmableLight':
            console.log('rendering new dimmable light');
            this.things.push(new DimmableLight(description, 'svg'));
            break;
          case 'dimmableColorLight':
            console.log('rendering new dimmable color light');
            this.things.push(new DimmableColorLight(description, 'svg'));
            break;
          case 'binarySensor':
            console.log('rendering new binary sensor');
            this.things.push(new BinarySensor(description, 'svg'));
            break;
          case 'multiLevelSensor':
            console.log('rendering new multi level sensor');
            this.things.push(new MultiLevelSensor(description, 'svg'));
            break;
          case 'multiLevelSwitch':
            console.log('rendering new multi level switch');
            this.things.push(new MultiLevelSwitch(description, 'svg'));
            break;
          case 'smartPlug':
            console.log('rendering new smart plug');
            this.things.push(new SmartPlug(description, 'svg'));
            break;
          default:
            console.log('rendering new thing');
            this.things.push(new UnknownThing(description, 'svg'));
            break;
        }
      }, this);
    }).bind(this));
  },

  /**
   * Put floorplan in edit mode.
   */
  edit: function() {
    this.view.classList.add('edit');
    this.editButton.classList.add('hidden');
    this.doneButton.classList.remove('hidden');
    this.uploadForm.classList.remove('hidden');

    // Bind to this before adding listener to make it easier to remove.
    this.selectThing = this.selectThing.bind(this);
    this.moveThing = this.moveThing.bind(this);
    this.deselectThing = this.deselectThing.bind(this);

    // Disable hyperlinks for things
    this.things.forEach(function(thing) {
      thing.element.addEventListener('click', this.blackHole);
      thing.element.addEventListener('mousedown', this.selectThing);
      thing.element.addEventListener('touchstart', this.selectThing);
    }, this);

    // Enable moving and deslecting things
    this.pointerOffsetX = 0;
    this.pointerOffsetY = 0;
    this.thingsElement.addEventListener('mousemove', this.moveThing);
    this.thingsElement.addEventListener('mouseup', this.deselectThing);
    this.thingsElement.addEventListener('touchmove', this.moveThing);
    this.thingsElement.addEventListener('touchend', this.deselectThing);
  },

  /**
   * Exit edit mode.
   */
  done: function() {
    this.view.classList.remove('edit');
    this.doneButton.classList.add('hidden');
    this.editButton.classList.remove('hidden');
    this.uploadForm.classList.add('hidden');

    // Re-enable hyperlinks for things
    this.things.forEach(function(thing) {
      thing.element.removeEventListener('click', this.blackHole);
      thing.element.removeEventListener('mousedown', this.selectThing);
      thing.element.removeEventListener('touchstart', this.selectThing);
    }, this);

    // Disable moving and deslecting things
    this.thingsElement.removeEventListener('mousemove', this.moveThing);
    this.thingsElement.removeEventListener('mouseup', this.deselectThing);
    this.thingsElement.removeEventListener('touchmove', this.moveThing);
    this.thingsElement.removeEventListener('touchend', this.deselectThing);
  },

  /**
   * Request a file from the user.
   */
  requestFile: function() {
    this.fileInput.click();
  },

  /**
   * Upload a file.
   *
   * @param {Event} e A change event on the file input.
   */
  upload: function(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.uploadButton.classList.add('loading');
    const headers = {
      Authorization: `Bearer ${API.jwt}`,
    };

    fetch('/uploads', {
      method: 'POST',
      body: formData,
      headers: headers,
    }).then((response) => {
      this.uploadButton.classList.remove('loading');
      if (response.ok) {
        console.log('Successfully uploaded floorplan');
        fetch('/uploads/floorplan.svg', {
          method: 'GET',
          headers: headers,
          // Make sure we update the cache with the new floorplan
          cache: 'reload',
        }).then(() => {
          // Add a timestamp to the background image to force image reload
          const timestamp = Date.now();
          this.floorplan.setAttribute(
            'style',
            `background-image: url("/uploads/floorplan.svg?t=${timestamp}")`);
        });
      } else {
        console.error('Failed to upload floorplan');
      }
    }).catch((error) => {
      this.uploadButton.classList.remove('loading');
      console.error(`Failed to upload floorplan ${error}`);
    });
  },

  /**
   * Select Thing.
   *
   * @param {Event} e mousedown or touchstart event.
   */
  selectThing: function(e) {
    // Prevent interaction with HTML5 drag and drop
    e.preventDefault();

    this.pointerOffsetX = 0;
    this.pointerOffsetY = 0;
    this.selectedThing = e.currentTarget;
    let point = this.thingsElement.createSVGPoint();
    point.x = e.clientX || e.touches[0].clientX;
    point.y = e.clientY || e.touches[0].clientY;
    const matrix = this.thingsElement.getScreenCTM();
    point = point.matrixTransform(matrix.inverse());

    this.pointerOffsetX =
      point.x - parseInt(this.selectedThing.getAttribute('dragx'));
    this.pointerOffsetY =
      point.y - parseInt(this.selectedThing.getAttribute('dragy'));
  },

  /**
   * Deselect Thing.
   */
  deselectThing: function() {
    if (!this.selectedThing) {
      return;
    }
    const thing = this.selectedThing;
    const x = thing.getAttribute('dragx');
    const y = thing.getAttribute('dragy');
    const thingUrl = thing.firstElementChild.getAttribute('xlink:href');

    // HTTP PATCH request to set x and y co-ordinates of Thing in database.
    const payload = {
      floorplanX: x,
      floorplanY: y,
    };
    fetch(thingUrl, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        console.log(`Successfully moved thing to (${x},${y})`);
      } else {
        console.error(`Failed to move thing ${thingUrl}`);
      }
    }).catch(function(e) {
      console.error(`Error trying to move thing ${thingUrl} ${e}`);
    });

    // Reset co-ordinates
    this.selectedThing = null;
    this.pointerOffsetX = 0;
    this.pointerOffsetY = 0;
  },

  /**
   * Move Thing.
   *
   * @param {Event} e mousemove or touchmove event.
   */
  moveThing: function(e) {
    if (!this.selectedThing) {
      return;
    }

    let point = this.thingsElement.createSVGPoint();
    point.x = e.clientX || e.touches[0].clientX;
    point.y = e.clientY || e.touches[0].clientY;
    const matrix = this.thingsElement.getScreenCTM();
    point = point.matrixTransform(matrix.inverse());
    point.x -= this.pointerOffsetX;
    point.y -= this.pointerOffsetY;

    // Ensure Thing isn't moved outside the bounds of the floorplan.
    if (point.x < this.O || point.x > 100 || point.y < 0 || point.y > 100) {
      return;
    }

    this.selectedThing.setAttribute('dragx', point.x);
    this.selectedThing.setAttribute('dragy', point.y);
    this.selectedThing.setAttribute(
      'transform',
      `translate(${point.x},${point.y})`);
  },

  /*
   * Send an event into a black hole, never to be seen again.
   *
   * @param {Event} e Event to black hole.
   */
  blackHole: function(e) {
    e.preventDefault();
    return false;
  },
};

module.exports = FloorplanScreen;
