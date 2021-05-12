/**
 * Things Model.
 *
 * Manages the data model and business logic for a collection of Things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Ajv from 'ajv';
import { EventEmitter } from 'events';
import AddonManager from '../addon-manager';
import Database from '../db';
import Thing, { Router, ThingDescription } from './thing';
import * as Constants from '../constants';
import { Any, Device as DeviceSchema } from 'gateway-addon/lib/schema';
import WebSocket from 'ws';
import { HttpErrorWithCode } from '../errors';

const ajv = new Ajv({ strict: false });

class Things extends EventEmitter {
  /**
   * A Map of Things in the Things database.
   */
  private things: Map<string, Thing>;

  /**
   * A collection of open websockets listening for new things.
   */
  private websockets: WebSocket[];

  /**
   * The promise object returned by Database.getThings()
   */
  private getThingsPromise?: Promise<Map<string, Thing>> | null;

  private router?: Router;

  constructor() {
    super();

    this.things = new Map<string, Thing>();
    this.websockets = [];
  }

  setRouter(router: Router): void {
    this.router = router;
  }

  /**
   * Get all Things known to the Gateway, initially loading them from the
   * database,
   *
   * @return {Promise} which resolves with a Map of Thing objects.
   */
  getThings(): Promise<Map<string, Thing>> {
    if (this.things.size > 0) {
      return Promise.resolve(this.things);
    }

    if (this.getThingsPromise) {
      // We're still waiting for the database request.
      return this.getThingsPromise;
    }

    this.getThingsPromise = Database.getThings().then((things) => {
      this.getThingsPromise = null;

      // Update the map of Things
      this.things = new Map();
      things.forEach((thing, index) => {
        // This should only happen on the first migration. // TODO
        if (!thing.hasOwnProperty('layoutIndex')) {
          thing.layoutIndex = index;
        }

        this.things.set(
          <string>thing.id,
          new Thing(<string>thing.id, <ThingDescription>(<unknown>thing), this.router!)
        );
      });

      return this.things;
    });

    return this.getThingsPromise;
  }

  /**
   * Get the titles of all things.
   *
   * @return {Promise<Array>} which resolves with a list of all thing titles.
   */
  getThingTitles(): Promise<string[]> {
    return this.getThings().then((things) => {
      return Array.from(things.values()).map((t) => t.getTitle());
    });
  }

  /**
   * Get Thing Descriptions for all Things stored in the database.
   *
   * @param {String} reqHost request host, if coming via HTTP
   * @param {Boolean} reqSecure whether or not the request is secure, i.e. TLS
   * @return {Promise} which resolves with a list of Thing Descriptions.
   */
  getThingDescriptions(reqHost?: string, reqSecure?: boolean): Promise<ThingDescription[]> {
    return this.getThings().then((things) => {
      const descriptions = [];
      for (const thing of things.values()) {
        descriptions.push(thing.getDescription(reqHost, reqSecure));
      }
      return descriptions;
    });
  }

  /**
   * Get a list of Things by their hrefs.
   *
   * {Array} hrefs hrefs of the list of Things to get.
   * @return {Promise} A promise which resolves with a list of Things.
   */
  getListThings(hrefs: string[]): Promise<Thing[]> {
    return this.getThings().then((things) => {
      const listThings: Thing[] = [];
      for (const href of hrefs) {
        things.forEach((thing) => {
          if (thing.getHref() === href) {
            listThings.push(thing);
          }
        });
      }
      return listThings;
    });
  }

  /**
   * Get Thing Descriptions for a list of Things by their hrefs.
   *
   * @param {Array} hrefs The hrefs of the list of Things to get
   *                      descriptions of.
   * @param {String} reqHost request host, if coming via HTTP.
   * @param {Boolean} reqSecure whether or not the request is secure, i.e. TLS.
   * @return {Promise} which resolves with a list of Thing Descriptions.
   */
  getListThingDescriptions(
    hrefs: string[],
    reqHost?: string,
    reqSecure?: boolean
  ): Promise<ThingDescription[]> {
    return this.getListThings(hrefs).then((listThings) => {
      const descriptions = [];
      for (const thing of listThings) {
        descriptions.push(thing.getDescription(reqHost, reqSecure));
      }
      return descriptions;
    });
  }

  /**
   * Get a list of things which are connected to adapters but not yet saved
   * in the gateway database.
   *
   * @returns Promise A promise which resolves with a list of Things.
   */
  getNewThings(): Promise<DeviceSchema[]> {
    // Get a map of things in the database
    return this.getThings().then((storedThings) => {
      // Get a list of things connected to adapters
      const connectedThings: DeviceSchema[] = AddonManager.getThings();
      const newThings: DeviceSchema[] = [];
      connectedThings.forEach((connectedThing) => {
        if (!storedThings.has(connectedThing.id)) {
          connectedThing.href = `${Constants.THINGS_PATH}/${encodeURIComponent(connectedThing.id)}`;
          if (connectedThing.properties) {
            for (const propertyName in connectedThing.properties) {
              const property = connectedThing.properties[propertyName];
              property.href = `${Constants.THINGS_PATH}/${encodeURIComponent(connectedThing.id)}${
                Constants.PROPERTIES_PATH
              }/${encodeURIComponent(propertyName)}`;
            }
          }
          newThings.push(connectedThing);
        }
      });
      return newThings;
    });
  }

  /**
   * Create a new Thing with the given ID and description.
   *
   * @param String id ID to give Thing.
   * @param Object description Thing description.
   */
  async createThing(id: string, description: ThingDescription): Promise<ThingDescription> {
    const thing = new Thing(id, description, this.router!);
    thing.setConnected(true);

    const thingDesc = await Database.createThing(thing.getId(), thing.getDescription());
    this.things.set(thing.getId(), thing);
    await this.setThingLayoutIndex(thing, Infinity);
    this.emit(Constants.THING_ADDED, thing);
    return thingDesc;
  }

  /**
   * Handle a new Thing having been discovered.
   *
   * @param {Object} newThing - New Thing description
   */
  handleNewThing(newThing: ThingDescription): void {
    this.getThing(newThing.id)
      .then((thing) => {
        thing?.setConnected(true);
        return thing?.updateFromDescription(newThing, this.router!);
      })
      .catch(() => {
        // If we don't already know about this thing, notify each open websocket
        this.websockets.forEach((socket) => {
          socket.send(JSON.stringify(newThing));
        });
      });
  }

  /**
   * Handle a thing being removed by an adapter.
   *
   * @param {Object} thing - Thing which was removed
   */
  handleThingRemoved(thing: DeviceSchema): void {
    this.getThing(thing.id)
      .then((thing) => {
        thing?.setConnected(false);
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  }

  /**
   * Handle a thing's connectivity state change.
   *
   * @param {string} thingId - ID of thing
   * @param {boolean} connected - New connectivity state
   */
  handleConnected(thingId: string, connected: boolean): void {
    this.getThing(thingId)
      .then((thing) => {
        thing?.setConnected(connected);
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  }

  /**
   * Add a websocket to the list of new Thing subscribers.
   *
   * @param {Websocket} websocket A websocket instance.
   */
  registerWebsocket(websocket: WebSocket): void {
    this.websockets.push(websocket);
    websocket.on('close', () => {
      const index = this.websockets.indexOf(websocket);
      this.websockets.splice(index, 1);
    });
  }

  /**
   * Get a Thing by its ID.
   *
   * @param {String} id The ID of the Thing to get.
   * @return {Promise<Thing>} A Thing object.
   */
  getThing(id: string): Promise<Thing> {
    return this.getThings().then((things) => {
      const thing = things.get(id);
      if (thing) {
        return thing;
      } else {
        throw new Error(`Unable to find thing with id = ${id}`);
      }
    });
  }

  /**
   * Get a Thing by its title.
   *
   * @param {String} title The title of the Thing to get.
   * @return {Promise<Thing>} A Thing object.
   */
  getThingByTitle(title: string): Promise<Thing | null> {
    title = title.toLowerCase();

    return this.getThings()
      .then((things) => {
        for (const thing of things.values()) {
          if (thing.getTitle().toLowerCase() === title) {
            return thing;
          }
        }

        throw new Error(`Unable to find thing with title = ${title}`);
      })
      .catch((e) => {
        console.warn('Unexpected thing retrieval error', e);
        return null;
      });
  }

  /**
   * Get a Thing description for a thing by its ID.
   *
   * @param {String} id The ID of the Thing to get a description of.
   * @param {String} reqHost request host, if coming via HTTP
   * @param {Boolean} reqSecure whether or not the request is secure, i.e. TLS
   * @return {Promise<ThingDescription>} A Thing description object.
   */
  getThingDescription(
    id: string,
    reqHost?: string,
    reqSecure?: boolean
  ): Promise<ThingDescription> {
    return this.getThing(id).then((thing) => {
      return thing?.getDescription(reqHost, reqSecure);
    });
  }

  /**
   * Set the layout index for a Thing.
   *
   * @param {number} thing The thing.
   * @param {number} index The new layout index.
   * @return {Promise} A promise which resolves with the description set.
   */
  async setThingLayoutIndex(thing: Thing, index: number, emitModified = true): Promise<void> {
    const things = Array.from(this.things.values())
      .filter((t) => t.getDirectory() == thing.getDirectory());

    index = Math.min(things.length - 1, Math.max(0, index));

    let movePromises: Promise<ThingDescription | null>[];

    if (thing.getLayoutIndex() < index) {
      movePromises = things.map((t) => {
        if (thing.getLayoutIndex() < t.getLayoutIndex() && t.getLayoutIndex() <= index) {
          return t.setLayoutIndex(t.getLayoutIndex() - 1);
        } else {
          return new Promise((resolve) => resolve(null));
        }
      });
    } else {
      movePromises = things.map((t) => {
        if (index <= t.getLayoutIndex() && t.getLayoutIndex() < thing.getLayoutIndex()) {
          return t.setLayoutIndex(t.getLayoutIndex() + 1);
        } else {
          return new Promise((resolve) => resolve(null));
        }
      });
    }

    await Promise.all(movePromises);
    await thing.setLayoutIndex(index);

    if (emitModified) {
      this.emit(Constants.LAYOUT_MODIFIED);
    }
  }

  /**
   * Set the directory for a Thing in the overview.
   *
   * @param {number} thing The thing.
   * @param {string} directory_id ID of the directory
   * @return {Promise} A promise which resolves with the description set.
   */
  async setThingDirectory(
    thing: Thing,
    directory_id: string | null,
    emitModified = true
  ): Promise<void> {
    if (!directory_id) {
      directory_id = null;
    }

    await this.setThingLayoutIndex(thing, Infinity, false);
    await thing.setDirectory(directory_id);
    const index = Array.from(this.things.values())
      .filter((t) => t.getDirectory() == thing.getDirectory())
      .length - 1;
    await thing.setLayoutIndex(index);

    if (emitModified) {
      this.emit(Constants.LAYOUT_MODIFIED);
    }
  }

  /**
   * Set the directory and layout index for a Thing in the overview.
   *
   * @param {number} thing The thing.
   * @param {string} directory_id ID of the directory
   * @param {number} index The new layout index.
   * @return {Promise} A promise which resolves with the description set.
   */
  async setThingDirectoryAndLayoutIndex(
    thing: Thing,
    directory_id: string | null,
    index: number
  ): Promise<void> {
    if (!directory_id) {
      directory_id = null;
    }
    await this.setThingDirectory(thing, directory_id, false);
    await this.setThingLayoutIndex(thing, index, false);
    this.emit(Constants.LAYOUT_MODIFIED);
  }

  /**
   * Remove a Thing.
   *
   * @param String id ID to give Thing.
   */
  removeThing(id: string): Promise<void> {
    this.router!.removeProxyServer(id);
    return Database.removeThing(id).then(() => {
      const thing = this.things.get(id);
      if (!thing) {
        return;
      }

      const index = thing.getLayoutIndex();
      const directory_id = thing.getDirectory();

      thing.remove();
      this.things.delete(id);

      Array.from(this.things.values())
        .filter((t) => t.getDirectory() == directory_id)
        .forEach((t) => {
          if (t.getLayoutIndex() > index) {
            t.setLayoutIndex(t.getLayoutIndex() - 1);
          }
        });
      this.emit(Constants.LAYOUT_MODIFIED);
    });
  }

  /**
   * @param {String} thingId
   * @param {String} propertyName
   * @return {Promise<Any>} resolves to value of property
   */
  async getThingProperty(thingId: string, propertyName: string): Promise<Any> {
    try {
      return await AddonManager.getProperty(thingId, propertyName);
    } catch (e) {
      console.error('Error getting value for thingId:', thingId, 'property:', propertyName);
      console.error(e);

      throw new HttpErrorWithCode(e, 500);
    }
  }

  /**
   * @param {String} thingId
   * @param {String} propertyName
   * @param {Any} value
   * @return {Promise<Any>} resolves to new value
   */
  async setThingProperty(thingId: string, propertyName: string, value: Any): Promise<Any> {
    let thing: ThingDescription;
    try {
      thing = await this.getThingDescription(thingId, 'localhost', true);
    } catch (e) {
      throw new HttpErrorWithCode('Thing not found', 404);
    }

    if (!thing.properties.hasOwnProperty(propertyName)) {
      throw new HttpErrorWithCode('Property not found', 404);
    }

    if (thing.properties[propertyName].readOnly) {
      throw new HttpErrorWithCode('Read-only property', 400);
    }

    const valid = ajv.validate(thing.properties[propertyName], value);
    if (!valid) {
      throw new HttpErrorWithCode('Invalid property value', 400);
    }

    try {
      const updatedValue = await AddonManager.setProperty(thingId, propertyName, value);
      // Note: it's possible that updatedValue doesn't match value.
      return updatedValue;
    } catch (e) {
      console.error(
        'Error setting value for thingId:',
        thingId,
        'property:',
        propertyName,
        'value:',
        value
      );

      throw new HttpErrorWithCode(e, 500);
    }
  }

  clearState(): void {
    this.websockets = [];
    this.things = new Map();
    this.removeAllListeners();
  }
}

const instance = new Things();

AddonManager.on(Constants.THING_ADDED, (thing: ThingDescription) => {
  instance.handleNewThing(thing);
});

AddonManager.on(Constants.THING_REMOVED, (thing: DeviceSchema) => {
  instance.handleThingRemoved(thing);
});

AddonManager.on(
  Constants.CONNECTED,
  ({ device, connected }: { device: DeviceSchema; connected: boolean }) => {
    instance.handleConnected(device.id, connected);
  }
);

export default instance;
