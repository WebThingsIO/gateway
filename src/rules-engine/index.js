/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const PromiseRouter = require('express-promise-router');
const config = require('config');
const storage = require('node-persist');
const winston = require('winston');

const APIError = require('./APIError');
const Database = require('./Database');
const Engine = require('./Engine');
const JSONWebToken = require('../models/jsonwebtoken');
const Rule = require('./Rule');

const index = PromiseRouter();

winston.cli();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function storageInit() {
  return storage.init({
    dir: config.get('settings.directory')
  });
}

let engine = new Engine();

/**
 * Express middleware for extracting rules from the bodies of requests
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
function parseRuleFromBody(req, res, next) {
  if (!req.body.trigger) {
    res.status(400).send(new APIError('No trigger provided').toString());
    return;
  }
  if (!req.body.effect) {
    res.status(400).send(new APIError('No effect provided').toString());
    return;
  }

  let rule = null;
  try {
    rule = Rule.fromDescription(req.body);
  } catch(e) {
    res.status(400).send(new APIError('Invalid rule', e).toString());
    return;
  }
  req.rule = rule;
  next();
}

index.get('/', async function(req, res) {
  let rules = await engine.getRules();
  res.send(rules.map(rule => {
    return rule.toDescription();
  }));
});


index.get('/:id', async function(req, res) {
  try {
    const id = parseInt(req.params.id);
    const rule = await engine.getRule(id);
    res.send(rule.toDescription());
  } catch(e) {
    res.status(404).send(
      new APIError('Engine failed to get rule', e).toString());
  }
});

index.post('/', parseRuleFromBody, async function(req, res) {
  let ruleId = await engine.addRule(req.rule);
  res.send({id: ruleId});
});

index.put('/:id', parseRuleFromBody, async function(req, res) {
  try {
    await engine.updateRule(parseInt(req.params.id), req.rule);
    res.send({});
  } catch(e) {
    res.status(404).send(
      new APIError('Engine failed to update rule', e).toString());
  }
});

index.delete('/:id', async function(req, res) {
  try {
    await engine.deleteRule(req.params.id)
    res.send({});
  } catch(e) {
    res.status(404).send(
      new APIError('Engine failed to delete rule', e).toString());
  }
});

index.configure = async function(gatewayHref) {
  if (!storage.setItem) {
    await storageInit();
  }
  await storage.setItem('RulesEngine.gateway', gatewayHref);
  await storage.setItem('RulesEngine.jwt', await JSONWebToken.issueToken(-1));

  await Database.open();
  await engine.getRules();
};

module.exports = index;
