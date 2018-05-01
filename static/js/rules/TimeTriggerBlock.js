const RulePartBlock = require('./RulePartBlock');

/**
 * An element representing a time-based trigger
 *
 * @constructor
 * @param {Element} ruleArea
 * @param {Rule} rule
 * @param {number} x
 * @param {number} y
 */
function TimeTriggerBlock(ruleArea, rule, x, y) {
  RulePartBlock.call(this, ruleArea, rule,
                     'Time of day', '/images/clock.svg', x, y);

  const rulePartInfo = this.elt.querySelector('.rule-part-info');

  this.timeInput = document.createElement('input');
  this.timeInput.type = 'time';
  const date = new Date();
  const hours = TimeTriggerBlock.leftPad(date.getHours());
  const minutes = TimeTriggerBlock.leftPad(date.getMinutes());
  this.timeInput.value = `${hours}:${minutes}`;
  this.timeInput.classList.add('time-input');

  // Disable dragging started by clicking time input
  this.timeInput.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  });
  this.timeInput.addEventListener('touchstart', function(e) {
    e.stopPropagation();
  });

  this.timeInput.addEventListener('change', () => {
    this.rule.setTrigger({
      type: 'TimeTrigger',
      time: TimeTriggerBlock.localToUTC(this.timeInput.value),
    });
  });

  rulePartInfo.appendChild(this.timeInput);
}

TimeTriggerBlock.prototype = Object.create(RulePartBlock.prototype);

/**
 * Initialize based on an existing partial rule
 */
TimeTriggerBlock.prototype.setRulePart = function(rulePart) {
  if (rulePart.trigger) {
    this.role = 'trigger';
    this.rulePartBlock.classList.add('trigger');
    this.ruleTriggerArea.classList.add('inactive');

    this.timeInput.value = TimeTriggerBlock.utcToLocal(rulePart.trigger.time);
  }

  if (rulePart.effect) {
    throw new Error('TimeTriggerBlock can only be a trigger');
  }
};

TimeTriggerBlock.prototype.onUp = function(clientX, clientY) {
  RulePartBlock.prototype.onUp.call(this, clientX, clientY);
  if (this.role === 'effect') {
    this.remove();
  }
  if (this.role === 'trigger') {
    this.rule.setTrigger({
      type: 'TimeTrigger',
      time: TimeTriggerBlock.localToUTC(this.timeInput.value),
    });
  }
};

TimeTriggerBlock.leftPad = function(n) {
  return n.toString().padStart(2, '0');
};

/**
 * Convert from a utc time string to one in the local timezone
 * @param {String} utcTime - formatted HH:MM
 * @return {String}
 */
TimeTriggerBlock.utcToLocal = function(utcTime) {
  const timeParts = utcTime.split(':');
  const date = new Date();
  date.setUTCHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
  const lp = TimeTriggerBlock.leftPad;
  return `${lp(date.getHours())}:${lp(date.getMinutes())}`;
};

/**
 * Convert from a local time string to one in UTC
 * @param {String} localTime - formatted HH:MM
 * @return {String}
 */
TimeTriggerBlock.localToUTC = function(localTime) {
  const timeParts = localTime.split(':');
  const date = new Date();
  date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
  const lp = TimeTriggerBlock.leftPad;
  return `${lp(date.getUTCHours())}:${lp(date.getUTCMinutes())}`;
};

module.exports = TimeTriggerBlock;
