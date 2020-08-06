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

const page = require('page');
const API = require('../api');
const App = require('../app');
const Constants = require('../constants');
const {createThingFromCapability} =
  require('../schema-impl/capability/capabilities');

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
    this.floorplanBackButton = document.getElementById('floorplan-back-button');
    this.uploadForm = document.getElementById('floorplan-upload-form');
    this.uploadButton = document.getElementById('floorplan-upload-button');
    this.fileInput = document.getElementById('floorplan-file-input');
    this.thingsElement = this.floorplan;

    this.updateVminRequest = null;
    this.vmin = 1;
    this.onResize = this.onResize.bind(this);
    this.updateVmin = this.updateVmin.bind(this);

    this.interactTimeout = null;
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.selectThing = this.selectThing.bind(this);
    this.moveThing = this.moveThing.bind(this);
    this.deselectThing = this.deselectThing.bind(this);

    this.editButton.addEventListener('click', this.edit.bind(this));
    this.doneButton.addEventListener('click', this.done.bind(this));
    this.floorplanBackButton.addEventListener('click', this.done.bind(this));
    this.uploadButton.addEventListener('click', this.requestFile.bind(this));
    this.uploadForm.addEventListener('submit', this.blackHole);
    this.fileInput.addEventListener('change', this.upload.bind(this));
    this.refreshThings = this.refreshThings.bind(this);
    this.things = [];
  },

  refreshThings: function(things) {
    if (this.view.classList.contains('edit')) {
      return;
    }

    let thing;
    while (typeof (thing = this.things.pop()) !== 'undefined') {
      this.removeInteract(thing);
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

        const format = Constants.ThingFormat.LINK_ICON;
        const thing = createThingFromCapability(
          description.selectedCapability, thingModel, description, format);
        thing.element.dataset.index = this.things.length;
        this.addInteract(thing);
        this.things.push(thing);
        // Dynamically layout all things including the one we just added
        this.updateVmin();
      });
    });
  },

  addInteract: function(thing) {
    thing.element.addEventListener('click', this.blackHole);
    thing.element.addEventListener('mousedown', this.onPointerDown);
    thing.element.addEventListener('mouseup', this.onPointerUp);
    thing.element.addEventListener('touchstart', this.onPointerDown);
    thing.element.addEventListener('touchend', this.onPointerUp);
  },

  removeInteract: function(thing) {
    thing.element.removeEventListener('click', this.blackHole);
    thing.element.removeEventListener('mousedown', this.onPointerDown);
    thing.element.removeEventListener('mouseup', this.onPointerUp);
    thing.element.removeEventListener('touchstart', this.onPointerDown);
    thing.element.removeEventListener('touchend', this.onPointerUp);
  },

  show: function() {
    window.addEventListener('resize', this.onResize);
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
    this.thingsElement.classList.add('editing');

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
    this.thingsElement.classList.remove('editing');

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
    this.uploadButton.classList.add('loading');

    API.uploadFloorplan(e.target.files[0]).then(() => {
      this.uploadButton.classList.remove('loading');

      API.loadImage('/uploads/floorplan.svg').then((data) => {
        this.floorplan.style.backgroundImage =
          `url(${URL.createObjectURL(data)})`;
      });
    }).catch((error) => {
      this.uploadButton.classList.remove('loading');
      console.error(`Failed to upload floorplan ${error}`);
    });
  },

  /**
   * On resize schedule an update of vmin
   */
  onResize: function() {
    if (!this.view.classList.contains('selected')) {
      window.removeEventListener('resize', this.onResize);
      return;
    }
    if (this.updateVminRequest) {
      return;
    }
    this.updateVminRequest = window.requestAnimationFrame(this.updateVmin);
  },

  /**
   * Update our manually calculated vmin unit
   */
  updateVmin: function() {
    this.updateVminRequest = null;
    const newVmin = Math.min(window.innerWidth, window.innerHeight) / 100;
    this.vmin = newVmin;
    this.things.forEach((thing) => {
      const elt = thing.element;
      elt.style.transform =
        this.makeTransform(parseFloat(elt.dataset.x),
                           parseFloat(elt.dataset.y));
    });
  },

  /**
   * @param {{x: number,  y: number}} screenPoint - in pixels from top left of
   *                                  viewport
   * @return {{x: number, y: number}} point in vmin units from top left of
   *                                  thingsElement
   */
  screenToRelVmin: function(screenPoint) {
    const thingsRect = this.thingsElement.getBoundingClientRect();
    const dx = (screenPoint.x - thingsRect.left) / this.vmin;
    const dy = (screenPoint.y - thingsRect.right) / this.vmin;
    return {
      x: dx,
      y: dy,
    };
  },

  /**
   * Select Thing.
   *
   * @param {Event} e mousedown or touchstart event.
   */
  selectThing: function(e) {
    // Prevent interaction with HTML5 drag and drop
    e.preventDefault();

    this.selectedThing = e.currentTarget;
    const screenPoint = {
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY,
    };
    const point = this.screenToRelVmin(screenPoint);
    this.pointerOffsetX =
      point.x - parseFloat(this.selectedThing.dataset.x);
    this.pointerOffsetY =
      point.y - parseFloat(this.selectedThing.dataset.y);
    this.selectedThing.style.cursor = 'grabbing';
  },

  /**
   * Deselect Thing.
   */
  deselectThing: function() {
    if (!this.selectedThing) {
      return;
    }
    const thing = this.selectedThing;
    const x = parseFloat(thing.dataset.x);
    const y = parseFloat(thing.dataset.y);
    const thingUrl = decodeURI(thing.dataset.href);
    const thingId = thingUrl.split('/').pop().replace(/%2F/g, '/');
    thing.style.cursor = '';

    API.setThingFloorplanPosition(thingId, x, y).then(() => {
      return App.gatewayModel.getThing(thingId);
    }).then((t) => {
      if (t) {
        t.floorplanX = x;
        t.floorplanY = y;
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

    const screenPoint = {
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY,
    };

    const point = this.screenToRelVmin(screenPoint);
    point.x -= this.pointerOffsetX;
    point.y -= this.pointerOffsetY;

    // Ensure Thing isn't moved outside the bounds of the floorplan.
    if (point.x < 0 || point.x > 100 || point.y < 0 || point.y > 100) {
      return;
    }

    this.selectedThing.dataset.x = point.x;
    this.selectedThing.dataset.y = point.y;
    this.selectedThing.style.transform = this.makeTransform(point.x, point.y);
  },

  /**
   * Generate a css transform for a given pair of floorplan-relative coordinates
   * @param {number} x
   * @param {number} y
   * @return {String}
   */
  makeTransform: function(x, y) {
    const scaleFactor = 10 * this.vmin / 128;
    const translate = `translate(${x}vmin,${y}vmin)`;
    const scale = `scale(${scaleFactor})`;
    return `${translate} translate(-50%, -50%) ${scale}`;
  },

  onPointerDown: function(event) {
    if (this.thingsElement.classList.contains('editing')) {
      return;
    }
    if (event.type === 'mousedown' && event.buttons !== 1) {
      return;
    }
    // Prevent interaction with HTML5 drag and drop
    event.preventDefault();
    event.stopPropagation();

    this.selectedThing = event.currentTarget;
    this.interactTimeout = setTimeout(() => {
      if (this.selectedThing) {
        page(`${this.selectedThing.dataset.href}?referrer=%2Ffloorplan`);
      }
      this.interactTimeout = null;
    }, 750);
  },

  onPointerUp: function(event) {
    if (this.thingsElement.classList.contains('editing')) {
      return;
    }
    if (!this.selectedThing) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const thing = this.things[this.selectedThing.dataset.index];
    if (this.interactTimeout) {
      if (thing.handleClick) {
        thing.handleClick();
      }
      clearTimeout(this.interactTimeout);
      this.interactTimeout = null;
    }
    this.selectedThing = null;
  },

  /*
   * Send an event into a black hole, never to be seen again.
   *
   * @param {Event} e Event to black hole.
   */
  blackHole: (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
};

module.exports = FloorplanScreen;
