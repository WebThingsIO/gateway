const RulePartBlock = require('./RulePartBlock');

/**
 * An element representing a notification effect
 *
 * @constructor
 * @param {Element} ruleArea
 * @param {Function} onPresentationChange
 * @param {Function} onRuleChange
 */
class NotificationEffectBlock extends RulePartBlock {
  constructor(ruleArea, onPresentationChange, onRuleUpdate) {
    super(ruleArea, onPresentationChange, onRuleUpdate, 'Notification',
          '/optimized-images/thing-icons/notification.svg');

    const rulePartInfo = this.elt.querySelector('.rule-part-info');

    const messageInputContainer = document.createElement('div');
    messageInputContainer.classList.add('message-input-container');

    const label = document.createElement('span');
    label.classList.add('message-input-label');
    label.textContent = 'Message';
    messageInputContainer.appendChild(label);

    this.messageInput = document.createElement('input');
    this.messageInput.type = 'text';

    messageInputContainer.appendChild(this.messageInput);

    // Disable dragging started by clicking input
    this.messageInput.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    this.messageInput.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    });

    this.messageInput.addEventListener('change', () => {
      this.rulePart = {effect: {
        type: 'NotificationEffect',
        message: this.messageInput.value,
      }};
      this.onRuleChange();
    });

    rulePartInfo.appendChild(messageInputContainer);
  }

  /**
   * Initialize based on an existing partial rule
   */
  setRulePart(rulePart) {
    this.rulePart = rulePart;

    if (rulePart.effect) {
      this.role = 'effect';
      this.rulePartBlock.classList.add('effect');

      this.messageInput.value = rulePart.effect.message;
    }

    if (rulePart.trigger) {
      throw new Error('NotificationEffectBlock can only be an effect');
    }
  }

  onUp(clientX, clientY) {
    super.onUp(clientX, clientY);
    if (this.role === 'trigger') {
      this.remove();
    }
    if (this.role === 'effect') {
      this.rulePart = {effect: {
        type: 'NotificationEffect',
        message: this.messageInput.value,
      }};
      this.onRuleChange();
    }
  }
}

module.exports = NotificationEffectBlock;
