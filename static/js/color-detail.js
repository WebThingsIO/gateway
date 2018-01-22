/**
 * ColorDetail
 *
 * A bubble showing the color of a thing
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';
function ColorDetail(thing) {
  this.thing = thing;
}

ColorDetail.prototype.attach = function() {
  this.color = this.thing.element.querySelector('.color-light-color');
  this.color.addEventListener('input', () => {
    this.thing.updateColor(this.color.value);
  });
  this.color.addEventListener('change', this.set.bind(this));
}

ColorDetail.prototype.view = function() {
  let color = this.thing.properties.color;
  return `<div class="thing-detail-container">
    <div class="thing-detail">
      <input class="thing-detail-contents color-light-color" type="color"
             value="${color}"/>
    </div>
    <div class="thing-detail-label">Color</div>
  </div>`;
};

ColorDetail.prototype.update = function() {
  if (this.thing.properties.color == this.color.value) {
    return;
  }
  this.color.value = this.thing.properties.color;
};

ColorDetail.prototype.set = function() {
  this.thing.setColor(this.color.value);
};

