/**
 * Label Detail
 *
 * A bubble showing some basic information with no input.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

function LabelDetail(thing, name, friendlyName, unit) {
  this.thing = thing;
  this.name = name;
  this.friendlyName = friendlyName;
  this.unit = unit;
}

LabelDetail.prototype.attach = function() {
  this.label = this.thing.element.querySelector(`#label-${this.name}`);
};

LabelDetail.prototype.view = function() {
  const value = parseFloat(this.thing.properties[this.name]);
  const data = value ? `${value.toFixed(2)}${this.unit}` : `0${this.unit}`;

  return `<div class="thing-detail-container">
    <div class="thing-detail label">
      <div class="thing-detail-contents">
        <div class="generic-label" id="label-${this.name}">
          ${data}
        </div>
      </div>
    </div>
    <div class="thing-detail-label">${this.friendlyName}</div>
  </div>`;
};

LabelDetail.prototype.update = function() {
  if (!this.label) {
    return;
  }

  const value = parseFloat(this.thing.properties[this.name]);
  this.label.innerText =
    value ? `${value.toFixed(2)}${this.unit}` : `0${this.unit}`;
};
