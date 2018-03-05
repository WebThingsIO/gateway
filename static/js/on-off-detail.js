/**
 * OnOffDetail
 *
 * A bubble showing the on/off state of a thing
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* globals Utils */

function OnOffDetail(thing) {
  this.thing = thing;
}

OnOffDetail.prototype.attach = function() {
  this.onOffSwitch = this.thing.element.querySelector('.switch-checkbox');
  this.onOffSwitch.addEventListener('click',
                                    this.thing.handleClick.bind(this.thing));
  this.onOffLabel = this.thing.element.querySelector('.on-off-label');
};

OnOffDetail.prototype.view = function() {
  let checked = this.thing.properties.on;
  let onoff = checked ? 'on' : 'off';
  let id = this.thing.id;

  return `<div class="thing-detail-container">
    <div class="thing-detail on-off-switch-switch">
      <div class="thing-detail-contents">
        <form class="switch">
          <input type="checkbox" id="switch-${Utils.escapeHtml(id)}"
                 class="switch-checkbox" ${checked}/>
          <label class="switch-slider" for="switch-${Utils.escapeHtml(id)}">
          </label>
        </form>
        <div class="on-off-label">
          ${onoff}
        </div>
      </div>
    </div>
    <div class="thing-detail-label">On/Off</div>
  </div>`;
};

OnOffDetail.prototype.update = function() {
  let on = this.thing.properties.on;
  if (this.onOffLabel && this.onOffSwitch) {
    this.onOffLabel.textContent = on ? 'on' : 'off';
    this.onOffSwitch.checked = on;
  }
};
