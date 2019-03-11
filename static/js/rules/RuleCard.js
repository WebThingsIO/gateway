const Rule = require('./Rule');
const RuleUtils = require('./RuleUtils');
const page = require('page');
const Utils = require('../utils');

class RuleCard {
  /**
   * A summary of a Rule in card format
   * @constructor
   * @param {Gateway} gateway - global Gateway with which to communicate
   * @param {Element} elt - element into which to put the card
   * @param {String} id - unique identifier of the rule card
   * @param {RuleDescription} desc - rule description to represent
   */
  constructor(gateway, elt, id, desc) {
    this.elt = elt;
    this.id = id;
    this.rule = new Rule(gateway, desc);

    let checked = this.rule.enabled ? 'checked' : '';
    let invalidWarning = '';
    if (!this.rule.valid()) {
      checked = '';
      invalidWarning = '[INVALID] ';
      this.elt.classList.add('invalid');
    }

    let iconTrigger = '/optimized-images/thing-icons/thing.svg';
    let iconEffect = '/optimized-images/thing-icons/thing.svg';

    if (this.rule.trigger) {
      let trigger = this.rule.trigger;
      if (trigger.triggers && trigger.triggers.length > 0) {
        trigger = trigger.triggers[0];
      }
      const thingTrigger = RuleUtils.thingFromPart(gateway, trigger);
      if (thingTrigger) {
        iconTrigger = RuleUtils.icon(thingTrigger);
      } else if (trigger.type === 'TimeTrigger') {
        iconTrigger = '/optimized-images/thing-icons/clock.svg';
      }
    }

    if (this.rule.effect) {
      let effect = this.rule.effect;
      if (effect.effects && effect.effects.length > 0) {
        effect = effect.effects[0];
      }
      const thingEffect = RuleUtils.thingFromPart(gateway, effect);
      if (thingEffect) {
        iconEffect = RuleUtils.icon(thingEffect);
      }
    }

    this.elt.innerHTML = `
      <div class="rule-edit-overlay">
        <div class="rule-delete-button"></div>
        <input class="rule-edit-button" type="button" value="Edit Rule"/>
        <div class="rule-delete-dialog">
          <p>Are you sure you want to remove this rule permanently?</p>
          <input class="rule-delete-cancel-button" type="button"
                 value="Cancel"/>
          <input class="rule-delete-confirm-button" type="button"
                 value="Remove Rule"/>
        </div>
      </div>
      <div class="rule-preview">
        <div class="rule-part-block trigger">
          <img class="rule-part-icon" src="${iconTrigger}"/>
        </div>
        <div class="rule-part-block effect">
          <img class="rule-part-icon" src="${iconEffect}"/>
        </div>
      </div>
      <div class="rule-info">
        <h3>${invalidWarning}${Utils.escapeHtml(this.rule.name)}</h3>
        <p>${Utils.escapeHtml(this.rule.toHumanDescription())}</p>
      </div>
      <form class="rule-switch switch">
        <input type="checkbox" id="rule-switch-${Utils.escapeHtml(id)}"
               class="switch-checkbox" ${checked}/>
        <label class="switch-slider" for="rule-switch-${Utils.escapeHtml(id)}">
        </label>
      </form>
    `;

    this.onEditButtonClick = this.onEditButtonClick.bind(this);
    this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
    this.onDeleteCancelClick = this.onDeleteCancelClick.bind(this);
    this.onDeleteConfirmClick = this.onDeleteConfirmClick.bind(this);
    this.onEnabledCheckboxChange = this.onEnabledCheckboxChange.bind(this);

    this.editButton = this.elt.querySelector('.rule-edit-button');
    this.editButton.addEventListener('click', this.onEditButtonClick);

    this.deleteButton = this.elt.querySelector('.rule-delete-button');
    this.deleteButton.addEventListener('click', this.onDeleteButtonClick);
    this.deleteCancel = this.elt.querySelector('.rule-delete-cancel-button');
    this.deleteCancel.addEventListener('click', this.onDeleteCancelClick);
    this.deleteConfirm = this.elt.querySelector('.rule-delete-confirm-button');
    this.deleteConfirm.addEventListener('click', this.onDeleteConfirmClick);

    this.enabledCheckbox = this.elt.querySelector('.switch-checkbox');
    this.enabledCheckbox.addEventListener('change',
                                          this.onEnabledCheckboxChange);

    this.editOverlay = this.elt.querySelector('.rule-edit-overlay');
  }

  onEditButtonClick() {
    page(`/rules/${encodeURIComponent(this.rule.id)}`);
  }

  onDeleteButtonClick() {
    this.editOverlay.classList.add('delete');
  }

  onDeleteCancelClick() {
    this.editOverlay.classList.remove('delete');
  }

  onDeleteConfirmClick() {
    this.rule.delete();
    this.elt.parentNode.removeChild(this.elt);
  }

  onEnabledCheckboxChange() {
    if (this.enabledCheckbox.checked) {
      this.rule.enabled = true;
    } else {
      this.rule.enabled = false;
    }
    this.rule.update();
  }
}

module.exports = RuleCard;
