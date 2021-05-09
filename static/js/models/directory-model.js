/**
 * Directory Model.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('../api').default;
const App = require('../app');
const Model = require('./model');
const Constants = require('../constants');

class DirectoryModel extends Model {
  constructor(description) {
    super();
    this.updateFromDescription(description);
    return this;
  }

  updateFromDescription(description) {
    this.title = description.title;

    // Parse base URL of Directory
    if (description.href) {
      this.href = new URL(description.href, App.ORIGIN);
      this.id = decodeURIComponent(this.href.pathname.split('/').pop());
    }
  }

  /**
   * Remove the directory.
   */
  removeDirectory() {
    return API.removeDirectory(this.id).then(() => {
      this.handleEvent(Constants.DELETE_DIRECTORY, this.id);
      this.cleanup();
    });
  }

  /**
   * Update the directory.
   */
  updateDirectory(updates) {
    return API.updateDirectory(this.id, updates);
  }

  subscribe(event, handler) {
    super.subscribe(event, handler);
    switch (event) {
      case Constants.DELETE_DIRECTORY:
        break;
      default:
        console.warn(`DirectoryModel does not support event:${event}`);
        break;
    }
  }
}

module.exports = DirectoryModel;
