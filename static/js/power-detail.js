/**
 * Power Detail
 *
 * A bubble showing the instantaneous power consumption of a device.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

function PowerDetail(thing) {
  this.thing = thing;
}

PowerDetail.prototype.attach = function() {
  this.powerLabel = this.thing.element.querySelector('.power-label');
};

PowerDetail.prototype.view = function() {
  let power = this.thing.properties.power || '0W';

  return `<div class="thing-detail-container">
    <div class="thing-detail power">
      <div class="thing-detail-contents">
        <div class="power-label">
          ${power}
        </div>
      </div>
    </div>
    <div class="thing-detail-label">Power</div>
  </div>`;
};

PowerDetail.prototype.update = function() {
  let power = this.thing.properties.power;
  if (power) {
    this.powerLabel.innerText = power + 'W';
  } else {
    this.powerLabel.innerText = '0W';
  }
};
