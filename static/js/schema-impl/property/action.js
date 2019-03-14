/**
 * ActionDetail
 *
 * A bubble showing a button for an action.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('../../api');
const Utils = require('../../utils');
const page = require('page');

class ActionDetail {
  constructor(thing, name, action, href) {
    this.thing = thing;
    this.name = name;
    this.label = action.title || action.label || name;
    this.input = action.input;
    this.href = href;
    this.id = `action-button-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.button = this.thing.element.querySelector(`#${this.id}`);
    this.button.addEventListener('click', this.handleClick.bind(this));
  }

  view() {
    let disabled = '';
    if (typeof this.input !== 'undefined') {
      const base = `${window.location.pathname}/actions/${this.name}`;
      const referrer = encodeURIComponent(window.location.pathname);
      this.inputPageRef = `${encodeURI(base)}?referrer=${referrer}`;
      if (typeof this.input === 'object' &&
          ((this.input.hasOwnProperty('required') &&
            Array.isArray(this.input.required) &&
            this.input.required.length > 0) ||
           this.input.type !== 'object')) {
        disabled = 'disabled';
      }
    }

    return `
      <webthing-action ${disabled} id="${this.id}"
        data-name="${Utils.escapeHtml(this.label)}"
      </webthing-action>`;
  }

  handleClick() {
    const input = {};
    if (typeof this.input === 'undefined') {
      fetch(this.href, {
        method: 'POST',
        body: JSON.stringify({[this.name]: {input}}),
        headers: {
          Authorization: `Bearer ${API.jwt}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).catch((e) => {
        console.error(`Error performing action "${this.name}": ${e}`);
      });
    } else {
      page(this.inputPageRef);
    }
  }
}

module.exports = ActionDetail;
