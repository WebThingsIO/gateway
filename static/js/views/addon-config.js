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
const fluent = require('../fluent');

class AddonConfig {
  /**
   * AddonConfig constructor.
   *
   * @param {Object} id add-on id.
   * @param {Object} metadata metadata object.
   */
  constructor(id, metadata) {
    this.schema = metadata.schema;
    this.id = id;
    this.name = metadata.name;
    this.primaryType = metadata.primary_type;
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
      this.configForm.submitButton.innerText =
        fluent.getMessage('addon-config-applying');
      API.setAddonConfig(this.id, formData)
        .then(() => {
          page('/settings/addons');
        })
        .catch((err) => {
          console.error(
            `Failed to set config for add-on: ${this.name}\n${err}`
          );
          this.configForm.errorField.render([err]);
          this.configForm.submitButton.innerText =
            fluent.getMessage('addon-config-apply');
        });
    }
  }

  /**
   * Render AddonConfig view and add to DOM.
   */
  render() {
    const icon = this.container.querySelector('.section-title-icon');
    switch (this.primaryType) {
      case 'adapter':
        icon.src = '/images/adapters-icon.png';
        break;
      case 'notifier':
        icon.src = '/images/thing-icons/notification.svg';
        break;
      case 'extension':
      default:
        icon.src = '/images/add-on.svg';
        break;
    }

    API.getAddonConfig(this.id)
      .then((config) => {
        this.configForm = new SchemaForm(
          this.schema,
          `addon-config-${this.id}`,
          this.name,
          config,
          this.handleApply.bind(this),
          {submitText: fluent.getMessage('addon-config-apply')});
        this.container.appendChild(this.configForm.render());
      })
      .catch((err) => {
        console.error(`Failed to get config for add-on: ${this.name}\n${err}`);
      });
  }
}

module.exports = AddonConfig;
