/**
 * Rule Screen.
 *
 * Allows editing a single rule
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('./api');
const DevicePropertyBlock = require('./rules/DevicePropertyBlock');
const Gateway = require('./rules/Gateway');
const {Rule, RuleUtils} = require('./rules/Rule');
const TimeTriggerBlock = require('./rules/TimeTriggerBlock');
const page = require('./lib/page');

// eslint-disable-next-line no-unused-vars
const RuleScreen = {
  init: function() {
    this.gateway = new Gateway();

    this.onPresentationChange = this.onPresentationChange.bind(this);
    this.onRuleChange = this.onRuleChange.bind(this);
    this.rule = null;
    this.partBlocks = [];

    this.view = document.getElementById('rule-view');
    this.titleBar = this.view.querySelector('.title-bar');
    this.ruleArea = document.getElementById('rule-area');
    this.ruleName = this.view.querySelector('.rule-name');
    this.ruleNameCustomize = this.view.querySelector('.rule-name-customize');

    const selectRuleName = () => {
      // Select all of ruleName, https://stackoverflow.com/questions/6139107/
      const range = document.createRange();
      range.selectNodeContents(this.ruleName);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    };
    this.ruleNameCustomize.addEventListener('click', selectRuleName);
    this.ruleName.addEventListener('dblclick', (event) => {
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
      this.onPresentationChange();
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
      this.rule.delete().then(() => {
        page('/rules');
      });
    });

    this.onScrollLeftClick = this.onScrollLeftClick.bind(this);
    this.onScrollRightClick = this.onScrollRightClick.bind(this);

    const scrollLeft = document.getElementById('rule-parts-list-scroll-left');
    const scrollRight = document.getElementById('rule-parts-list-scroll-right');

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
    const deviceRect = event.target.getBoundingClientRect();

    const x = deviceRect.left;
    const y = deviceRect.top;
    const newBlock = new DevicePropertyBlock(
      this.ruleArea, this.onPresentationChange, this.onRuleChange, thing);
    newBlock.snapToGrid(x, y);
    newBlock.draggable.onDown(event);
    this.partBlocks.push(newBlock);
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
    const deviceRect = event.target.getBoundingClientRect();
    const x = deviceRect.left;
    const y = deviceRect.top;

    const newBlock = new TimeTriggerBlock(
      this.ruleArea, this.onPresentationChange, this.onRuleChange);
    newBlock.snapToGrid(x, y);
    newBlock.draggable.onDown(event);
    this.partBlocks.push(newBlock);
  },

  /**
   * Create a block representing a time trigger
   * @return {Element}
   */
  makeTimeTriggerBlock: function() {
    const elt = document.createElement('div');
    elt.classList.add('rule-part');

    elt.innerHTML = `<div class="rule-part-block time-trigger-block">
      <img class="rule-part-icon" src="/optimized-images/clock.svg"/>
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
    const elt = document.createElement('div');
    elt.classList.add('rule-part');

    elt.innerHTML = `<div class="rule-part-block device-block">
      <img class="rule-part-icon" src="/optimized-images/onoff.svg"/>
    </div>
    <p>${thing.name}</p>`;

    return elt;
  },

  /**
   * Instantiate a DevicePropertyBlock
   * @param {'trigger'|'effect'} role
   * @param {Object} part
   */
  makeRulePartBlock: function(role, part) {
    let block = null;
    if (part.type === 'TimeTrigger') {
      block = new TimeTriggerBlock(this.ruleArea, this.onPresentationChange,
                                   this.onRuleChange);
    } else {
      let thing = null;
      if (part.type === 'EventTrigger' || part.type === 'ActionEffect') {
        thing = this.gateway.things.filter(
          RuleUtils.byHref(part.thing.href)
        )[0];
      } else {
        thing = this.gateway.things.filter(
          RuleUtils.byProperty(part.property)
        )[0];
      }
      if (!thing) {
        return;
      }
      block = new DevicePropertyBlock(this.ruleArea, this.onPresentationChange,
                                      this.onRuleChange, thing);
    }
    const rulePart = {};
    rulePart[role] = part;
    block.setRulePart(rulePart);
    block.snapToCenter();
    this.partBlocks.push(block);
  },

  showConnection: function() {
    this.connection.classList.remove('hidden');

    const dragHint = document.getElementById('drag-hint');
    const flexDir = window.getComputedStyle(dragHint).flexDirection;

    const triggerBlocks = Array.from(
      this.ruleArea.querySelectorAll('.rule-part-block.trigger')
    ).map((elt) => {
      return elt.parentNode;
    });

    const effectBlocks = Array.from(
      this.ruleArea.querySelectorAll('.rule-part-block.effect')
    ).map((elt) => {
      return elt.parentNode;
    });

    function transformToCoords(elt) {
      const re = /translate\((\d+)px, +(\d+)px\)/;
      const matches = elt.style.transform.match(re);
      if (!matches) {
        return {x: 0, y: 0};
      }
      const x = parseFloat(matches[1]);
      const y = parseFloat(matches[2]);
      return {
        x: x,
        y: y,
      };
    }

    function triggerTransformToCoords(elt) {
      const coords = transformToCoords(elt);
      if (flexDir === 'column') {
        coords.x += dpbRect.width / 2;
        coords.y += dpbRect.height + 10;
      } else {
        coords.x += dpbRect.width + 10;
        coords.y += dpbRect.height / 2;
      }
      return coords;
    }

    function effectTransformToCoords(elt) {
      const coords = transformToCoords(elt);
      if (flexDir === 'column') {
        coords.x += dpbRect.width / 2;
        coords.y -= 10;
      } else {
        coords.x -= 10;
        coords.y += dpbRect.height / 2;
      }
      return coords;
    }

    const areaRect = this.ruleArea.getBoundingClientRect();
    const center = {
      x: areaRect.width / 2,
      y: areaRect.height / 2,
    };

    const multiTrigger = triggerBlocks.length > 1;
    const multiEffect = effectBlocks.length > 1;

    const dpbRect = triggerBlocks[0].getBoundingClientRect();

    this.connection.innerHTML = '';

    function makePath(start, end) {
      const midX = (start.x + end.x) / 2;
      const pathDesc = [
        'M', start.x, start.y,
        'C', midX, start.y, midX, end.y, end.x, end.y,
      ].join(' ');

      const path =
        document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathDesc);

      return path;
    }

    for (let i = 0; i < effectBlocks.length; i++) {
      const effectCoords = effectTransformToCoords(effectBlocks[i]);

      let start = center;
      if (!multiTrigger) {
        start = triggerTransformToCoords(triggerBlocks[0]);
      }

      const circleEffect =
        document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleEffect.classList.add('effect');
      circleEffect.setAttribute('r', 6);
      circleEffect.setAttribute('cx', effectCoords.x);
      circleEffect.setAttribute('cy', effectCoords.y);

      this.connection.appendChild(circleEffect);

      // Draw path unless there are multiple triggers with a single effect
      if (!(multiTrigger && !multiEffect)) {
        const path = makePath(start, effectCoords);
        this.connection.appendChild(path);
      }
    }

    for (let i = 0; i < triggerBlocks.length; i++) {
      const triggerCoords = triggerTransformToCoords(triggerBlocks[i]);
      const circleTrigger =
        document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleTrigger.classList.add('trigger');
      circleTrigger.setAttribute('r', 6);
      circleTrigger.setAttribute('cx', triggerCoords.x);
      circleTrigger.setAttribute('cy', triggerCoords.y);
      this.connection.appendChild(circleTrigger);

      if (!multiTrigger) {
        // Path already drawn by effects
        continue;
      }

      let end = center;
      if (!multiEffect) {
        end = effectTransformToCoords(effectBlocks[0]);
      }
      const path = makePath(triggerCoords, end);
      this.connection.appendChild(path);
    }
  },

  hideConnection: function() {
    this.connection.classList.add('hidden');
  },

  partBlocksByRole: function() {
    let triggerBlock = null;
    const effectBlocks = [];

    for (const partBlock of this.partBlocks) {
      if (!partBlock.rulePart) {
        continue;
      }
      if (partBlock.rulePart.trigger) {
        if (triggerBlock) {
          console.warn('There should only be one triggerBlock',
                       this.partBlocks);
        }
        triggerBlock = partBlock;
      }
      if (partBlock.rulePart.effect) {
        effectBlocks.push(partBlock);
      }
    }

    return {
      triggerBlock,
      effectBlocks,
    };
  },

  onRuleChange: function() {
    this.partBlocks = this.partBlocks.filter((partBlock) => {
      return partBlock.role !== 'removed';
    });

    const {triggerBlock, effectBlocks} = this.partBlocksByRole();

    if (triggerBlock) {
      this.rule.trigger = triggerBlock.rulePart.trigger;
    } else {
      this.rule.trigger = null;
    }

    const effects = effectBlocks.map((effectBlock) => {
      return effectBlock.rulePart.effect;
    });
    this.rule.effect = {
      type: 'MultiEffect',
      effects: effects,
    };
    this.rule.update();

    this.onPresentationChange();
  },

  onPresentationChange: function() {
    this.ruleName.textContent = this.rule.name || 'Rule Name';
    this.ruleDescription.textContent = this.rule.toHumanDescription();
    const valid = this.rule.valid();
    if (valid) {
      this.titleBar.classList.remove('invalid');
    } else {
      this.titleBar.classList.add('invalid');
    }
    if (valid && !document.querySelector('.dragging')) {
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
      rulePromise = fetch(`/rules/${encodeURIComponent(ruleId)}`, {
        headers: API.headers(),
      }).then((res) => {
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

    this.partBlocks.forEach((oldBlock) => {
      oldBlock.remove();
    });

    this.rulePartsList.querySelectorAll('.rule-part').forEach(remove);
    const ttBlock = this.makeTimeTriggerBlock();
    ttBlock.addEventListener('mousedown',
                             this.onTimeTriggerBlockDown.bind(this));
    ttBlock.addEventListener('touchstart',
                             this.onTimeTriggerBlockDown.bind(this));
    this.rulePartsList.appendChild(ttBlock);

    this.gateway.readThings().then((things) => {
      for (const thing of things) {
        const elt = this.makeDeviceBlock(thing);
        elt.addEventListener('mousedown',
                             this.onDeviceBlockDown.bind(this, thing));
        elt.addEventListener('touchstart',
                             this.onDeviceBlockDown.bind(this, thing));
        this.rulePartsList.appendChild(elt);
      }
      this.onWindowResize();
    }).then(() => {
      return rulePromise;
    }).then((ruleDesc) => {
      this.rule = new Rule(this.gateway, ruleDesc);

      this.ruleArea.querySelectorAll('.rule-part-container').forEach(remove);

      if (ruleDesc) {
        const dragHint = document.getElementById('drag-hint');
        const flexDir = window.getComputedStyle(dragHint).flexDirection;

        const areaRect = this.ruleArea.getBoundingClientRect();
        const rem = 10;
        const dpbRect = {
          width: 30 * rem,
          height: 10 * rem,
        };

        // Create DevicePropertyBlocks from trigger and effect if applicable
        const centerX = areaRect.width / 2 - dpbRect.width / 2;
        const centerY = areaRect.height / 2 - dpbRect.height / 2;
        if (this.rule.trigger) {
          if (flexDir === 'column') {
            this.makeRulePartBlock('trigger', this.rule.trigger, centerX,
                                   areaRect.height / 4 - dpbRect.height / 2);
          } else {
            this.makeRulePartBlock('trigger', this.rule.trigger,
                                   areaRect.width / 4 - dpbRect.width / 2,
                                   centerY);
          }
        }
        if (!this.rule.effect) {
          this.rule.effect = {
            type: 'MultiEffect',
            effects: [],
          };
        }

        if (this.rule.effect.type !== 'MultiEffect') {
          this.rule.effect = {
            type: 'MultiEffect',
            effects: [
              this.rule.effect,
            ],
          };
        }

        const effects = this.rule.effect.effects;
        for (let i = 0; i < effects.length; i++) {
          if (flexDir === 'column') {
            this.makeRulePartBlock('effect', effects[i], centerX,
                                   areaRect.height * 3 / 4 - dpbRect.height /
                                   2);
          } else {
            this.makeRulePartBlock('effect', effects[i],
                                   areaRect.width * 3 / 4 - dpbRect.width / 2,
                                   centerY);
          }
        }
      }
      this.onWindowResize();
      this.onRuleChange();
    });
  },

  onWindowResize: function() {
    const scrollWidth = this.rulePartsList.scrollWidth;
    const boundingWidth = this.rulePartsList.getBoundingClientRect().width;
    const scrollLeft = document.getElementById('rule-parts-list-scroll-left');
    const scrollRight = document.getElementById('rule-parts-list-scroll-right');

    if (boundingWidth < scrollWidth) {
      scrollLeft.classList.remove('hidden');
      scrollRight.classList.remove('hidden');
    } else {
      scrollLeft.classList.add('hidden');
      scrollRight.classList.add('hidden');
    }

    if (this.rule) {
      const {triggerBlock, effectBlocks} = this.partBlocksByRole();

      if (triggerBlock) {
        triggerBlock.snapToCenter();
      }

      effectBlocks.forEach((effectBlock, index) => {
        effectBlock.snapToCenter(index, effectBlocks.length);
      });

      this.onPresentationChange();
    }
  },

  onScrollLeftClick: function() {
    this.rulePartsList.scrollLeft -= 128;
  },

  onScrollRightClick: function() {
    this.rulePartsList.scrollLeft += 128;
  },
};

module.exports = RuleScreen;
