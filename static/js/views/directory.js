/**
 * Thing.
 *
 * Represents an individual web thing.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('../api').default;
const App = require('../app');
const Utils = require('../utils');

class Directory {
  /**
   * Directory constructor.
   *
   * @param {Object} description Directory description object.
   */
  constructor(description) {
    this.title = description.title;
    this.layoutIndex = description.layoutIndex;
    this.id = decodeURIComponent(description.href.split('/').pop());
    this.directoriesElement = document.getElementById('directories');
    this.element = this.render();
  }

  /**
   * Render Directory view and add to DOM.
   */
  render() {
    const element = document.createElement('div');
    element.setAttribute('class', 'directory');
    element.setAttribute('id', `directory-${this.id}`);
    element.setAttribute('layoutIndex', `${element.layoutIndex}`);

    element.ondragover = this.handleDragOver.bind(this);
    element.ondragenter = this.handleDragEnter.bind(this);
    element.ondragleave = this.handleDragLeave.bind(this);
    element.ondrop = this.handleDrop.bind(this);

    const bar = document.createElement('DIV');
    bar.setAttribute('class', 'bar');
    bar.setAttribute('layoutIndex', '-1');

    const leftcontainer = document.createElement('DIV');
    leftcontainer.setAttribute('class', 'leftcontainer');

    const foldInButton = document.createElement('BUTTON');
    foldInButton.setAttribute('class', 'foldIn');
    const cookie = `directory-${this.id}-closed=1`;
    if (!document.cookie.split(';').map((c) => c.trim()).includes(cookie)) {
      element.classList.add('open');
    }
    foldInButton.addEventListener('click', () => {
      document.cookie = `${cookie};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      if (element.classList.contains('open')) {
        element.classList.remove('open');
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = `${cookie};expires=${d.toUTCString()}`;
      } else {
        element.classList.add('open');
      }
    });
    leftcontainer.appendChild(foldInButton);

    const title = document.createElement('DIV');
    title.setAttribute('class', 'title');
    title.innerText = this.title;
    leftcontainer.appendChild(title);

    bar.appendChild(leftcontainer);

    const removeDirectoryButton = document.createElement('BUTTON');
    removeDirectoryButton.setAttribute('class', 'remove');
    removeDirectoryButton.addEventListener('click', () => {
      App.gatewayModel.removeDirectory(this.id);
    });
    bar.appendChild(removeDirectoryButton);

    element.appendChild(bar);

    this.directoriesElement.appendChild(element);

    for (const node of this.directoriesElement.childNodes.values()) {
      if (node.dataset.layoutIndex > this.layoutIndex) {
        return this.directoriesElement.insertBefore(element, node);
      }
    }

    return this.directoriesElement.appendChild(element);
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.element.classList.add('drag-target');
  }

  handleDragEnter(e) {
    e.preventDefault();
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.element.classList.remove('drag-target');
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();


    const dragNode = document.getElementById(e.dataTransfer.getData('text'));

    if (!dragNode) {
      return;
    }

    dragNode.parentNode.removeChild(dragNode);

    this.element.appendChild(dragNode);

    const dragNodeId = Utils.unescapeHtml(dragNode.id).replace(/^thing-/, '');
    API.setThingDirectory(
      dragNodeId,
      this.id
    )
      .then(() => {
        App.gatewayModel.refreshThings();
      })
      .catch((e) => {
        console.error(`Error trying to change directory of thing ${dragNodeId}: ${e}`);
      });
  }
}

module.exports = Directory;
