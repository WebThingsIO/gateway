/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';

const APIError = require('../rules-engine/APIError');
const Database = require('../rules-engine/Database');
const Engine = require('../rules-engine/Engine');
const Rule = require('../rules-engine/Rule');

/**
 * Express middleware for extracting rules from the bodies of requests
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
function parseRuleFromBody(req: express.Request, res: express.Response, next: express.NextFunction):
void {
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
  } catch (e) {
    res.status(400).send(new APIError('Invalid rule', e).toString());
    return;
  }
  (req as any).rule = rule;
  next();
}

class RulesController {
  private engine: any;

  constructor() {
    this.engine = new Engine();
  }

  async configure(): Promise<void> {
    await Database.open()
    await this.engine.getRules();
  }

  build(): express.Router {
    const index = express.Router();

    index.get('/', async (_req, res) => {
      const rules = await this.engine.getRules();
      res.send(rules.map((rule: any) => {
        return rule.toDescription();
      }));
    });


    index.get('/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const rule = await this.engine.getRule(id);
        res.send(rule.toDescription());
      } catch (e) {
        res.status(404).send(new APIError('Engine failed to get rule', e).toString());
      }
    });

    index.post('/', parseRuleFromBody, async (req, res) => {
      const ruleId = await this.engine.addRule((req as any).rule);
      res.send({id: ruleId});
    });

    index.put('/:id', parseRuleFromBody, async (req, res) => {
      try {
        await this.engine.updateRule(parseInt(req.params.id), (req as any).rule);
        res.send({});
      } catch (e) {
        res.status(404).send(new APIError('Engine failed to update rule', e).toString());
      }
    });

    index.delete('/:id', async (req, res) => {
      try {
        await this.engine.deleteRule(req.params.id);
        res.send({});
      } catch (e) {
        res.status(404).send(new APIError('Engine failed to delete rule', e).toString());
      }
    });

    return index;
  }
}

export = new RulesController();
