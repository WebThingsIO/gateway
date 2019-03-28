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

const page = require('page');
const ActionInputForm = require('./action-input-form');
const AddThingScreen = require('./add-thing');
const Alarm = require('../schema-impl/capability/alarm');
const App = require('../app');
const BinarySensor = require('../schema-impl/capability/binary-sensor');
const Camera = require('../schema-impl/capability/camera');
const ColorControl = require('../schema-impl/capability/color-control');
const Constants = require('../constants');
const DoorSensor = require('../schema-impl/capability/door-sensor');
const EnergyMonitor = require('../schema-impl/capability/energy-monitor');
const EventList = require('./event-list');
const Icons = require('../icons');
const LeakSensor = require('../schema-impl/capability/leak-sensor');
const Light = require('../schema-impl/capability/light');
const MotionSensor = require('../schema-impl/capability/motion-sensor');
const MultiLevelSensor =
  require('../schema-impl/capability/multi-level-sensor');
const MultiLevelSwitch =
  require('../schema-impl/capability/multi-level-switch');
const OnOffSwitch = require('../schema-impl/capability/on-off-switch');
const PushButton = require('../schema-impl/capability/push-button');
const SmartPlug = require('../schema-impl/capability/smart-plug');
const TemperatureSensor =
  require('../schema-impl/capability/temperature-sensor');
const Thing = require('../schema-impl/capability/thing');
const VideoCamera = require('../schema-impl/capability/video-camera');

