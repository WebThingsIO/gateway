/**
 * Extension add-on class.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const App = require('./app');
const Menu = require('./views/menu');

class Extension {
  constructor(id) {
    this.id = id;
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
   * Show the extension content.
   */
  show() {
    console.log(`Extension ${this.id} is being shown.`);
  }
}

// Elevate this to the window level.
window.Extension = Extension;

module.exports = Extension;
