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

const page = require('./lib/page');
const API = require('./api');
const ActionInputForm = require('./action-input-form');
const AddThingScreen = require('./add-thing');
const App = require('./app');
const BinarySensor = require('./binary-sensor');
const ColorControl = require('./color-control');
const EnergyMonitor = require('./energy-monitor');
const EventList = require('./event-list');
const Light = require('./light');
const MultiLevelSensor = require('./multi-level-sensor');
const MultiLevelSwitch = require('./multi-level-switch');
const OnOffSwitch = require('./on-off-switch');
const SmartPlug = require('./smart-plug');
const Thing = require('./thing');

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
    window.addEventListener('_thingchange', this.showThings.bind(this));
    this.backButton.addEventListener('click', () => page(this.backRef));
    this.addButton.addEventListener('click',
                                    AddThingScreen.show.bind(AddThingScreen));
  },

  /**
   * Show things screen.
   *
   * @param {String} thingId Optional thing ID to show, otherwise show all.
   * @param {String} actionName Optional action input form to show.
   * @param {Boolean} events Whether or not to display the events screen.
   */
  show: function(thingId, actionName, events, queryString) {
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
    fetch('/things', opts).then((response) => {
      return response.json();
    }).then((things) => {
      if (things.length === 0) {
        this.thingsElement.innerHTML = this.NO_THINGS_MESSAGE;
      } else {
        this.thingsElement.innerHTML = '';
        things.forEach((description) => {
          if (description.selectedCapability) {
            switch (description.selectedCapability) {
              case 'OnOffSwitch':
                new OnOffSwitch(description);
                break;
              case 'MultiLevelSwitch':
                new MultiLevelSwitch(description);
                break;
              case 'ColorControl':
                new ColorControl(description);
                break;
              case 'EnergyMonitor':
                new EnergyMonitor(description);
                break;
              case 'BinarySensor':
                new BinarySensor(description);
                break;
              case 'MultiLevelSensor':
                new MultiLevelSensor(description);
                break;
              case 'SmartPlug':
                new SmartPlug(description);
                break;
              case 'Light':
                new Light(description);
                break;
              default:
                new Thing(description);
                break;
            }
          } else {
            switch (description.type) {
              case 'onOffSwitch':
                new OnOffSwitch(description);
                break;
              case 'onOffLight':
              case 'onOffColorLight':
              case 'dimmableLight':
              case 'dimmableColorLight':
                new Light(description);
                break;
              case 'binarySensor':
                new BinarySensor(description);
                break;
              case 'multiLevelSensor':
                new MultiLevelSensor(description);
                break;
              case 'multiLevelSwitch':
                new MultiLevelSwitch(description);
                break;
              case 'smartPlug':
                new SmartPlug(description);
                break;
              default:
                new Thing(description);
                break;
            }
          }
        });
      }
    });
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
    fetch(`/things/${encodeURIComponent(id)}`, opts).then((response) => {
      if (response.status == 404) {
        this.thingsElement.innerHTML = this.THING_NOT_FOUND_MESSAGE;
        return;
      }
      response.json().then((description) => {
        if (!description) {
          this.thingsElement.innerHTML = this.THING_NOT_FOUND_MESSAGE;
          return;
        }
        this.thingsElement.innerHTML = '';
        let thing;
        if (description.selectedCapability) {
          switch (description.selectedCapability) {
            case 'OnOffSwitch':
              thing = new OnOffSwitch(description, 'htmlDetail');
              break;
            case 'MultiLevelSwitch':
              thing = new MultiLevelSwitch(description, 'htmlDetail');
              break;
            case 'ColorControl':
              thing = new ColorControl(description, 'htmlDetail');
              break;
            case 'EnergyMonitor':
              thing = new EnergyMonitor(description, 'htmlDetail');
              break;
            case 'BinarySensor':
              thing = new BinarySensor(description, 'htmlDetail');
              break;
            case 'MultiLevelSensor':
              thing = new MultiLevelSensor(description, 'htmlDetail');
              break;
            case 'SmartPlug':
              thing = new SmartPlug(description, 'htmlDetail');
              break;
            case 'Light':
              thing = new Light(description, 'htmlDetail');
              break;
            default:
              thing = new Thing(description, 'htmlDetail');
              break;
          }
        } else {
          switch (description.type) {
            case 'onOffSwitch':
              thing = new OnOffSwitch(description, 'htmlDetail');
              break;
            case 'binarySensor':
              thing = new BinarySensor(description, 'htmlDetail');
              break;
            case 'multiLevelSensor':
              thing = new MultiLevelSensor(description, 'htmlDetail');
              break;
            case 'onOffLight':
            case 'onOffColorLight':
            case 'dimmableLight':
            case 'dimmableColorLight':
              thing = new Light(description, 'htmlDetail');
              break;
            case 'multiLevelSwitch':
              thing = new MultiLevelSwitch(description, 'htmlDetail');
              break;
            case 'smartPlug':
              thing = new SmartPlug(description, 'htmlDetail');
              break;
            default:
              thing = new Thing(description, 'htmlDetail');
              break;
          }
        }

        const iconEl = document.getElementById('thing-title-icon');
        const customIconEl = document.getElementById('thing-title-custom-icon');
        if (thing.iconHref && thing.selectedCapability === 'Custom') {
          customIconEl.iconHref = thing.iconHref;
          customIconEl.classList.remove('hidden');
          iconEl.classList.add('hidden');
        } else {
          iconEl.src = thing.baseIcon;
          iconEl.classList.remove('hidden');
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
      });
    });
  },

  /**
   * Display an action input form.
   *
   * @param {String} thingId The ID of the Thing to show.
   * @param {String} actionName The name of the action to show.
   */
  showActionInputForm: function(thingId, actionName) {
    const opts = {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    };

    // Fetch a thing from the server
    fetch(`/things/${encodeURIComponent(thingId)}`, opts).then((response) => {
      if (response.status == 404) {
        this.thingsElement.innerHTML = this.THING_NOT_FOUND_MESSAGE;
        return;
      }

      response.json().then((description) => {
        if (!description) {
          this.thingsElement.innerHTML = this.THING_NOT_FOUND_MESSAGE;
          return;
        }

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
          switch (description.selectedCapability) {
            case 'OnOffSwitch':
              icon = '/optimized-images/thing-icons/on_off_switch.svg';
              break;
            case 'MultiLevelSwitch':
              icon = '/optimized-images/thing-icons/multi_level_switch.svg';
              break;
            case 'ColorControl':
              icon = '/optimized-images/thing-icons/color_control.svg';
              break;
            case 'EnergyMonitor':
              icon = '/optimized-images/thing-icons/energy_monitor.svg';
              break;
            case 'BinarySensor':
              icon = '/optimized-images/thing-icons/binary_sensor.svg';
              break;
            case 'MultiLevelSensor':
              icon = '/optimized-images/thing-icons/multi_level_sensor.svg';
              break;
            case 'SmartPlug':
              icon = '/optimized-images/thing-icons/smart_plug.svg';
              break;
            case 'Light':
              icon = '/optimized-images/thing-icons/light.svg';
              break;
            case 'Custom':
            default:
              icon = '/optimized-images/thing-icons/thing.svg';
              break;
          }
        } else {
          switch (description.type) {
            case 'onOffSwitch':
              icon = '/optimized-images/thing-icons/on_off_switch.svg';
              break;
            case 'binarySensor':
              icon = '/optimized-images/thing-icons/binary_sensor.svg';
              break;
            case 'multiLevelSensor':
              icon = '/optimized-images/thing-icons/multi_level_sensor.svg';
              break;
            case 'onOffLight':
            case 'onOffColorLight':
            case 'dimmableLight':
            case 'dimmableColorLight':
              icon = '/optimized-images/thing-icons/light.svg';
              break;
            case 'multiLevelSwitch':
              icon = '/optimized-images/thing-icons/multi_level_switch.svg';
              break;
            case 'smartPlug':
              icon = '/optimized-images/thing-icons/smart_plug.svg';
              break;
            default:
              icon = '/optimized-images/thing-icons/thing.svg';
              break;
          }
        }

        const iconEl = document.getElementById('thing-title-icon');
        const customIconEl = document.getElementById('thing-title-custom-icon');
        if (description.iconHref &&
            description.selectedCapability === 'Custom') {
          customIconEl.iconHref = description.iconHref;
          customIconEl.classList.remove('hidden');
          iconEl.classList.add('hidden');
        } else {
          iconEl.src = icon;
          iconEl.classList.remove('hidden');
          customIconEl.classList.add('hidden');
        }

        document.getElementById('thing-title-name').innerText =
          description.name;

        this.thingsElement.innerHTML = '';
        new ActionInputForm(href, actionName,
                            description.actions[actionName].label,
                            description.actions[actionName].input);
      });
    });
  },

  /**
   * Display an events list.
   *
   * @param {String} thingId The ID of the Thing to show.
   */
  showEvents: function(thingId) {
    const opts = {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    };

    // Fetch a thing from the server
    fetch(`/things/${encodeURIComponent(thingId)}`, opts).then((response) => {
      if (response.status == 404) {
        return Promise.resolve();
      }

      return response.json();
    }).then((description) => {
      if (!description) {
        this.thingsElement.innerHTML = this.THING_NOT_FOUND_MESSAGE;
        return;
      }

      if (!description.hasOwnProperty('events')) {
        this.thingsElement.innerHTML = this.EVENTS_NOT_FOUND_MESSAGE;
        return;
      }

      let icon;
      if (description.selectedCapability) {
        switch (description.selectedCapability) {
          case 'OnOffSwitch':
            icon = '/optimized-images/thing-icons/on_off_switch.svg';
            break;
          case 'MultiLevelSwitch':
            icon = '/optimized-images/thing-icons/multi_level_switch.svg';
            break;
          case 'ColorControl':
            icon = '/optimized-images/thing-icons/color_control.svg';
            break;
          case 'EnergyMonitor':
            icon = '/optimized-images/thing-icons/energy_monitor.svg';
            break;
          case 'BinarySensor':
            icon = '/optimized-images/thing-icons/binary_sensor.svg';
            break;
          case 'MultiLevelSensor':
            icon = '/optimized-images/thing-icons/multi_level_sensor.svg';
            break;
          case 'SmartPlug':
            icon = '/optimized-images/thing-icons/smart_plug.svg';
            break;
          case 'Light':
            icon = '/optimized-images/thing-icons/light.svg';
            break;
          case 'Custom':
          default:
            icon = '/optimized-images/thing-icons/thing.svg';
            break;
        }
      } else {
        switch (description.type) {
          case 'onOffSwitch':
            icon = '/optimized-images/thing-icons/on_off_switch.svg';
            break;
          case 'binarySensor':
            icon = '/optimized-images/thing-icons/binary_sensor.svg';
            break;
          case 'multiLevelSensor':
            icon = '/optimized-images/thing-icons/multi_level_sensor.svg';
            break;
          case 'onOffLight':
          case 'onOffColorLight':
          case 'dimmableLight':
          case 'dimmableColorLight':
            icon = '/optimized-images/thing-icons/light.svg';
            break;
          case 'multiLevelSwitch':
            icon = '/optimized-images/thing-icons/multi_level_switch.svg';
            break;
          case 'smartPlug':
            icon = '/optimized-images/thing-icons/smart_plug.svg';
            break;
          default:
            icon = '/optimized-images/thing-icons/thing.svg';
            break;
        }
      }

      const iconEl = document.getElementById('thing-title-icon');
      const customIconEl = document.getElementById('thing-title-custom-icon');
      if (description.iconHref && description.selectedCapability === 'Custom') {
        customIconEl.iconHref = description.iconHref;
        customIconEl.classList.remove('hidden');
        iconEl.classList.add('hidden');
      } else {
        iconEl.src = icon;
        iconEl.classList.remove('hidden');
        customIconEl.classList.add('hidden');
      }

      document.getElementById('thing-title-name').innerText = description.name;

      this.thingsElement.innerHTML = '';
      new EventList(description);
    });
  },
};

module.exports = ThingsScreen;
