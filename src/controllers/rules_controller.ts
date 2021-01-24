/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import APIError from '../rules-engine/APIError';
import Database from '../rules-engine/Database';
import Engine from '../rules-engine/Engine';
import Rule from '../rules-engine/Rule';

class RulesController {
  private controller: express.Router;

  private engine: Engine;

  constructor() {
    this.controller = express.Router();
    this.engine = new Engine();

    this.controller.get('/', async (_req, res) => {
      const rules = await this.engine.getRules();
      res.send(rules.map((rule: any) => {
        return rule.toDescription();
      }));
    });


    this.controller.get('/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const rule = await this.engine.getRule(id);
        res.send(rule.toDescription());
      } catch (e) {
        res.status(404).send(
          new APIError('Engine failed to get rule', e).toString());
      }
    });

    this.controller.post('/', this.parseRuleFromBody.bind(this), async (req, res) => {
      const ruleId = await this.engine.addRule((req as any).rule);
      res.send({id: ruleId});
    });

    this.controller.put('/:id', this.parseRuleFromBody.bind(this), async (req, res) => {
      try {
        await this.engine.updateRule(parseInt(req.params.id), (req as any).rule);
        res.send({});
      } catch (e) {
        res.status(404).send(
          new APIError('Engine failed to update rule', e).toString());
      }
    });

    this.controller.delete('/:id', async (req, res) => {
      try {
        await this.engine.deleteRule(parseInt(req.params.id));
        res.send({});
      } catch (e) {
        res.status(404).send(
          new APIError('Engine failed to delete rule', e).toString());
      }
    });
  }

  async configure(): Promise<void> {
    await Database.open();
    await this.engine.getRules();
  }

  /**
   * Express middleware for extracting rules from the bodies of requests
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {Function} next
   */
  parseRuleFromBody(req: express.Request, res: express.Response, next: express.NextFunction): void {
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

  getController(): express.Router {
    return this.controller;
  }
}

export default new RulesController();
