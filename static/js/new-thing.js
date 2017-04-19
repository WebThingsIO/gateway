/**
 * New Thing.
 *
 * Represents a new thing ready to be saved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/**
 * New Thing constructor.
 *
 * @param String id Thing ID.
 * @param Object description Thing description object.
 */
var NewThing = function(id, description) {
  this.id = id;
  this.description = description;
  this.container = document.getElementById('new-things');
  this.render();
  this.element = document.getElementById('new-thing-' + this.id);
  this.nameInput = this.element.getElementsByClassName('new-thing-name')[0];
  this.saveButton = this.element.getElementsByClassName(
    'new-thing-save-button')[0];
  this.element.addEventListener('click', this.handleClick.bind(this));
};

/**
 * HTML view for New Thing.
 */
NewThing.prototype.view = function() {
  switch(this.description.type) {
    case 'onOffSwitch':
      return '<div id="new-thing-' + this.id + '" class="new-thing">' +
             '  <img class="new-thing-icon" src="/images/on_off_switch.png" />'+
             '  <div class="new-thing-metadata">' +
             '    <input type="text" class="new-thing-name" value="' +
                  this.description.name + '"></input>' +
             '    <span class="new-thing-type">On/Off Switch</span>' +
             '  </div>' +
             '  <button class="new-thing-save-button">Save</button>' +
             '</div>';
  }
};

/**
 * Render New Thing view and add to DOM.
 */
NewThing.prototype.render = function(newThing) {
  this.container.insertAdjacentHTML('beforeend', this.view());
};

/**
 * Handle click on a Thing.
 */
NewThing.prototype.handleClick = function(event) {
  if (event.target.classList.contains('new-thing-save-button')) {
    this.save();
  }
};

NewThing.prototype.save = function() {
  var thing = this.description;
  thing.id = this.id;
  thing.name = this.nameInput.value;
  fetch('/things', {
    method: 'POST',
    body: JSON.stringify(thing),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((function(response) {
    return response.json();
  }).bind(this)).then((function(json) {
    console.log('Successfully created thing ' + json);
    this.nameInput.disabled = true;
    this.saveButton.innerHTML = 'Saved';
    this.saveButton.disabled = true;
  }).bind(this))
  .catch(function(error) {
    console.error('Failed to save thing ' + error);
  });
};
