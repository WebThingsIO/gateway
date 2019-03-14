/**
 * AddonConfig.
 *
 * Configuration screen for the addon installed.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const SchemaForm = require('../schema-form/schema-form');
const page = require('page');
const API = require('../api');

class AddonConfig {
  /**
   * AddonConfig constructor.
   *
   * @param {Object} id add-on id.
   * @param {Object} metadata metadata object.
   */
  constructor(id, metadata) {
    this.schema = metadata.moziot.schema;
    this.config = metadata.moziot.config;
    this.id = id;
    this.name = metadata.name;
    this.container = document.getElementById('addon-config-settings');
    this.render();
  }

  scrollToTop() {
    this.container.scrollTop = 0;
  }

  handleApply(formData, errors) {
    if (errors.length > 0) {
      this.scrollToTop();
    } else {
      this.configForm.submitButton.innerText = 'Applying...';
      API.setAddonConfig(this.id, formData)
        .then(() => {
          page('/settings/addons');
        })
        .catch((err) => {
          console.error(`Failed to set config add-on: ${this.name}\n${err}`);
          this.configForm.errorField.render([err]);
          this.configForm.submitButton.innerText = 'Apply';
        });
    }
  }

  /**
   * Render AddonConfig view and add to DOM.
   */
  render() {
    this.configForm = new SchemaForm(this.schema,
                                     `addon-config-${this.id}`,
                                     this.name,
                                     this.config,
                                     this.handleApply.bind(this),
                                     {submitText: 'Apply'});
    this.container.appendChild(this.configForm.render());
  }
}

module.exports = AddonConfig;
