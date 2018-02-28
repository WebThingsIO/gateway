/**
 * Rule Screen.
 *
 * Allows editing a single rule
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* global API, DevicePropertyBlock, Gateway, Rule, RuleUtils, TimeTriggerBlock,
 page */

'use strict';

// eslint-disable-next-line no-unused-vars
const RuleScreen = {
  init: function() {
    this.gateway = new Gateway();

    this.rule = null;

    this.view = document.getElementById('rule-view');
    this.ruleArea = document.getElementById('rule-area');
    this.ruleName = this.view.querySelector('.rule-name');
    this.ruleNameCustomize = this.view.querySelector('.rule-name-customize');

    const selectRuleName = () => {
      // Select all of ruleName, https://stackoverflow.com/questions/6139107/
      let range = document.createRange();
      range.selectNodeContents(this.ruleName);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    };
    this.ruleNameCustomize.addEventListener('click', selectRuleName);
    this.ruleName.addEventListener('dblclick', function(event) {
      event.preventDefault();
      selectRuleName();
    });

    this.ruleName.contentEditable = true;
    this.ruleName.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.ruleName.blur();
      }
    });

    this.ruleName.addEventListener('blur', () => {
      this.rule.name = this.ruleName.textContent;
      this.rule.update();
    });

    this.ruleDescription = this.view.querySelector('.rule-info > p');

    this.rulePartsList = document.getElementById('rule-parts-list');
    this.onboardingHint = document.getElementById('onboarding-hint');
    this.connection = document.getElementById('connection');

    this.deleteOverlay = document.getElementById('rule-delete-overlay');
    this.deleteButton = document.getElementById('delete-button');
    this.deleteCancel = this.view.querySelector('.rule-delete-cancel-button');
    this.deleteConfirm = this.view.querySelector('.rule-delete-confirm-button');

    this.deleteButton.addEventListener('click', () => {
      this.deleteOverlay.classList.add('active');
    });

    this.deleteCancel.addEventListener('click', () => {
      this.deleteOverlay.classList.remove('active');
    });

    this.deleteConfirm.addEventListener('click', () => {
      this.rule.delete().then(function() {
        page('/rules');
      });
    });

    this.onScrollLeftClick = this.onScrollLeftClick.bind(this);
    this.onScrollRightClick = this.onScrollRightClick.bind(this);

    let scrollLeft = document.getElementById('rule-parts-list-scroll-left');
    let scrollRight = document.getElementById('rule-parts-list-scroll-right');

    scrollLeft.addEventListener('click', this.onScrollLeftClick);
    scrollLeft.addEventListener('touchstart', this.onScrollLeftClick);
    scrollRight.addEventListener('click', this.onScrollRightClick);
    scrollRight.addEventListener('touchstart', this.onScrollRightClick);

    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },

  /**
   * Instantiate a draggable DevicePropertyBlock from a template DeviceBlock
   * in the palette
   * @param {ThingDescription} thing
   * @param {Event} event
   */
  onDeviceBlockDown: function(thing, event) {
    if (!this.rule) {
      return;
    }
    let deviceRect = event.target.getBoundingClientRect();

    let x = deviceRect.left;
    let y = deviceRect.top;
    let newBlock = new DevicePropertyBlock(this.ruleArea, this.rule, thing,
      x, y);

    newBlock.draggable.onDown(event);
  },

  /**
   * Instantiate a draggable TimeTriggerBlock from a template
   * TimeTriggerBlock
   * in the palette
   * @param {Event} event
   */
  onTimeTriggerBlockDown: function(event) {
    if (!this.rule) {
      return;
    }
    let deviceRect = event.target.getBoundingClientRect();
    let x = deviceRect.left;
    let y = deviceRect.top;

    let newBlock = new TimeTriggerBlock(this.ruleArea, this.rule, x, y);
    newBlock.draggable.onDown(event);
  },

  /**
   * Create a block representing a time trigger
   * @return {Element}
   */
  makeTimeTriggerBlock: function() {
    let elt = document.createElement('div');
    elt.classList.add('rule-part');

    elt.innerHTML = `<div class="rule-part-block time-trigger-block">
      <img class="rule-part-icon" src="/images/clock.svg"/>
    </div>
    <p>Clock</p>`;

    return elt;
  },

  /**
   * Create a device-block from a thing
   * @param {ThingDescription} thing
   * @return {Element}
   */
  makeDeviceBlock: function(thing) {
    let elt = document.createElement('div');
    elt.classList.add('rule-part');

    elt.innerHTML = `<div class="rule-part-block device-block">
      <img class="rule-part-icon" src="/images/onoff.svg"/>
    </div>
    <p>${thing.name}</p>`;

    return elt;
  },

  /**
   * Instantiate a DevicePropertyBlock
   * @param {'trigger'|'effect'} role
   * @param {number} x
   * @param {number} y
   */
  makeRulePartBlock: function(role, x, y) {
    let part = this.rule[role];
    let block = null;
    if (part.type === 'TimeTrigger') {
      block = new TimeTriggerBlock(this.ruleArea, this.rule, x, y);
    } else {
      let thing = null;
      if (part.type === 'EventTrigger' || part.type === 'ActionEffect') {
        thing = this.gateway.things.filter(
          RuleUtils.byHref(this.rule[role].thing.href)
        )[0];
      } else {
        thing = this.gateway.things.filter(
          RuleUtils.byProperty(this.rule[role].property)
        )[0];
      }
      block = new DevicePropertyBlock(this.ruleArea, this.rule, thing, x, y);
    }
    let rulePart = {};
    rulePart[role] = this.rule[role];
    block.setRulePart(rulePart);
  },

  showConnection: function() {
    this.connection.classList.remove('hidden');

    let dragHint = document.getElementById('drag-hint');
    let flexDir = window.getComputedStyle(dragHint).flexDirection;

    let triggerBlock =
      this.view.querySelector('.rule-part-block.trigger').parentNode;
    let effectBlock =
      this.view.querySelector('.rule-part-block.effect').parentNode;
    function transformToCoords(elt) {
      let re = /translate\((\d+)px, +(\d+)px\)/;
      let matches = elt.style.transform.match(re);
      if (!matches) {
        return {x: 0, y: 0};
      }
      let x = parseFloat(matches[1]);
      let y = parseFloat(matches[2]);
      return {
        x: x,
        y: y
      };
    }
    let triggerCoords = transformToCoords(triggerBlock);
    let effectCoords = transformToCoords(effectBlock);

    let dpbRect = triggerBlock.getBoundingClientRect();

    let startX = triggerCoords.x + dpbRect.width + 10;
    let startY = triggerCoords.y + dpbRect.height / 2;
    let endX = effectCoords.x - 10;
    let endY = effectCoords.y + dpbRect.height / 2;

    if (flexDir === 'column') {
      startX = triggerCoords.x + dpbRect.width / 2;
      startY = triggerCoords.y + dpbRect.height + 10;
      endX = effectCoords.x + dpbRect.width / 2;
      endY = effectCoords.y - 10;
    }

    let midX = (startX + endX) / 2;

    let pathDesc  = [
      'M', startX, startY,
      'C', midX, startY, midX, endY, endX, endY
    ].join(' ');

    let path = this.connection.querySelector('path');
    path.setAttribute('d', pathDesc);
    let circleTrigger = this.connection.querySelector('.trigger');
    circleTrigger.setAttribute('cx', startX);
    circleTrigger.setAttribute('cy', startY);
    let circleEffect = this.connection.querySelector('.effect');
    circleEffect.setAttribute('cx', endX);
    circleEffect.setAttribute('cy', endY);
  },

  hideConnection: function() {
    this.connection.classList.add('hidden');
  },

  onRuleUpdate: function() {
    this.ruleName.textContent = this.rule.name || 'Rule Name';
    this.ruleDescription.textContent = this.rule.toHumanDescription();
    if (this.rule.trigger && this.rule.effect &&
      !document.querySelector('.dragging')) {
      this.showConnection();
    } else {
      this.hideConnection();
    }

    if (!document.querySelector('.rule-part-container')) {
      this.onboardingHint.classList.remove('hidden');
    } else {
      this.onboardingHint.classList.add('hidden');
    }
  },

  show: function(ruleId) {
    // Fetch the rule description from the Engine or default to null
    let rulePromise = Promise.resolve(null);
    if (ruleId !== 'new') {
      rulePromise = fetch('/rules/' + ruleId, {
        headers: API.headers()
      }).then(function(res) {
        return res.json();
      });
    }

    this.ruleArea.querySelector('.drag-hint-trigger')
      .classList.remove('inactive');
    this.ruleArea.querySelector('.drag-hint-effect')
      .classList.remove('inactive');

    function remove(elt) {
      return elt.parentNode.removeChild(elt);
    }

    this.rulePartsList.querySelectorAll('.rule-part').forEach(remove);
    let ttBlock = this.makeTimeTriggerBlock();
    ttBlock.addEventListener('mousedown',
      this.onTimeTriggerBlockDown.bind(this));
    ttBlock.addEventListener('touchstart',
      this.onTimeTriggerBlockDown.bind(this));
    this.rulePartsList.appendChild(ttBlock);

    this.gateway.readThings().then(things => {
      for (let thing of things) {
        let elt = this.makeDeviceBlock(thing);
        elt.addEventListener('mousedown',
          this.onDeviceBlockDown.bind(this, thing));
        elt.addEventListener('touchstart',
          this.onDeviceBlockDown.bind(this, thing));
        this.rulePartsList.appendChild(elt);
      }
      this.onWindowResize();
    }).then(function() {
      return rulePromise;
    }).then(ruleDesc => {
      this.rule = new Rule(this.gateway, ruleDesc,
        this.onRuleUpdate.bind(this));

      this.ruleArea.querySelectorAll('.rule-part-container').forEach(remove);

      if (ruleDesc) {
        let dragHint = document.getElementById('drag-hint');
        let flexDir = window.getComputedStyle(dragHint).flexDirection;

        let areaRect = this.ruleArea.getBoundingClientRect();
        let rem = 10;
        let dpbRect = {
          width: 30 * rem,
          height: 10 * rem
        };

        // Create DevicePropertyBlocks from trigger and effect if applicable
        let centerX = areaRect.width / 2 - dpbRect.width / 2;
        let centerY = areaRect.height / 2 - dpbRect.height / 2;
        if (ruleDesc.trigger) {
          if (flexDir === 'column') {
            this.makeRulePartBlock('trigger', centerX,
              areaRect.height / 4 - dpbRect.height / 2);
          } else {
            this.makeRulePartBlock('trigger',
              areaRect.width / 4 - dpbRect.width / 2,
              centerY);
          }
        }
        if (ruleDesc.effect) {
          if (flexDir === 'column') {
            this.makeRulePartBlock('effect', centerX,
              areaRect.height * 3 / 4 - dpbRect.height / 2);
          } else {
            this.makeRulePartBlock('effect',
              areaRect.width * 3 / 4 - dpbRect.width / 2,
              centerY);
          }
        }
      }
      this.onRuleUpdate();
    });
  },

  onWindowResize: function() {
    let scrollWidth = this.rulePartsList.scrollWidth;
    let boundingWidth = this.rulePartsList.getBoundingClientRect().width;
    let scrollLeft = document.getElementById('rule-parts-list-scroll-left');
    let scrollRight = document.getElementById('rule-parts-list-scroll-right');

    if (boundingWidth < scrollWidth) {
      scrollLeft.classList.remove('hidden');
      scrollRight.classList.remove('hidden');
    } else {
      scrollLeft.classList.add('hidden');
      scrollRight.classList.add('hidden');
    }
  },

  onScrollLeftClick: function() {
    this.rulePartsList.scrollLeft -= 128;
  },

  onScrollRightClick: function() {
    this.rulePartsList.scrollLeft += 128;
  }
};
