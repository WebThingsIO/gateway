const Draggable = require('./Draggable');
const Utils = require('../utils');

class RulePartBlock {
  /**
   * An element representing a component of a rule.  Drag-and-dropped within
   * `ruleArea` to change its role within `rule`
   * @constructor
   * @param {Element} ruleArea
   * @param {Function} onPresentationChange
   * @param {Function} onRuleChange
   * @param {String} name
   * @param {String} icon
   * @param {number} x
   * @param {number} y
   */
  constructor(ruleArea, onPresentationChange, onRuleChange, name, icon) {
    this.onPresentationChange = onPresentationChange;
    this.onRuleChange = onRuleChange;
    this.role = '';
    this.rulePart = null;

    this.elt = document.createElement('div');
    this.elt.classList.add('rule-part-container');

    this.elt.innerHTML = `<div class="rule-part-block">
        <img class="rule-part-icon" src="${encodeURI(icon)}"/>
      </div>
      <div class="rule-part-info">
        <h3 class="rule-part-name">
        ${Utils.escapeHtml(name)}
        </h3>
      </div>`;

    this.rulePartBlock = this.elt.querySelector('.rule-part-block');

    this.ruleArea = ruleArea;

    this.onDown = this.onDown.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onUp = this.onUp.bind(this);

    this.ruleArea.appendChild(this.elt);
    this.draggable =
      new Draggable(this.elt, this.onDown, this.onMove, this.onUp);

    const dragHint = document.getElementById('drag-hint');
    this.flexDir = window.getComputedStyle(dragHint).flexDirection;
  }

  /**
   * On mouse down during a drag
   */
  onDown() {
    const openSelector = this.elt.querySelector('.open');
    if (openSelector) {
      openSelector.classList.remove('open');
    }

    this.resetState = {
      transform: this.elt.style.transform,
    };

    const deleteArea = document.getElementById('delete-area');
    deleteArea.classList.add('delete-active');
    this.elt.classList.add('dragging');
    this.ruleArea.classList.add('drag-location-hint');

    this.onPresentationChange();
  }

  /**
   * On mouse move during a drag
   */
  onMove(clientX, clientY, relX, relY) {
    const ruleAreaRect = this.ruleArea.getBoundingClientRect();
    const deleteArea = document.getElementById('delete-area');
    const deleteAreaHeight = deleteArea.getBoundingClientRect().height;
    if (clientY > window.innerHeight - deleteAreaHeight) {
      this.rulePartBlock.classList.remove('trigger');
      this.rulePartBlock.classList.remove('effect');
    } else if (this.flexDir === 'row') {
      if (relX < ruleAreaRect.width / 2) {
        this.rulePartBlock.classList.add('trigger');
        this.rulePartBlock.classList.remove('effect');
      } else {
        this.rulePartBlock.classList.remove('trigger');
        this.rulePartBlock.classList.add('effect');
      }
    } else if (this.flexDir === 'column') {
      if (relY < ruleAreaRect.height / 2) {
        this.rulePartBlock.classList.add('trigger');
        this.rulePartBlock.classList.remove('effect');
      } else {
        this.rulePartBlock.classList.remove('trigger');
        this.rulePartBlock.classList.add('effect');
      }
    }

    this.snapToGrid(relX, relY);
  }

  /**
   * Snap coordinates to a grid
   * @param {number} relX - x coordinate relative to ruleArea
   * @param {number} relY - y coordinate relative to ruleArea
   */
  snapToGrid(relX, relY) {
    const grid = 40;
    const x = Math.floor((relX - grid / 2) / grid) * grid + grid / 2;
    let y = Math.floor((relY - grid / 2) / grid) * grid + grid / 2;
    if (y < grid / 2) {
      y = grid / 2;
    }

    this.elt.style.transform = `translate(${x}px,${y}px)`;
  }

  /**
   * On mouse up during a drag
   */
  onUp(clientX, clientY) {
    this.elt.classList.remove('dragging');
    const deleteArea = document.getElementById('delete-area');
    const deleteAreaHeight = deleteArea.getBoundingClientRect().height;
    deleteArea.classList.remove('delete-active');
    this.ruleArea.classList.remove('drag-location-hint');

    if (this.rulePartBlock.classList.contains('trigger')) {
      this.role = 'trigger';
    } else if (this.rulePartBlock.classList.contains('effect')) {
      this.role = 'effect';
    }

    if (clientY > window.innerHeight - deleteAreaHeight) {
      this.remove();
    }

    this.onRuleChange();
  }

  /**
   * Reset the RulePartBlock to before the current drag started
   */
  reset() {
    this.elt.style.transform = this.resetState.transform;
    if (this.role === 'trigger') {
      this.rulePartBlock.classList.add('trigger');
      this.rulePartBlock.classList.remove('effect');
    } else if (this.role === 'effect') {
      this.rulePartBlock.classList.remove('trigger');
      this.rulePartBlock.classList.add('effect');
    } else {
      this.remove();
    }
  }

  /**
   * Initialize based on an existing partial rule
   */
  setRulePart(rulePart) {
    this.rulePart = rulePart;
    if (rulePart.trigger) {
      this.role = 'trigger';
      this.rulePartBlock.classList.add('trigger');
    } else if (rulePart.effect) {
      this.role = 'effect';
      this.rulePartBlock.classList.add('effect');
    }
  }

  /**
   * Snap to the center of the current area, aligning with siblings if part of
   * a multi effect. If centered relative to a list of siblings, index and
   * length specify this effect's relative location
   *
   * @param {number?} index - Centered relative to a list
   * @param {number?} length
   */
  snapToCenter(index, length) {
    if (!this.role) {
      return;
    }
    const dragHint = document.getElementById('drag-hint');
    const flexDir = window.getComputedStyle(dragHint).flexDirection;
    // Throw away our current coords and snap to centered on the grid

    const areaRect = this.ruleArea.getBoundingClientRect();
    const rect = this.elt.getBoundingClientRect();

    if (typeof index === 'undefined') {
      index = 0;
      length = 1;
    }
    const ratio = (index + 1) / (length + 1);


    if (flexDir === 'row') {
      const centerY = areaRect.height * ratio - rect.height / 2;

      let roleX = areaRect.width / 4 - rect.width / 2;
      if (this.role === 'effect') {
        roleX = areaRect.width * 3 / 4 - rect.width / 2;
      }

      this.snapToGrid(roleX, centerY);
    } else if (flexDir === 'column') {
      const centerX = areaRect.width * ratio - rect.width / 2;

      let roleY = areaRect.height / 4 - rect.height / 2;
      if (this.role === 'effect') {
        roleY = areaRect.height * 3 / 4 - rect.height / 2;
      }

      this.snapToGrid(centerX, roleY);
    }

    this.flexDir = flexDir;
  }

  /**
   * Remove the RulePartBlock from the DOM and from its associated rule
   */
  remove() {
    this.ruleArea.removeChild(this.elt);
    this.rulePart = null;
    this.role = 'removed';
    this.onRuleChange();
  }
}

module.exports = RulePartBlock;
