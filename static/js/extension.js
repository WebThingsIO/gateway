/**
 * Extension add-on class.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const Constants = require('./constants');
const App = require('./app');
const Menu = require('./views/menu');

class Extension {
  constructor(id) {
    this.id = id;
    this.preferences = {
      language: App.LANGUAGE,
      timezone: App.TIMEZONE,
      units: App.UNITS,
    };
    this.property_subscriptions = {};
    this.event_subscriptions = {};
    this.view = App.registerExtension(this);
  }

  /**
   * Add a new top-level menu entry.
   *
   * @param {string} name - The name to insert into the menu.
   *
   * @returns {Node} Node object which the extension can draw content to.
   */
  addMenuEntry(name) {
    return Menu.addExtensionItem(this, name);
  }

  /**
   * Load your html page here
   *
   * @returns {Promise} Promise which should resolve as soon as the extension
   *                    is ready to be shown
   */
  load() {
    return Promise.resolve();
  }

  /**
   * Show the extension content.
   *
   * @param {Context} context - Context object from page.js. You'll want to use
   *                            this to parse the URL and such, as your
   *                            extension will be shown before window.location
   *                            is updated. See:
   *                            https://www.npmjs.com/package/page#context
   */
  show(_context) {
    console.log(`Extension ${this.id} is being shown.`);
  }

  /**
   * Hide the extension content.
   *
   * The content will be hidden for you, but this callback can be used to do
   * any required unloading steps.
   */
  hide() {
    console.log(`Extension ${this.id} is being hidden.`);
  }

  /**
   * Show the top-level menu button, rather than the back button.
   */
  showMenuButton() {
    App.showMenuButton();

    const backButton = document.getElementById('extension-back-button');
    backButton.classList.add('hidden');
  }

  /**
   * Show the top-level back button, rather than the menu button.
   */
  showBackButton(href) {
    App.hideMenuButton();

    const backButton = document.getElementById('extension-back-button');
    backButton.href = href;
    backButton.classList.remove('hidden');
  }

  /**
   * Allow extensions to subscribe to property changes from Things so that
   * they don't need to create and manage their own websocket clients
   */
  subscribeToThingProperties(thingId,handler) {
    if (typeof thingId !== 'string' || typeof handler !== 'function') {
      console.error("extension: subscribeToThingProperties: invalid thingId or handler");
      return false
    }
    App.gatewayModel.getThingModel(thingId).then((thingModel) => {
      this.property_subscriptions[thingId] = thingModel.subscribe(Constants.PROPERTY_STATUS, handler);
    });
  }

  /**
   * Allow extensions to subscribe to events from Things so that
   * they don't need to create and manage their own websocket clients
   */
  subscribeToThingEvents(thingId,handler) {
    if (typeof thingId !== 'string' || typeof handler !== 'function') {
      console.error("extension: subscribeToThingEvents: invalid thingId or handler");
      return false
    }
    App.gatewayModel.getThingModel(thingId).then((thingModel) => {
      this.event_subscriptions[thingId] = thingModel.subscribe(Constants.EVENT_OCCURRED, handler);
    });
  }
}

// Elevate this to the window level.
window.Extension = Extension;

module.exports = Extension;
