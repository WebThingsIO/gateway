/**
 * Gateway Model.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('../api');
const Model = require('./model');
const ThingModel = require('./thing-model');
const Constants = require('../constants');

class GatewayModel extends Model {
  constructor() {
    super();
    this.thingModels = new Map();
    this.things = new Map();
    this.queue = Promise.resolve(true);
    this.refreshThings();
    return this;
  }

  addQueue(job) {
    this.queue = this.queue.then(job)
      .catch((e) => {
        console.error(e);
      });
    return this.queue;
  }

  subscribe(event, handler, immediate = false) {
    super.subscribe(event, handler);
    switch (event) {
      case Constants.REFRESH_THINGS:
        if (immediate) {
          handler(this.things);
        }
        break;
      case Constants.DELETE_THINGS:
        break;
      default:
        console.warn(`GatewayModel does not support event:${event}`);
        break;
    }
  }

  setThing(thingId, description) {
    if (!this.thingModels.has(thingId)) {
      const thingModel = new ThingModel(description);
      thingModel.subscribe(
        Constants.DELETE_THING,
        this.handleRemove.bind(this)
      );
      this.thingModels.set(thingId, thingModel);
    }
    this.things.set(thingId, description);
  }

  getThing(thingId) {
    if (this.thingModels.has(thingId) && this.things.has(thingId)) {
      return Promise.resolve(this.things.get(thingId));
    }
    return this.refreshThing(thingId).then(() => {
      return this.things.get(thingId);
    });
  }

  getThingModel(thingId) {
    if (this.thingModels.has(thingId)) {
      return Promise.resolve(this.thingModels.get(thingId));
    }
    return this.refreshThing(thingId).then(() => {
      return this.thingModels.get(thingId);
    });
  }


  /**
   * Remove the thing.
   *
   * @param {string} thingId - Id of the thing
   */
  removeThing(thingId) {
    if (!this.thingModels.has(thingId)) {
      return Promise.reject(`No Thing id:${thingId}`);
    }
    return this.addQueue(() => {
      if (!this.thingModels.has(thingId)) {
        throw new Error(`Thing id:${thingId} already removed`);
      }
      const thingModel = this.thingModels.get(thingId);
      return thingModel.removeThing();
    });
  }

  /**
   * Update the thing.
   *
   * @param {string} thingId - Id of the thing
   * @param {object} updates - contents of update
   */
  updateThing(thingId, updates) {
    if (!this.thingModels.has(thingId)) {
      return Promise.reject(`No Thing id:${thingId}`);
    }
    return this.addQueue(() => {
      if (!this.thingModels.has(thingId)) {
        throw new Error(`Thing id:${thingId} already removed`);
      }
      const thingModel = this.thingModels.get(thingId);
      return thingModel.updateThing(updates).then(() => {
        this.refreshThing(thingId);
      });
    });
  }

  handleRemove(thingId) {
    if (this.thingModels.has(thingId)) {
      this.thingModels.get(thingId).cleanup();
      this.thingModels.delete(thingId);
    }
    if (this.things.has(thingId)) {
      this.things.delete(thingId);
    }
    return this.handleEvent(Constants.DELETE_THINGS, this.things);
  }

  refreshThings() {
    const opts = {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    };

    return this.addQueue(() => {
      return fetch('/things', opts).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`response status:${response.statusText}`);
        }
      }).then((things) => {
        things.forEach((description) => {
          const thingId = description.href.split('/').pop();
          this.setThing(thingId, description);
        });
        return this.handleEvent(Constants.REFRESH_THINGS, this.things);
      }).catch((e) => {
        console.error(`Get things failed ${e}`);
      });
    });
  }

  refreshThing(thingId) {
    const opts = {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    };

    return this.addQueue(() => {
      return fetch(`/things/${encodeURIComponent(thingId)}`,
                   opts).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`response status:${response.statusText}`);
        }
      }).then((description) => {
        if (!description) {
          throw new Error(`Unavailable Thing Description: ${description}`);
        }
        this.setThing(thingId, description);
        return this.handleEvent(Constants.REFRESH_THINGS, this.things);
      }).catch((e) => {
        console.error(`Get thing id:${thingId} failed ${e}`);
      });
    });
  }
}

module.exports = GatewayModel;
