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
const App = require('../app');
const Constants = require('../constants');
const EventList = require('./event-list');
const fluent = require('../fluent');
const Icons = require('../icons');
const { createThingFromCapability } = require('../schema-impl/capability/capabilities');
const API = require('../api').default;
const Utils = require('../utils');

const ThingsScreen = {
  /**
   * Initialise Things Screen.
   */
  init: function () {
    this.thingsElement = document.getElementById('things');
    this.directoriesElement = document.getElementById('directories');
    this.thingTitleElement = document.getElementById('thing-title');
    this.addButton = document.getElementById('add-button');
    this.menuButton = document.getElementById('menu-button');
    this.backButton = document.getElementById('back-button');
    this.backRef = '/things';
    this.backButton.addEventListener('click', () => page(this.backRef));
    this.addButton.addEventListener('click', AddThingScreen.show.bind(AddThingScreen));
    this.refreshThings = this.refreshThings.bind(this);
    this.things = [];
  },

  renderThing: function (thingModel, description, format) {
    const thing = createThingFromCapability(
      description.selectedCapability,
      thingModel,
      description,
      format
    );
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
  show: function (thingId, actionName, events, queryString) {
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
      if (App.blockMessages && messageArea.innerText === fluent.getMessage('disconnected')) {
        App.hidePersistentMessage();
      }
    }
  },

  refreshThings: function (things, directories) {
    let thing;
    while (typeof (thing = this.things.pop()) !== 'undefined') {
      thing.cleanup();
    }
    if (things.size === 0 && directories.size === 0) {
      this.thingsElement.innerHTML = fluent.getMessage('no-things');
    } else {
      this.thingsElement.innerHTML = '';
    }
    this.directoriesElement.innerHTML = '';
    if (directories.size !== 0) {
      directories.forEach((directory, directoryId) => {
        const directoryNode = document.createElement('DIV');
        directoryNode.setAttribute('class', 'directory');
        directoryNode.setAttribute('id', `directory-${directoryId}`);
        directoryNode.setAttribute('layoutIndex', `${directory.layoutIndex}`);

        function handleDragOver(e) {
          e.preventDefault();

          this.thingsElement.childNodes.forEach((node) => {
            node.classList.remove('drag-target');
          });

          let dropNode = e.target;
          while (!dropNode.classList || !dropNode.classList.contains('directory')) {
            dropNode = dropNode.parentNode;
          }

          if (dropNode) {
            e.dataTransfer.dropEffect = 'move';
            dropNode.classList.add('drag-target');
          }
        }

        function handleDragEnter(e) {
          e.preventDefault();
        }

        function handleDragLeave(e) {
          e.preventDefault();

          let dropNode = e.target;
          while (!dropNode.classList || !dropNode.classList.contains('directory')) {
            dropNode = dropNode.parentNode;
          }

          if (dropNode) {
            dropNode.classList.remove('drag-target');
          }
        }

        function handleDrop(e) {
          e.preventDefault();
          e.stopPropagation();

          let dropNode = e.target;
          while (!dropNode.classList || !dropNode.classList.contains('directory')) {
            dropNode = dropNode.parentNode;
          }

          const dragNode = document.getElementById(e.dataTransfer.getData('text'));

          if (!dropNode || !dragNode || dropNode.id === dragNode.id) {
            return;
          }

          dragNode.parentNode.removeChild(dragNode);

          dropNode.appendChild(dragNode);

          const dragNodeId = Utils.unescapeHtml(dragNode.id).replace(/^thing-/, '');
          directoryId = dropNode.getAttribute('id').replace(/^directory-/, '');
          API.setThingDirectory(
            dragNodeId,
            directoryId
          )
            .then(() => {
              App.gatewayModel.refreshThings();
            })
            .catch((e) => {
              console.error(`Error trying to change directory of thing ${dragNodeId}: ${e}`);
            });
        }

        directoryNode.ondragover = handleDragOver.bind(this);
        directoryNode.ondragenter = handleDragEnter.bind(this);
        directoryNode.ondragleave = handleDragLeave.bind(this);
        directoryNode.ondrop = handleDrop.bind(this);

        const bar = document.createElement('DIV');
        bar.setAttribute('class', 'bar');
        bar.setAttribute('layoutIndex', '-1');

        const title = document.createElement('DIV');
        title.setAttribute('class', 'title');
        title.innerText = directory.title;
        bar.appendChild(title);

        const removeDirectoryButton = document.createElement('BUTTON');
        removeDirectoryButton.setAttribute('class', 'remove');
        removeDirectoryButton.innerText = 'x';
        removeDirectoryButton.addEventListener('click', () => {
          App.gatewayModel.removeDirectory(directoryId);
        });
        bar.appendChild(removeDirectoryButton);

        directoryNode.appendChild(bar);

        this.directoriesElement.appendChild(directoryNode);
      });
    }
    if (things.size !== 0) {
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
  showThings: function () {
    App.gatewayModel.unsubscribe(Constants.REFRESH_THINGS, this.refreshThing);
    App.gatewayModel.unsubscribe(Constants.DELETE_THINGS, this.refreshThing);
    App.gatewayModel.subscribe(Constants.DELETE_THINGS, this.refreshThings);
    App.gatewayModel.subscribe(Constants.REFRESH_THINGS, this.refreshThings, true);
  },

  /**
   * Display a single Thing.
   *
   * @param {String} thingId The ID of the Thing to show.
   */
  showThing: function (thingId) {
    App.gatewayModel.unsubscribe(Constants.REFRESH_THINGS, this.refreshThing);
    App.gatewayModel.unsubscribe(Constants.DELETE_THINGS, this.refreshThing);
    App.gatewayModel.unsubscribe(Constants.REFRESH_THINGS, this.refreshThings);
    App.gatewayModel.unsubscribe(Constants.DELETE_THINGS, this.refreshThings);
    this.refreshThing = () => {
      return App.gatewayModel
        .getThing(thingId)
        .then(async (description) => {
          if (!description) {
            this.thingsElement.innerHTML = fluent.getMessage('thing-not-found');
            this.directoriesElement.innerHTML = '';
            return;
          }

          this.thingsElement.innerHTML = '';
          this.directoriesElement.innerHTML = '';

          const thingModel = await App.gatewayModel.getThingModel(thingId);
          const thing = this.renderThing(thingModel, description, Constants.ThingFormat.EXPANDED);

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

          document.getElementById('thing-title-title').innerText = thing.title;

          this.thingTitleElement.classList.remove('hidden');
        })
        .catch((e) => {
          console.error(`Thing id ${thingId} not found ${e}`);
          this.thingsElement.innerHTML = fluent.getMessage('thing-not-found');
          this.directoriesElement.innerHTML = '';
        });
    };

    App.gatewayModel.subscribe(Constants.REFRESH_THINGS, this.refreshThing, true);
    App.gatewayModel.subscribe(Constants.DELETE_THINGS, this.refreshThing);
  },

  /**
   * Display an action input form.
   *
   * @param {String} thingId The ID of the Thing to show.
   * @param {String} actionName The name of the action to show.
   */
  showActionInputForm: function (thingId, actionName) {
    App.gatewayModel
      .getThing(thingId)
      .then((description) => {
        this.thingsElement.innerHTML = '';
        this.directoriesElement.innerHTML = '';

        if (
          !description.hasOwnProperty('actions') ||
          !description.actions.hasOwnProperty(actionName) ||
          !description.actions[actionName].hasOwnProperty('input')
        ) {
          this.thingsElement.innerHTML = fluent.getMessage('action-not-found');
          this.directoriesElement.innerHTML = '';
          return;
        }

        let href;
        for (const link of description.links) {
          if (link.rel === 'actions') {
            href = link.href;
            break;
          }
        }

        const icon = Icons.capabilityToIcon(description.selectedCapability);
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

        document.getElementById('thing-title-title').innerText = description.title;

        this.thingsElement.innerHTML = '';
        this.directoriesElement.innerHTML = '';
        new ActionInputForm(
          href,
          actionName,
          description.actions[actionName].title || description.actions[actionName].label,
          description.actions[actionName].input
        );
      })
      .catch((e) => {
        console.error(`Thing id ${thingId} not found ${e}`);
        this.thingsElement.innerHTML = fluent.getMessage('thing-not-found');
        this.directoriesElement.innerHTML = '';
      });
  },

  /**
   * Display an events list.
   *
   * @param {String} thingId The ID of the Thing to show.
   */
  showEvents: function (thingId) {
    if (typeof this.eventList !== 'undefined') {
      this.eventList.cleanup();
    }
    App.gatewayModel
      .getThing(thingId)
      .then(async (description) => {
        this.thingsElement.innerHTML = '';
        this.directoriesElement.innerHTML = '';
        if (!description.hasOwnProperty('events')) {
          this.thingsElement.innerHTML = fluent.getMessage('events-not-found');
          return;
        }

        const thingModel = await App.gatewayModel.getThingModel(thingId);

        const icon = Icons.capabilityToIcon(description.selectedCapability);
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

        document.getElementById('thing-title-title').innerText = description.title;

        this.thingsElement.innerHTML = '';
        this.directoriesElement.innerHTML = '';
        this.eventList = new EventList(thingModel, description);
      })
      .catch((e) => {
        console.error(`Thing id ${thingId} not found ${e}`);
        this.thingsElement.innerHTML = fluent.getMessage('thing-not-found');
        this.directoriesElement.innerHTML = '';
      });
  },
};

module.exports = ThingsScreen;
