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
      // double-encode slashes to make page.js happy
      const base = `${window.location.pathname}/actions/${
        encodeURIComponent(this.name).replace(/%2F/g, '%252F')}`;
      const params = new URLSearchParams();
      params.set(
        'referrer',
        encodeURIComponent(window.location.pathname)
      );
      this.inputPageRef = `${base}?${params.toString()}`;
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
        data-name="${Utils.escapeHtml(this.label)}">
      </webthing-action>`;
  }

  handleClick() {
    const input = {};
    if (typeof this.input === 'undefined') {
      API.postJson(this.href, {[this.name]: {input}}).catch((e) => {
        console.error(`Error performing action "${this.name}": ${e}`);
      });
    } else {
      page(this.inputPageRef);
    }
  }
}

module.exports = ActionDetail;
