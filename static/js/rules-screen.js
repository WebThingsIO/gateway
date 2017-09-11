/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

/* global API, Gateway, RuleCard, page */

'use strict';

// eslint-disable-next-line no-unused-vars
var RulesScreen = {
  init: function() {
    this.createRuleButton = document.getElementById('create-rule');
    this.rulesList = document.getElementById('rules');
    this.gateway = new Gateway();
    this.nextId = 0;
  },

  /**
   * @return {Promise<Array<RuleDescription>>}
   */
  readRules: function readRules() {
    return fetch('/rules', {headers: API.headers()}).then(res => {
      return res.json();
     }).then(fetchedRules => {
       this.rulesList.querySelectorAll('.rule').forEach(elt => {
         if (elt.id === 'create-rule') {
           return;
         }
         elt.parentNode.removeChild(elt);
       });

       for (let ruleDesc of fetchedRules) {
         this.addRuleCard(ruleDesc);
       }
    });
  },
  /**
   * Add a rule, filling it with the data from a RuleDescription
   * @param {RuleDescription} desc
   */
  addRuleCard: function(desc) {
    let ruleElt = document.createElement('div');
    ruleElt.classList.add('rule');
    new RuleCard(this.gateway, ruleElt, this.nextId, desc);
    this.nextId += 1;
    this.rulesList.appendChild(ruleElt);
  },

  show: function() {
    this.gateway.readThings().then(() => {
      return this.readRules();
    }).then(() => {
      this.createRuleButton.addEventListener('click', () => {
        page('/rules/new');
      });
    });
  }
};
