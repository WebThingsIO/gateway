/**
 * Group Model.
 *
 * Represents a Group.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Constants from '../constants';
import Database from '../db';
import { EventEmitter } from 'events';
import Things from './things';

export interface Router {
  addProxyServer: (groupId: string, server: string) => void;
  removeProxyServer: (groupId: string) => void;
}

export interface GroupDescription {
  id: string;
  title: string;
  href: string;
  layoutIndex: number;
}

export default class Group extends EventEmitter {
  private id: string;

  private title: string;

  private href: string;

  private layoutIndex: number;

  /**
   * Group constructor.
   *
   * Create a Group object from an id and a valid Group description.
   *
   * @param {String} id Unique ID.
   * @param {Object} description Group description.
   */
  constructor(id: string, description: GroupDescription) {
    super();

    if (!id || !description) {
      throw new Error('id and description needed to create new Group');
    }

    // Parse the Group Description
    this.id = id;
    this.title = description.title || '';
    this.href = `${Constants.GROUPS_PATH}/${encodeURIComponent(this.id)}`;
    this.layoutIndex = description.layoutIndex;
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getHref(): string {
    return this.href;
  }

  getLayoutIndex(): number {
    return this.layoutIndex;
  }

  /**
   * Set the title of this Group.
   *
   * @param {String} title The new title
   * @return {Promise} A promise which resolves with the description set.
   */
  setTitle(title: string): Promise<GroupDescription> {
    this.title = title;
    return Database.updateGroup(this.id, this.getDescription()).then((descr) => {
      this.emit(Constants.MODIFIED);
      return descr;
    });
  }

  /**
   * Get a JSON Group Description for this Group.
   */
  getDescription(): GroupDescription {
    const desc: GroupDescription = {
      title: this.title,
      href: this.href,
      layoutIndex: this.layoutIndex,
    } as GroupDescription;

    return desc;
  }

  /**
   * Remove the Group
   */
  remove(): Promise<void> {
    return Things.getThings().then(async (things) => {
      for (const thing of things.values()) {
        if (thing.getGroup() === this.getId()) {
          await Things.setThingGroup(thing, null);
        }
      }
      this.emit(Constants.REMOVED, true);
    });
  }

  /**
   * Set the layout index for a Group.
   *
   * @param {number} index The new layout index.
   * @return {Promise} A promise which resolves with the description set.
   */
  setLayoutIndex(index: number): Promise<GroupDescription> {
    this.layoutIndex = index;
    return Database.updateGroup(this.id, this.getDescription()).then((descr) => {
      return descr;
    });
  }

  /**
   * Add a subscription to the Group's modified state
   * @param {Function} callback
   */
  addModifiedSubscription(callback: () => void): void {
    this.on(Constants.MODIFIED, callback);
  }

  /**
   * Remove a subscription to the Group's modified state
   * @param {Function} callback
   */
  removeModifiedSubscription(callback: () => void): void {
    this.removeListener(Constants.MODIFIED, callback);
  }

  /**
   * Add a subscription to the Group's removed state
   * @param {Function} callback
   */
  addRemovedSubscription(callback: (arg: boolean) => void): void {
    this.on(Constants.REMOVED, callback);
  }

  /**
   * Remove a subscription to the Group's removed state
   * @param {Function} callback
   */
  removeRemovedSubscription(callback: (arg: boolean) => void): void {
    this.removeListener(Constants.REMOVED, callback);
  }
}
