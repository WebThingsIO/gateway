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
const fluent = require('../fluent');

class Group {
  /**
   * Group constructor.
   *
   * @param {Object} description Group description object.
   */
  constructor(description) {
    this.title = description.title;
    this.layoutIndex = description.layoutIndex;
    this.id = decodeURIComponent(description.href.split('/').pop());
    this.groupsElement = document.getElementById('groups');
    this.element = this.render();
  }

  /**
   * Render Group view and add to DOM.
   */
  render() {
    this.element = document.createElement('div');
    this.element.setAttribute('class', 'group');
    this.element.setAttribute('id', `group-${this.id}`);
    this.element.setAttribute('data-layout-index', `${this.layoutIndex}`);

    this.initializeView();

    this.element.firstChild.ondragstart = this.handleDragStart.bind(this);
    this.element.ondragover = this.handleDragOver.bind(this);
    this.element.ondragenter = this.handleDragEnter.bind(this);
    this.element.ondragleave = this.handleDragLeave.bind(this);
    this.element.firstChild.ondragend = this.handleDragEnd.bind(this);
    this.element.ondrop = this.handleDrop.bind(this);

    for (const node of this.groupsElement.childNodes.values()) {
      if (node.dataset.layoutIndex > this.layoutIndex) {
        return this.groupsElement.insertBefore(this.element, node);
      }
    }

    return this.groupsElement.appendChild(this.element);
  }

