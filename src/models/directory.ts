/**
 * Directory Model.
 *
 * Represents a Directory.
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
  addProxyServer: (directoryId: string, server: string) => void;
  removeProxyServer: (directoryId: string) => void;
}

export interface DirectoryDescription {
  id: string;
  title: string;
  href: string;
  layoutIndex: number;
}

export default class Directory extends EventEmitter {
  private id: string;

  private title: string;

  private href: string;

  private layoutIndex: number;

  /**
   * Directory constructor.
   *
   * Create a Directory object from an id and a valid Directory description.
   *
   * @param {String} id Unique ID.
   * @param {Object} description Directory description.
   */
  constructor(id: string, description: DirectoryDescription) {
    super();

    if (!id || !description) {
      throw new Error('id and description needed to create new Directory');
    }

    // Parse the Directory Description
    this.id = id;
    this.title = description.title || '';
    this.href = `${Constants.DIRECTORIES_PATH}/${encodeURIComponent(this.id)}`;
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
   * Set the title of this Directory.
   *
   * @param {String} title The new title
   * @return {Promise} A promise which resolves with the description set.
   */
  setTitle(title: string): Promise<DirectoryDescription> {
    this.title = title;
    return Database.updateDirectory(this.id, this.getDescription()).then((descr) => {
      this.emit(Constants.MODIFIED);
      return descr;
    });
  }

  /**
   * Get a JSON Directory Description for this Directory.
   */
  getDescription(): DirectoryDescription {
    const desc: DirectoryDescription = {
      title: this.title,
      href: this.href,
      layoutIndex: this.layoutIndex,
    } as DirectoryDescription;

    return desc;
  }

  /**
   * Remove the Directory
   */
  remove(): Promise<void> {
    return Things.getThings().then(async (things) => {
      for (const thing of things.values()) {
        if (thing.getDirectory() === this.getId()) {
          await Things.setThingDirectory(thing, null);
        }
      }
      this.emit(Constants.REMOVED, true);
    });
  }

  /**
   * Set the layout index for a Directory.
   *
   * @param {number} index The new layout index.
   * @return {Promise} A promise which resolves with the description set.
   */
  setLayoutIndex(index: number): Promise<DirectoryDescription> {
    this.layoutIndex = index;
    return Database.updateDirectory(this.id, this.getDescription()).then((descr) => {
      this.emit(Constants.MODIFIED);
      return descr;
    });
  }

  /**
   * Add a subscription to the Directory's modified state
   * @param {Function} callback
   */
  addModifiedSubscription(callback: () => void): void {
    this.on(Constants.MODIFIED, callback);
  }

  /**
   * Remove a subscription to the Directory's modified state
   * @param {Function} callback
   */
  removeModifiedSubscription(callback: () => void): void {
    this.removeListener(Constants.MODIFIED, callback);
  }

  /**
   * Add a subscription to the Directory's removed state
   * @param {Function} callback
   */
  addRemovedSubscription(callback: (arg: boolean) => void): void {
    this.on(Constants.REMOVED, callback);
  }

  /**
   * Remove a subscription to the Directory's removed state
   * @param {Function} callback
   */
  removeRemovedSubscription(callback: (arg: boolean) => void): void {
    this.removeListener(Constants.REMOVED, callback);
  }
}
