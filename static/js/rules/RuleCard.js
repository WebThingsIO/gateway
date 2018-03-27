const {Rule} = require('./Rule');
const page = require('../lib/page');
const Utils = require('../utils');

/**
 * A summary of a Rule in card format
 * @constructor
 * @param {Gateway} gateway - global Gateway with which to communicate
 * @param {Element} elt - element into which to put the card
 * @param {String} id - unique identifier of the rule card
 * @param {RuleDescription} desc - rule description to represent
 */
function RuleCard(gateway, elt, id, desc) {
  this.elt = elt;
  this.id = id;
  this.rule = new Rule(gateway, desc);

  const checked = this.rule.enabled ? 'checked' : '';

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
        <img class="rule-part-icon" src="/images/onoff.svg"/>
      </div>
      <div class="rule-part-block effect">
        <img class="rule-part-icon" src="/images/onoff.svg"/>
      </div>
    </div>
    <div class="rule-info">
      <h3>${Utils.escapeHtml(this.rule.name)}</h3>
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
  this.enabledCheckbox.addEventListener('change', this.onEnabledCheckboxChange);

  this.editOverlay = this.elt.querySelector('.rule-edit-overlay');
}

RuleCard.prototype.onEditButtonClick = function() {
  page(`/rules/${encodeURIComponent(this.rule.id)}`);
};

RuleCard.prototype.onDeleteButtonClick = function() {
  this.editOverlay.classList.add('delete');
};

RuleCard.prototype.onDeleteCancelClick = function() {
  this.editOverlay.classList.remove('delete');
};

RuleCard.prototype.onDeleteConfirmClick = function() {
  this.rule.delete();
  this.elt.parentNode.removeChild(this.elt);
};

RuleCard.prototype.onEnabledCheckboxChange = function() {
  if (this.enabledCheckbox.checked) {
    this.rule.enabled = true;
  } else {
    this.rule.enabled = false;
  }
  this.rule.update();
};

module.exports = RuleCard;
