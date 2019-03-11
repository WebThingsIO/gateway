const RulePartBlock = require('./RulePartBlock');

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
    super(ruleArea, onPresentationChange, onRuleUpdate, 'Time of day',
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
        time: TimeTriggerBlock.localToUTC(this.timeInput.value),
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
        this.timeInput.value =
          TimeTriggerBlock.utcToLocal(rulePart.trigger.time);
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
        time: TimeTriggerBlock.localToUTC(this.timeInput.value),
      }};
      this.onRuleChange();
    }
  }

  static leftPad(n) {
    return n.toString().padStart(2, '0');
  }

  /**
   * Convert from a utc time string to one in the local timezone
   * @param {String} utcTime - formatted HH:MM
   * @return {String}
   */
  static utcToLocal(utcTime) {
    const timeParts = utcTime.split(':');
    const date = new Date();
    date.setUTCHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
    const lp = TimeTriggerBlock.leftPad;
    return `${lp(date.getHours())}:${lp(date.getMinutes())}`;
  }

  /**
   * Convert from a local time string to one in UTC
   * @param {String} localTime - formatted HH:MM
   * @return {String}
   */
  static localToUTC(localTime) {
    const timeParts = localTime.split(':');
    const date = new Date();
    date.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
    const lp = TimeTriggerBlock.leftPad;
    return `${lp(date.getUTCHours())}:${lp(date.getUTCMinutes())}`;
  }
}

module.exports = TimeTriggerBlock;
