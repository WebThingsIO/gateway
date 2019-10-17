const RulePartBlock = require('./RulePartBlock');
const fluent = require('../fluent');

/**
 * An element representing a time-based trigger
 *
 * @constructor
 * @param {Element} ruleArea
 * @param {Function} onPresentationChange
 * @param {Function} onRuleChange
 */
class TimeTriggerBlock extends RulePartBlock {
  constructor(ruleArea, onPresentationChange, onRuleUpdate) {
    super(ruleArea, onPresentationChange, onRuleUpdate,
          fluent.getMessage('rule-time-title'),
          '/optimized-images/thing-icons/clock.svg');

    const rulePartInfo = this.elt.querySelector('.rule-part-info');

    this.timeInput = document.createElement('input');
    this.timeInput.type = 'time';
    const date = new Date();
    const hours = TimeTriggerBlock.leftPad(date.getHours());
    const minutes = TimeTriggerBlock.leftPad(date.getMinutes());
    this.timeInput.value = `${hours}:${minutes}`;
    this.timeInput.classList.add('time-input');

    // Disable dragging started by clicking time input
    this.timeInput.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    this.timeInput.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    });

    this.timeInput.addEventListener('change', () => {
      this.rulePart = {trigger: {
        type: 'TimeTrigger',
        time: this.timeInput.value,
        localized: true,
      }};
      this.onRuleChange();
    });

    rulePartInfo.appendChild(this.timeInput);
  }

  /**
   * Initialize based on an existing partial rule
   */
  setRulePart(rulePart) {
    this.rulePart = rulePart;

    if (rulePart.trigger) {
      this.role = 'trigger';
      this.rulePartBlock.classList.add('trigger');

      setTimeout(() => {
        this.timeInput.value = rulePart.trigger.time;
      }, 0);
    }

    if (rulePart.effect) {
      throw new Error('TimeTriggerBlock can only be a trigger');
    }
  }

  onUp(clientX, clientY) {
    super.onUp(clientX, clientY);
    if (this.role === 'effect') {
      this.remove();
    }
    if (this.role === 'trigger') {
      this.rulePart = {trigger: {
        type: 'TimeTrigger',
        time: this.timeInput.value,
      }};
      this.onRuleChange();
    }
  }

  static leftPad(n) {
    return n.toString().padStart(2, '0');
  }
}

module.exports = TimeTriggerBlock;
