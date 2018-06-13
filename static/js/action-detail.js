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

const API = require('./api');
const Utils = require('./utils');

function ActionDetail(thing, name, input, href) {
  this.thing = thing;
  this.name = name;
  this.input = input;
  this.href = href;
  this.elementId = `action-button-${Utils.escapeHtmlForIdClass(name)}`;
}

ActionDetail.prototype.attach = function() {
  this.button = this.thing.element.querySelector(`#${this.elementId}`);
  this.button.addEventListener('click', this.handleClick.bind(this));
};

ActionDetail.prototype.view = function() {
  let inputLink, disabled, extraClass;
  if (typeof this.input !== 'undefined') {
    const href = `${window.location.pathname}/actions/${this.name}`;
    const referrer = encodeURIComponent(window.location.pathname);
    inputLink =
      `<a href="${encodeURI(href)}?referrer=${referrer}"
          class="action-input-link">...</a>`;
    extraClass = 'advanced-action-button';

    if (typeof this.input === 'object' &&
        ((this.input.hasOwnProperty('required') &&
          Array.isArray(this.input.required) &&
          this.input.required.length > 0) ||
         this.input.type !== 'object')) {
      disabled = 'disabled';
    } else {
      disabled = '';
    }
  } else {
    inputLink = '';
    disabled = '';
    extraClass = '';
  }

  return `<div class="thing-detail-container">
    <div class="thing-detail action">
      <div class="thing-detail-contents">
        <button id="${this.elementId}" type="button"
                class="action-button ${extraClass}" ${disabled}>
          ${Utils.escapeHtml(this.name)}
        </button>
        ${inputLink}
      </div>
    </div>
    <div class="thing-detail-label action-label">${this.name}</div>
  </div>`;
};

ActionDetail.prototype.handleClick = function() {
  const input = {};

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
};

module.exports = ActionDetail;