  initializeView() {
    const bar = document.createElement('DIV');
    bar.setAttribute('class', 'bar');
    bar.setAttribute('draggable', 'true');
    bar.setAttribute('data-layout-index', '-1');

    const expandButton = document.createElement('BUTTON');
    expandButton.setAttribute('class', 'expand-button');
    const cookie = `group-${this.id}-closed=1`;
    if (
      !document.cookie
        .split(';')
        .map((c) => c.trim())
        .includes(cookie)
    ) {
      this.element.classList.add('open');
    }
    expandButton.addEventListener('click', () => {
      document.cookie = `${cookie};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      if (this.element.classList.contains('open')) {
        this.element.classList.remove('open');
        const d = new Date();
        d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = `${cookie};expires=${d.toUTCString()}`;
      } else {
        this.element.classList.add('open');
      }
    });
    bar.appendChild(expandButton);

    const title = document.createElement('DIV');
    title.setAttribute('class', 'title');
    title.innerText = this.title;
    bar.appendChild(title);

    const groupOverflowButton = document.createElement('BUTTON');
    groupOverflowButton.setAttribute('class', 'overflow-button');
    groupOverflowButton.addEventListener('click', () => {
      if (this.overflowMenu.classList.contains('hidden')) {
        this.overflowMenu.classList.remove('hidden');
      } else {
        this.overflowMenu.classList.add('hidden');
      }
    });
    bar.appendChild(groupOverflowButton);

    this.buildOverflowMenu();
    bar.appendChild(this.overflowMenu);

    this.element.appendChild(bar);
  }

  buildOverflowMenu() {
    this.overflowMenu = document.createElement('menu');
    this.overflowMenu.setAttribute('class', 'hidden overflow-menu below group-overflow-menu');

    // Edit group menu item
    const editItem = document.createElement('li');
    editItem.classList.add('overflow-menu-item');
    const editButton = document.createElement('button');
    editItem.appendChild(editButton);
    const editIcon = document.createElement('img');
    editIcon.src = '/images/edit-plain.svg';
    editButton.appendChild(editIcon);
    const editLabel = document.createElement('span');
    editLabel.textContent = fluent.getMessage('edit');
    editButton.appendChild(editLabel);
    editButton.addEventListener('click', () => {
      const newEvent = new CustomEvent('_groupcontextmenu', {
        detail: {
          groupId: this.id,
          groupTitle: this.title,
          action: 'edit',
        },
      });
      window.dispatchEvent(newEvent);
      this.overflowMenu.classList.add('hidden');
    });
    this.overflowMenu.appendChild(editItem);

    // Remove group menu item
    const removeItem = document.createElement('li');
    removeItem.classList.add('overflow-menu-item');
    const removeButton = document.createElement('button');
    removeItem.appendChild(removeButton);
    const removeIcon = document.createElement('img');
    removeIcon.src = '/images/remove.svg';
    removeButton.appendChild(removeIcon);
    const removeLabel = document.createElement('span');
    removeLabel.textContent = fluent.getMessage('remove');
    removeButton.appendChild(removeLabel);
    removeButton.addEventListener('click', () => {
      const newEvent = new CustomEvent('_groupcontextmenu', {
        detail: {
          groupId: this.id,
          groupTitle: this.title,
          action: 'remove',
        },
      });
      window.dispatchEvent(newEvent);
      this.overflowMenu.classList.add('hidden');
    });
    this.overflowMenu.appendChild(removeItem);
  }

  handleDragStart(e) {
    e.target.style.cursor = 'grabbing';
    e.dataTransfer.setData('text', this.element.id);
    e.dataTransfer.items.add('', 'application/group');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';

    this.overflowMenu.classList.add('hidden');

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  handleDragOver(e) {
    e.preventDefault();

    if (Array.from(e.dataTransfer.types).includes('application/thing')) {
      this.element.classList.add('drag-target');
      e.dataTransfer.dropEffect = 'move';
    } else if (Array.from(e.dataTransfer.types).includes('application/group')) {
      this.groupsElement.childNodes.forEach((node) => {
        node.classList.remove('drag-before', 'drag-after');
      });

      e.dataTransfer.dropEffect = 'move';

      const dropY = e.clientY;
      const elementStart = this.element.getBoundingClientRect().y;
      const elementHeight = this.element.getBoundingClientRect().height;

      if (dropY - elementStart < elementHeight / 2) {
        this.element.classList.add('drag-before');
      } else {
        this.element.classList.add('drag-after');
      }
    }
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

    const types = Array.from(e.dataTransfer.types);
    if (!types.includes('application/thing') && !types.includes('application/group')) {
      return;
    }

    e.stopPropagation();

    const dragNode = document.getElementById(e.dataTransfer.getData('text'));
    if (!dragNode || dragNode == this.element) {
      return;
    }

    if (Array.from(e.dataTransfer.types).includes('application/thing')) {
      dragNode.parentNode.removeChild(dragNode);

      this.element.appendChild(dragNode);

      const dragNodeId = Utils.unescapeHtml(dragNode.id).replace(/^thing-/, '');
      API.setThingGroup(dragNodeId, this.id)
        .then(() => {
          App.gatewayModel.refreshThings();
        })
        .catch((e) => {
          console.error(`Error trying to change group of thing ${dragNodeId}: ${e}`);
        });
    } else {
      const dropY = e.clientY;
      const elementStart = this.element.getBoundingClientRect().y;
      const elementHeight = this.element.getBoundingClientRect().height;

      let dropIndex = parseInt(this.element.getAttribute('data-layout-index'));

      if (
        dragNode.parentNode === this.element.parentNode &&
        parseInt(dragNode.getAttribute('data-layout-index')) < dropIndex
      ) {
        dropIndex -= 1;
      }

      dragNode.parentNode.removeChild(dragNode);

      if (dropY - elementStart < elementHeight / 2) {
        this.groupsElement.insertBefore(dragNode, this.element);
      } else {
        const sibling = this.element.nextSibling;
        if (sibling) {
          this.groupsElement.insertBefore(dragNode, sibling);
        } else {
          this.groupsElement.appendChild(dragNode);
        }
        dropIndex += 1;
      }

      const dragNodeId = Utils.unescapeHtml(dragNode.id).replace(/^group-/, '');
      API.setGroupLayoutIndex(dragNodeId, dropIndex)
        .then(() => {
          App.gatewayModel.refreshThings();
        })
        .catch((e) => {
          console.error(`Error trying to change group ${dragNodeId}: ${e}`);
        });
    }
  }

  handleDragEnd() {
    this.groupsElement.querySelectorAll('.drag-before, .drag-after').forEach((node) => {
      node.classList.remove('drag-before', 'drag-after');
    });
    this.groupsElement.querySelectorAll('.group .bar').forEach((node) => {
      node.style.cursor = 'grab';
    });
  }
}

module.exports = Group;
