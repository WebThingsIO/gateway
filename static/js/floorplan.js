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
const App = require('./app');
const Constants = require('./constants');
const BinarySensor = require('./binary-sensor');
const ColorControl = require('./color-control');
const EnergyMonitor = require('./energy-monitor');
const Light = require('./light');
const MultiLevelSensor = require('./multi-level-sensor');
const MultiLevelSwitch = require('./multi-level-switch');
const OnOffSwitch = require('./on-off-switch');
const SmartPlug = require('./smart-plug');
const Thing = require('./thing');

// eslint-disable-next-line no-unused-vars
const FloorplanScreen = {

  ORIGIN_X: 6,    // X co-ordinate to start placing un-positioned things from.
  ORIGIN_Y: 7,    // Y co-ordinate to start placing un-positioned things from.
  MAX_X: 100,     // Max X range.
  MAX_Y: 100,     // Max Y range.
  THING_GAP: 11,  // Gap between unpositioned things along x axis.

  /**
  * Initialise Floorplan Screen.
  */
  init: function() {
    // A list of Things on the floorplan
    this.things = [];

    this.view = document.getElementById('floorplan-view');
    this.floorplan = document.getElementById('floorplan');
    this.backButton = document.getElementById('back-button');
    this.menuButton = document.getElementById('menu-button');
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
    this.refreshThings = this.refreshThings.bind(this);
    this.things = [];
  },

  refreshThings: function(things) {
    let thing;
    while (typeof (thing = this.things.pop()) !== 'undefined') {
      thing.cleanup();
    }

    this.thingsElement.innerHTML = '';
    if (things.length === 0) {
      return;
    }

    let x = this.ORIGIN_X;
    let y = this.ORIGIN_Y;
    things.forEach((description, thingId) => {
      App.gatewayModel.getThingModel(thingId).then((thingModel) => {
        if (!description.floorplanX || !description.floorplanY) {
          description.floorplanX = x;
          description.floorplanY = y;
          x += this.THING_GAP; // increment x co-ordinate.
          if (x > this.MAX_X) {
            x = this.ORIGIN_X;
            y += this.THING_GAP;
          }
          if (y > this.MAX_Y) {
            y = this.ORIGIN_Y;
          }
        }
        let thing;
        if (description.selectedCapability) {
          switch (description.selectedCapability) {
            case 'OnOffSwitch':
              thing = new OnOffSwitch(thingModel, description, 'svg');
              break;
            case 'MultiLevelSwitch':
              thing = new MultiLevelSwitch(thingModel, description, 'svg');
              break;
            case 'ColorControl':
              thing = new ColorControl(thingModel, description, 'svg');
              break;
            case 'EnergyMonitor':
              thing = new EnergyMonitor(thingModel, description, 'svg');
              break;
            case 'BinarySensor':
              thing = new BinarySensor(thingModel, description, 'svg');
              break;
            case 'MultiLevelSensor':
              thing = new MultiLevelSensor(thingModel, description, 'svg');
              break;
            case 'SmartPlug':
              thing = new SmartPlug(thingModel, description, 'svg');
              break;
            case 'Light':
              thing = new Light(thingModel, description, 'svg');
              break;
            default:
              thing = new Thing(thingModel, description, 'svg');
              break;
          }
        } else {
          switch (description.type) {
            case 'onOffSwitch':
              thing = new OnOffSwitch(thingModel, description, 'svg');
              break;
            case 'onOffLight':
            case 'onOffColorLight':
            case 'dimmableLight':
            case 'dimmableColorLight':
              thing = new Light(thingModel, description, 'svg');
              break;
            case 'binarySensor':
              thing = new BinarySensor(thingModel, description, 'svg');
              break;
            case 'multiLevelSensor':
              thing = new MultiLevelSensor(thingModel, description, 'svg');
              break;
            case 'multiLevelSwitch':
              thing = new MultiLevelSwitch(thingModel, description, 'svg');
              break;
            case 'smartPlug':
              thing = new SmartPlug(thingModel, description, 'svg');
              break;
            default:
              thing = new Thing(thingModel, description, 'svg');
              break;
          }
        }
        this.things.push(thing);
      });
    });
  },

  show: function() {
    this.backButton.classList.add('hidden');
    this.menuButton.classList.remove('hidden');
    App.gatewayModel.subscribe(Constants.DELETE_THINGS, this.refreshThings);
    App.gatewayModel.subscribe(
      Constants.REFRESH_THINGS,
      this.refreshThings,
      true);
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
    this.things.forEach((thing) => {
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
    this.things.forEach((thing) => {
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
      point.x - parseInt(this.selectedThing.getAttribute('dragx'), 10);
    this.pointerOffsetY =
      point.y - parseInt(this.selectedThing.getAttribute('dragy'), 10);
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
      if (!response.ok) {
        console.error(`Failed to move thing ${thingUrl}`);
      }
    }).catch((e) => {
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
