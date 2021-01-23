/**
 * Adapter Controller.
 *
 * Manages HTTP requests to /adapters.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import addonManager from '../addon-manager';

function build(): express.Router {
  const controller = express.Router();

  /**
   * Return a list of adapters
   */
  controller.get('/', (_request, response) => {
    const adapters = addonManager.getAdapters();
    const adapterList = Array.from(adapters.values()).map((adapter: any) => {
      return adapter.asDict();
    });
    response.json(adapterList);
  });

  /**
   * Get a particular adapter.
   */
  controller.get('/:adapterId/', (request, response) => {
    const adapterId = request.params.adapterId;
    const adapter = addonManager.getAdapter(adapterId);
    if (adapter) {
      response.json(adapter.asDict());
    } else {
      response.status(404).send(`Adapter "${adapterId}" not found.`);
    }
  });

  return controller;
}

export default build;
