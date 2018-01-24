/**
 * LevelDetail
 *
 * A bubble showing the level of a thing
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';
function LevelDetail(thing) {
  this.thing = thing;
}

LevelDetail.prototype.attach = function() {
  this.level = this.thing.element.querySelector('.level-input');
  this.level.addEventListener('input', () => {
    this.thing.updateLevel(this.level.value);
  });
  this.level.addEventListener('change', this.set.bind(this));
}

LevelDetail.prototype.view = function() {
  const level = this.thing.properties.level;

  return `<div class="thing-detail-container">
    <div class="thing-detail">
      <div class="thing-detail-contents">
        <form class="level">
          <input type="range" min="0" max="100" value="${level}"
                 class="level-input"/>
        </form>
      </div>
    </div>
    <div class="thing-detail-label">Level</div>
  </div>`;
};

LevelDetail.prototype.update = function() {
  if (!this.level) {
    return;
  }

  if (this.thing.properties.level == this.level.value) {
    return;
  }
  this.level.value = this.thing.properties.level;
};

LevelDetail.prototype.set = function() {
  this.thing.setLevel(this.level.value);
};
