/* global RulePartBlock  */

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

  let rulePartInfo = this.elt.querySelector('.rule-part-info');

  this.timeInput = document.createElement('input');
  this.timeInput.type = 'time';
  this.timeInput.value = new Date().getHours() + ':' + new Date().getMinutes();
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
      time: this.timeInput.value
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
    this.timeInput.value = rulePart.trigger.time;
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
};
