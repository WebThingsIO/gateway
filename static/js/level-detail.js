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

const Utils = require('./utils');

class LevelDetail {
  constructor(thing, name, label) {
    this.thing = thing;
    this.name = name;
    this.label = label || 'Level';
    this.id = `level-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.level = this.thing.element.querySelector(`#${this.id}`);
    const setLevel = Utils.debounce(500, this.set.bind(this));
    this.level.addEventListener('change', setLevel);
  }

  view() {
    const level = this.thing.properties[this.name];

    return `
      <webthing-level-property data-name="${Utils.escapeHtml(this.label)}"
        min="0" max="100" step="1" value="${Utils.escapeHtml(level)}"
        id="${this.id}">
      </webthing-level-property>`;
  }

  update() {
    if (!this.level) {
      return;
    }

    if (this.thing.properties[this.name] == this.level.value) {
      return;
    }
    this.level.value = this.thing.properties[this.name];
  }

  set() {
    this.thing.setLevel(this.level.value);
  }
}

module.exports = LevelDetail;