// eslint-disable-next-line no-unused-vars
const ThingsScreen = {

  NO_THINGS_MESSAGE: 'No devices yet. Click + to scan for available devices.',
  THING_NOT_FOUND_MESSAGE: 'Thing not found.',
  ACTION_NOT_FOUND_MESSAGE: 'Action not found.',
  EVENTS_NOT_FOUND_MESSAGE: 'This thing has no events.',

  /**
   * Initialise Things Screen.
   */
  init: function() {
    this.thingsElement = document.getElementById('things');
    this.thingTitleElement = document.getElementById('thing-title');
    this.addButton = document.getElementById('add-button');
    this.menuButton = document.getElementById('menu-button');
    this.backButton = document.getElementById('back-button');
    this.backRef = '/things';
    this.backButton.addEventListener('click', () => page(this.backRef));
    this.addButton.addEventListener('click',
                                    AddThingScreen.show.bind(AddThingScreen));
    this.refreshThings = this.refreshThings.bind(this);
    this.things = [];
  },

  renderThing: function(thingModel, description, format) {
    let thing;
    if (description.selectedCapability) {
      switch (description.selectedCapability) {
        case 'OnOffSwitch':
          thing = new OnOffSwitch(thingModel, description, format);
          break;
        case 'MultiLevelSwitch':
          thing = new MultiLevelSwitch(thingModel, description, format);
          break;
        case 'ColorControl':
          thing = new ColorControl(thingModel, description, format);
          break;
        case 'EnergyMonitor':
          thing = new EnergyMonitor(thingModel, description, format);
          break;
        case 'BinarySensor':
          thing = new BinarySensor(thingModel, description, format);
          break;
        case 'MultiLevelSensor':
          thing = new MultiLevelSensor(thingModel, description, format);
          break;
        case 'SmartPlug':
          thing = new SmartPlug(thingModel, description, format);
          break;
        case 'Light':
          thing = new Light(thingModel, description, format);
          break;
        case 'DoorSensor':
          thing = new DoorSensor(thingModel, description, format);
          break;
        case 'MotionSensor':
          thing = new MotionSensor(thingModel, description, format);
          break;
        case 'LeakSensor':
          thing = new LeakSensor(thingModel, description, format);
          break;
        case 'PushButton':
          thing = new PushButton(thingModel, description, format);
          break;
        case 'VideoCamera':
          thing = new VideoCamera(thingModel, description, format);
          break;
        case 'Camera':
          thing = new Camera(thingModel, description, format);
          break;
        case 'TemperatureSensor':
          thing = new TemperatureSensor(thingModel, description, format);
          break;
        case 'Alarm':
          thing = new Alarm(thingModel, description, format);
          break;
        default:
          thing = new Thing(thingModel, description, format);
          break;
      }
    } else {
      switch (description.type) {
        case 'onOffSwitch':
          thing = new OnOffSwitch(thingModel, description, format);
          break;
        case 'binarySensor':
          thing = new BinarySensor(thingModel, description, format);
          break;
        case 'multiLevelSensor':
          thing = new MultiLevelSensor(thingModel, description, format);
          break;
        case 'onOffLight':
        case 'onOffColorLight':
        case 'dimmableLight':
        case 'dimmableColorLight':
          thing = new Light(thingModel, description, format);
          break;
        case 'multiLevelSwitch':
          thing = new MultiLevelSwitch(thingModel, description, format);
          break;
        case 'smartPlug':
          thing = new SmartPlug(thingModel, description, format);
          break;
        default:
          thing = new Thing(thingModel, description, format);
          break;
      }
    }
    this.things.push(thing);
    return thing;
  },

  /**
   * Show things screen.
   *
   * @param {String} thingId Optional thing ID to show, otherwise show all.
   * @param {String} actionName Optional action input form to show.
   * @param {Boolean} events Whether or not to display the events screen.
   */
  show: function(thingId, actionName, events, queryString) {
    document.getElementById('speech-wrapper').classList.remove('assistant');

    const params = new URLSearchParams(`?${queryString || ''}`);
    if (params.has('referrer')) {
      this.backRef = params.get('referrer');
    } else {
      this.backRef = '/things';
    }

    App.hideOverflowButton();

    if (thingId) {
      this.addButton.classList.add('hidden');
      this.backButton.classList.remove('hidden');
      this.menuButton.classList.add('hidden');
      this.thingTitleElement.classList.remove('hidden');
      this.thingsElement.classList.add('single-thing');

      if (actionName) {
        this.showActionInputForm(thingId, actionName);
      } else if (events) {
        this.showEvents(thingId);
      } else {
        this.showThing(thingId);
      }
    } else {
      this.addButton.classList.remove('hidden');
      this.menuButton.classList.remove('hidden');
      this.backButton.classList.add('hidden');
      this.thingTitleElement.classList.add('hidden');
      this.thingsElement.classList.remove('single-thing');
      this.showThings();

      const messageArea = document.getElementById('message-area');
      if (App.blockMessages && messageArea.innerText === 'Disconnected') {
        App.hidePersistentMessage();
      }
    }
  },

  refreshThings: function(things) {
    let thing;
    while (typeof (thing = this.things.pop()) !== 'undefined') {
      thing.cleanup();
    }
    if (things.size === 0) {
      this.thingsElement.innerHTML = this.NO_THINGS_MESSAGE;
    } else {
      this.thingsElement.innerHTML = '';
      things.forEach((description, thingId) => {
        App.gatewayModel.getThingModel(thingId).then((thingModel) => {
          this.renderThing(thingModel, description);
        });
      });
    }
  },

  /**
   * Display all connected web things.
   */
  showThings: function() {
    App.gatewayModel.unsubscribe(Constants.REFRESH_THINGS, this.refreshThing);
    App.gatewayModel.unsubscribe(Constants.DELETE_THINGS, this.refreshThing);
    App.gatewayModel.subscribe(Constants.DELETE_THINGS, this.refreshThings);
    App.gatewayModel.subscribe(
      Constants.REFRESH_THINGS,
      this.refreshThings,
      true);
  },

  /**
   * Display a single Thing.
   *
   * @param {String} thingId The ID of the Thing to show.
   */
  showThing: function(thingId) {
    App.gatewayModel.unsubscribe(Constants.REFRESH_THINGS, this.refreshThing);
    App.gatewayModel.unsubscribe(Constants.DELETE_THINGS, this.refreshThing);
    App.gatewayModel.unsubscribe(Constants.REFRESH_THINGS, this.refreshThings);
    App.gatewayModel.unsubscribe(Constants.DELETE_THINGS, this.refreshThings);

    this.refreshThing = () => {
      return App.gatewayModel.getThing(thingId).then(async (description) => {
        this.thingsElement.innerHTML = '';

        const thingModel = await App.gatewayModel.getThingModel(thingId);
        const thing = this.renderThing(thingModel,
                                       description,
                                       Constants.ThingFormat.EXPANDED);

        const iconEl = document.getElementById('thing-title-icon');
        const customIconEl = document.getElementById('thing-title-custom-icon');
        if (thing.iconHref && thing.selectedCapability === 'Custom') {
          customIconEl.iconHref = thing.iconHref;
          customIconEl.classList.remove('hidden');
          iconEl.style.backgroundImage = '';
          iconEl.classList.add('custom-thing');
        } else {
          iconEl.style.backgroundImage = `url("${thing.baseIcon}")`;
          iconEl.classList.remove('custom-thing');
          customIconEl.classList.add('hidden');
        }

        document.getElementById('thing-title-name').innerText = thing.name;

        const speechWrapper = document.getElementById('speech-wrapper');
        if (speechWrapper.classList.contains('hidden')) {
          this.thingTitleElement.classList.remove('speech-enabled');
        } else {
          this.thingTitleElement.classList.add('speech-enabled');
        }

        this.thingTitleElement.classList.remove('hidden');
      }).catch((e) => {
        console.error(`Thing id ${thingId} not found ${e}`);
        this.thingsElement.innerHTML = this.THING_NOT_FOUND_MESSAGE;
      });
    };

    App.gatewayModel.subscribe(
      Constants.REFRESH_THINGS,
      this.refreshThing,
      true
    );
    App.gatewayModel.subscribe(Constants.DELETE_THINGS, this.refreshThing);
  },

  /**
   * Display an action input form.
   *
   * @param {String} thingId The ID of the Thing to show.
   * @param {String} actionName The name of the action to show.
   */
  showActionInputForm: function(thingId, actionName) {
    App.gatewayModel.getThing(thingId).then((description) => {
      this.thingsElement.innerHTML = '';

      if (!description.hasOwnProperty('actions') ||
          !description.actions.hasOwnProperty(actionName) ||
          !description.actions[actionName].hasOwnProperty('input')) {
        this.thingsElement.innerHTML = this.ACTION_NOT_FOUND_MESSAGE;
        return;
      }

      let href;
      for (const link of description.links) {
        if (link.rel === 'actions') {
          href = link.href;
          break;
        }
      }

      let icon;
      if (description.selectedCapability) {
        icon = Icons.capabilityToIcon(description.selectedCapability);
      } else {
        icon = Icons.typeToIcon(description.type);
      }

      const iconEl = document.getElementById('thing-title-icon');
      const customIconEl = document.getElementById('thing-title-custom-icon');
      if (description.iconHref &&
          description.selectedCapability === 'Custom') {
        customIconEl.iconHref = description.iconHref;
        customIconEl.classList.remove('hidden');
        iconEl.style.backgroundImage = '';
        iconEl.classList.add('custom-thing');
      } else {
        iconEl.style.backgroundImage = `url("${icon}")`;
        iconEl.classList.remove('custom-thing');
        customIconEl.classList.add('hidden');
      }

      document.getElementById('thing-title-name').innerText =
        description.name;

      this.thingsElement.innerHTML = '';
      new ActionInputForm(href, actionName,
                          description.actions[actionName].title ||
                            description.actions[actionName].label,
                          description.actions[actionName].input);
    }).catch((e) => {
      console.error(`Thing id ${thingId} not found ${e}`);
      this.thingsElement.innerHTML = this.THING_NOT_FOUND_MESSAGE;
    });
  },

  /**
   * Display an events list.
   *
   * @param {String} thingId The ID of the Thing to show.
   */
  showEvents: function(thingId) {
    if (typeof this.eventList !== 'undefined') {
      this.eventList.cleanup();
    }
    App.gatewayModel.getThing(thingId).then(async (description) => {
      this.thingsElement.innerHTML = '';
      if (!description.hasOwnProperty('events')) {
        this.thingsElement.innerHTML = this.EVENTS_NOT_FOUND_MESSAGE;
        return;
      }

      const thingModel = await App.gatewayModel.getThingModel(thingId);

      let icon;
      if (description.selectedCapability) {
        icon = Icons.capabilityToIcon(description.selectedCapability);
      } else {
        icon = Icons.typeToIcon(description.type);
      }

      const iconEl = document.getElementById('thing-title-icon');
      const customIconEl = document.getElementById('thing-title-custom-icon');
      if (description.iconHref && description.selectedCapability === 'Custom') {
        customIconEl.iconHref = description.iconHref;
        customIconEl.classList.remove('hidden');
        iconEl.style.backgroundImage = '';
        iconEl.classList.add('custom-thing');
      } else {
        iconEl.style.backgroundImage = `url("${icon}")`;
        iconEl.classList.remove('custom-thing');
        customIconEl.classList.add('hidden');
      }

      document.getElementById('thing-title-name').innerText = description.name;

      this.thingsElement.innerHTML = '';
      this.eventList = new EventList(thingModel, description);
    }).catch((e) => {
      console.error(`Thing id ${thingId} not found ${e}`);
      this.thingsElement.innerHTML = this.THING_NOT_FOUND_MESSAGE;
    });
  },
};

module.exports = ThingsScreen;
