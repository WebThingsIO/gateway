/**
 * ChoiceDetail
 *
 * A bubble showing property choices that can be set on a thing
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('./utils');

function ChoiceDetail(thing, name, friendlyName, unit, choices) {
  this.thing = thing;
  this.name = name;
  this.friendlyName = friendlyName;
  this.unit = unit;
  this.choices = choices;
  this.select_css_id = `choice-${this.name}`;

}

ChoiceDetail.prototype.attach = function() {
  this.select = this.thing.element.querySelector(`#${this.select_css_id}`);
  this.select.addEventListener('change', this.set.bind(this));
};

ChoiceDetail.prototype.view = function() {
  const currentChoice = this.thing.properties[this.name];

  let choicesHTML = '';
  for (const choiceName of this.choices) {
      choicesHTML += `<option value="${choiceName}">${choiceName} ${this.unit}</option>`;
  }
  return `<div class="thing-detail-container choice-detail-container">` +
         `  <div class="thing-detail choice-detail">` +
         `    <div class="thing-detail-contents">` +
         `      <select id="${this.select_css_id}"` +
         `              class="choice-input"` +
         `              value="${Utils.escapeHtml(currentChoice)}">` +
         `        ${choicesHTML}` +
         `      </select>` +
         `    </div>` +
         `  </div>` +
         `  <div class="thing-detail-label">${Utils.escapeHtml(this.friendlyName)}</div>` +
         `</div>`;
};

ChoiceDetail.prototype.update = function() {
  if (!this.select) {
    return;
  }

  const newValue = this.thing.properties[this.name];

  const currentValue = this.select.value;

  if (newValue == currentValue) {
    return;
  }

  this.select.value = newValue;
};

ChoiceDetail.prototype.set = function() {
  const selectedChoice = this.select.value;
  this.thing.setProperty(this.name, selectedChoice);
};

module.exports = ChoiceDetail;
