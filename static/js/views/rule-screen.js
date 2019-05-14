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

const API = require('../api');
const DevicePropertyBlock = require('../rules/DevicePropertyBlock');
const Gateway = require('../rules/Gateway');
const Rule = require('../rules/Rule');
const RuleUtils = require('../rules/RuleUtils');
const NotificationEffectBlock = require('../rules/NotificationEffectBlock');
const TimeTriggerBlock = require('../rules/TimeTriggerBlock');
const page = require('page');

// eslint-disable-next-line no-unused-vars
const RuleScreen = {
  init: function() {
    this.gateway = new Gateway();

    this.onPresentationChange = this.onPresentationChange.bind(this);
    this.onRuleChange = this.onRuleChange.bind(this);
    this.onRuleDescriptionInput = this.onRuleDescriptionInput.bind(this);
    this.onAnimatePlayStopClick = this.onAnimatePlayStopClick.bind(this);
    this.animate = this.animate.bind(this);
    this.animateDelay = 1000;
    this.rule = null;
    this.partBlocks = [];
    this.ruleEffectType = 'SetEffect';

    this.view = document.getElementById('rule-view');
    this.titleBar = this.view.querySelector('.title-bar');
    this.ruleArea = document.getElementById('rule-area');
    this.ruleName = this.view.querySelector('.rule-name');
    this.ruleNameCustomize = this.view.querySelector('.rule-name-customize');
    this.animatePlayStop = this.view.querySelector('.rule-preview-button');
    this.animatePlayStop.addEventListener('click', this.onAnimatePlayStopClick);

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
      this.rule.update();
      this.onPresentationChange();
    });

    this.ruleDescription = this.view.querySelector('.rule-info > p');
    this.ruleDescription.addEventListener('input', this.onRuleDescriptionInput);

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

  getEffectType: function() {
    const effectSelect =
      this.ruleDescription.querySelector('.rule-effect-select');
    return effectSelect.value === 'If' ? 'SetEffect' : 'PulseEffect';
  },

  /**
   * Change the rule based on a change to its description's drop down menus
   * @param {Event} event
   */
  onRuleDescriptionInput: function(event) {
    const value = event.target.value;
    if (event.target.classList.contains('rule-trigger-select')) {
      if (value === 'and') {
        this.rule.trigger.op = 'AND';
      } else if (value === 'or') {
        this.rule.trigger.op = 'OR';
      }
    } else if (event.target.classList.contains('rule-effect-select')) {
      const effectType = this.getEffectType();
      this.ruleEffectType = effectType;
      for (const effect of this.rule.effect.effects) {
        if (effect.type === 'SetEffect' || effect.type === 'PulseEffect') {
          effect.type = effectType;
        }
      }
    } else {
      console.warn('Unexpected input event', event);
    }
    this.onRuleChange();
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
   * Instantiate a draggable NotificationEffectBlock from a template
   * NotificationEffectBlock in the palette
   * @param {Event} event
   */
  onNotificationEffectBlockDown: function(event) {
    if (!this.rule) {
      return;
    }
    const deviceRect = event.target.getBoundingClientRect();
    const x = deviceRect.left;
    const y = deviceRect.top;

    const newBlock = new NotificationEffectBlock(
      this.ruleArea, this.onPresentationChange, this.onRuleChange);
    newBlock.snapToGrid(x, y);
    newBlock.draggable.onDown(event);
    this.partBlocks.push(newBlock);
  },

  /**
   * Create a block representing a time trigger
   * @return {Element}
   */
  makeTimeTriggerBlock: () => {
    const elt = document.createElement('div');
    elt.classList.add('rule-part');

    elt.innerHTML = `<div class="rule-part-block time-trigger-block">
      <img class="rule-part-icon" src="/optimized-images/thing-icons/clock.svg"/>
    </div>
    <p>Clock</p>`;

    return elt;
  },

  /**
   * Create a block representing a notification effect
   * @return {Element}
   */
  makeNotificationEffectBlock: () => {
    const elt = document.createElement('div');
    elt.classList.add('rule-part');

    elt.innerHTML = `<div class="rule-part-block notification-effect-block">
      <img class="rule-part-icon" src="/optimized-images/thing-icons/notification.svg"/>
    </div>
    <p>Notification</p>`;

    return elt;
  },

  /**
   * Create a device-block from a thing
   * @param {ThingDescription} thing
   * @return {Element}
   */
  makeDeviceBlock: (thing) => {
    const elt = document.createElement('div');
    elt.classList.add('rule-part');

    elt.innerHTML = `<div class="rule-part-block device-block">
      <img class="rule-part-icon" src="${RuleUtils.icon(thing)}"/>
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
    } else if (part.type === 'NotificationEffect') {
      block = new NotificationEffectBlock(this.ruleArea,
                                          this.onPresentationChange,
                                          this.onRuleChange);
    } else {
      const thing = RuleUtils.thingFromPart(this.gateway, part);
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

    function isValidSelection(block) {
      const selectedOption = block.querySelector('.selected');
      if (!selectedOption) {
        return block.querySelector('.time-input') ||
          block.querySelector('.message-input-container');
      }
      return JSON.parse(selectedOption.dataset.ruleFragment);
    }

    const triggerBlocks = Array.from(
      this.ruleArea.querySelectorAll('.rule-part-block.trigger')
    ).map((elt) => {
      return elt.parentNode;
    }).filter(isValidSelection);

    const effectBlocks = Array.from(
      this.ruleArea.querySelectorAll('.rule-part-block.effect')
    ).map((elt) => {
      return elt.parentNode;
    }).filter(isValidSelection);

    function transformToCoords(elt) {
      const re = /translate\((\d+)px, +(\d+)px\)/;
      const matches = elt.style.transform.match(re);
      if (!matches) {
        return {x: 0, y: 0};
      }
      const x = parseFloat(matches[1]);
      const y = parseFloat(matches[2]);
      return {
        x,
        y,
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
        path.classList.add('effect');
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
      path.classList.add('trigger');
      this.connection.appendChild(path);
    }

    if (multiTrigger && multiEffect) {
      const circleCenter =
        document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleCenter.classList.add('center');
      circleCenter.setAttribute('r', 6);
      circleCenter.setAttribute('cx', center.x);
      circleCenter.setAttribute('cy', center.y);
      this.connection.appendChild(circleCenter);
    }
  },

  hideConnection: function() {
    this.connection.classList.add('hidden');
  },

  partBlocksByRole: function() {
    const triggerBlocks = [];
    const effectBlocks = [];

    for (const partBlock of this.partBlocks) {
      if (!partBlock.rulePart) {
        continue;
      }
      if (partBlock.rulePart.trigger) {
        triggerBlocks.push(partBlock);
      }
      if (partBlock.rulePart.effect) {
        effectBlocks.push(partBlock);
      }
    }

    return {
      triggerBlocks,
      effectBlocks,
    };
  },

  onRuleChange: function() {
    if (!this.rule) {
      return;
    }

    this.partBlocks = this.partBlocks.filter((partBlock) => {
      return partBlock.role !== 'removed';
    });

    const {triggerBlocks, effectBlocks} = this.partBlocksByRole();

    const triggers = triggerBlocks.map((triggerBlock) => {
      return triggerBlock.rulePart.trigger;
    });

    let op = 'AND';
    if (this.rule.trigger) {
      op = this.rule.trigger.op || op;
    }

    this.rule.trigger = {
      type: 'MultiTrigger',
      op,
      triggers,
    };

    const effects = effectBlocks.map((effectBlock) => {
      return effectBlock.rulePart.effect;
    });
    this.rule.effect = {
      type: 'MultiEffect',
      effects,
    };
    const effectType = this.getEffectType();
    for (const effect of this.rule.effect.effects) {
      if (effect.type === 'SetEffect' || effect.type === 'PulseEffect') {
        effect.type = effectType;
      }
    }

    this.rule.update();

    this.onPresentationChange();
  },

  onPresentationChange: function() {
    this.ruleName.textContent = this.rule.name || 'Rule Name';
    this.ruleDescription.innerHTML = this.rule.toHumanInterface();
    const ruleEffectSelect =
      this.ruleDescription.querySelector('.rule-effect-select');
    if (this.rule.effect && this.rule.effect.effects.length === 0) {
      ruleEffectSelect.value =
        this.ruleEffectType === 'SetEffect' ? 'If' : 'While';
    }
    if (ruleEffectSelect.value === 'If') {
      ruleEffectSelect.style.width = '1.8rem';
    } else {
      delete ruleEffectSelect.style.width;
    }
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
    document.getElementById('speech-wrapper').classList.remove('assistant');

    this.rule = null;
    this.ruleEffectType = 'SetEffect';

    // Fetch the rule description from the Engine or default to null
    let rulePromise = Promise.resolve(null);
    if (ruleId !== 'new') {
      rulePromise = fetch(`/rules/${encodeURIComponent(ruleId)}`, {
        headers: API.headers(),
      }).then((res) => {
        return res.json();
      });
    }

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

    const neBlock = this.makeNotificationEffectBlock();
    neBlock.addEventListener('mousedown',
                             this.onNotificationEffectBlockDown.bind(this));
    neBlock.addEventListener('touchstart',
                             this.onNotificationEffectBlockDown.bind(this));
    this.rulePartsList.appendChild(neBlock);

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

        if (!this.rule.trigger) {
          this.rule.trigger = {
            type: 'MultiTrigger',
            op: 'AND',
            triggers: [],
          };
        }

        if (this.rule.trigger.type !== 'MultiTrigger') {
          this.rule.trigger = {
            type: 'MultiTrigger',
            op: 'AND',
            triggers: [
              this.rule.trigger,
            ],
          };
        }

        const triggers = this.rule.trigger.triggers;
        for (let i = 0; i < triggers.length; i++) {
          if (flexDir === 'column') {
            this.makeRulePartBlock('trigger', triggers[i], centerX,
                                   areaRect.height / 4 - dpbRect.height / 2);
          } else {
            this.makeRulePartBlock('trigger', triggers[i],
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
      const {triggerBlocks, effectBlocks} = this.partBlocksByRole();

      triggerBlocks.forEach((triggerBlock, index) => {
        triggerBlock.snapToCenter(index, triggerBlocks.length);
      });

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

  onAnimatePlayStopClick: function() {
    if (this.animatePlayStop.classList.contains('stop')) {
      this.stopAnimate();
    } else {
      this.startAnimate();
    }
  },

  startAnimate: function() {
    if (this.animateTimeout) {
      clearTimeout(this.animateTimeout);
    }
    if (!this.rule || !this.rule.valid()) {
      return;
    }
    this.animateStep = -1;

    this.ruleArea.querySelectorAll(
      '.rule-part-block'
    ).forEach((elt) => {
      elt.classList.add('inactive');
    });
    this.animatePlayStop.classList.add('stop');

    setTimeout(this.animate, this.animateDelay);
  },
  animate: function() {
    this.animateStep += 1;
    const animateIndex = this.animateStep >> 1;
    const animateOffPhase = !!(this.animateStep & 1);

    if (animateIndex > this.rule.trigger.triggers.length) {
      this.stopAnimate();
      return;
    }

    const triggerBlocks =
      this.ruleArea.querySelectorAll('.rule-part-block.trigger');
    const effectBlocks =
      this.ruleArea.querySelectorAll('.rule-part-block.effect');
    const triggerPaths = this.connection.querySelectorAll('path.trigger');
    const effectPaths = this.connection.querySelectorAll('path.effect');
    const triggerCircles = this.connection.querySelectorAll('circle.trigger');
    const effectCircles = this.connection.querySelectorAll('circle.effect');
    const centerCircle = this.connection.querySelector('circle.center');

    function activate(index) {
      triggerBlocks[index].classList.remove('inactive');
      if (triggerPaths.length > 0) {
        triggerPaths[index].classList.add('active');
      }
      triggerCircles[index].classList.add('active');
    }

    function deactivate(index) {
      triggerBlocks[index].classList.add('inactive');
      if (triggerPaths.length > 0) {
        triggerPaths[index].classList.remove('active');
      }
      triggerCircles[index].classList.remove('active');
    }

    if (animateOffPhase) {
      if (animateIndex === triggerBlocks.length) {
        for (let i = 0; i < triggerBlocks.length; i++) {
          deactivate(i);
        }
      } else {
        deactivate(animateIndex);
      }
    } else if (animateIndex > 0) {
      deactivate(animateIndex - 1);
    }

    const andActive = animateIndex === triggerBlocks.length ||
      triggerBlocks.length === 1;

    if (!animateOffPhase) {
      if (animateIndex === this.rule.trigger.triggers.length) {
        for (let i = 0; i < triggerBlocks.length; i++) {
          activate(i);
        }
      } else {
        activate(animateIndex);
      }
    }

    const active = (!animateOffPhase) || this.getEffectType() === 'SetEffect';

    if (active && (andActive || this.rule.trigger.op === 'OR')) {
      effectBlocks.forEach((block) => {
        block.classList.remove('inactive');
      });
      if (centerCircle) {
        centerCircle.classList.add('active');
      }
      effectPaths.forEach((path) => {
        path.classList.add('active');
      });
      effectCircles.forEach((circle) => {
        circle.classList.add('active');
      });
    } else {
      effectBlocks.forEach((block) => {
        block.classList.add('inactive');
      });
      if (centerCircle) {
        centerCircle.classList.remove('active');
      }
      effectPaths.forEach((path) => {
        path.classList.remove('active');
      });
      effectCircles.forEach((circle) => {
        circle.classList.remove('active');
      });
    }

    let animateDelay = this.animateDelay;
    if (animateOffPhase) {
      animateDelay /= 1.5;
    }
    this.animateTimeout = setTimeout(this.animate, animateDelay);
  },
  stopAnimate: function() {
    if (this.animateTimeout) {
      clearTimeout(this.animateTimeout);
      this.animateTimeout = null;
    }
    this.ruleArea.querySelectorAll(
      '.rule-part-block.inactive'
    ).forEach((elt) => {
      elt.classList.remove('inactive');
    });
    this.connection.querySelectorAll(
      '.active'
    ).forEach((elt) => {
      elt.classList.remove('active');
    });
    this.animatePlayStop.classList.remove('stop');
  },
};

window.RuleScreen = RuleScreen;

module.exports = RuleScreen;
