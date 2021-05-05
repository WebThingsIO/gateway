/**
 * Directories Model.
 *
 * Manages the data model and business logic for a collection of Directories.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EventEmitter } from 'events';
import Database from '../db';
import Directory, { DirectoryDescription } from './directory';

class Directories extends EventEmitter {
  /**
   * A Map of Directories in the Directories database.
   */
  private directories: Map<string, Directory>;

  /**
   * The promise object returned by Database.getDirectories()
   */
  private getDirectoriesPromise?: Promise<Map<string, Directory>> | null;

  constructor() {
    super();

    this.directories = new Map<string, Directory>();
  }

  /**
   * Get all Directories known to the Gateway, initially loading them from the
   * database,
   *
   * @return {Promise} which resolves with a Map of Directory objects.
   */
  getDirectories(): Promise<Map<string, Directory>> {
    if (this.directories.size > 0) {
      return Promise.resolve(this.directories);
    }

    if (this.getDirectoriesPromise) {
      // We're still waiting for the database request.
      return this.getDirectoriesPromise;
    }

    this.getDirectoriesPromise = Database.getDirectories().then((directories) => {
      this.getDirectoriesPromise = null;

      // Update the map of Directories
      this.directories = new Map();
      directories.forEach((directory) => {

        this.directories.set(
          <string>directory.id,
          new Directory(<string>directory.id, <DirectoryDescription>(<unknown>directory))
        );
      });

      return this.directories;
    });

    return this.getDirectoriesPromise;
  }

  /**
   * Get the titles of all directories.
   *
   * @return {Promise<Array>} which resolves with a list of all directory titles.
   */
  getDirectoryTitles(): Promise<string[]> {
    return this.getDirectories().then((directories) => {
      return Array.from(directories.values()).map((t) => t.getTitle());
    });
  }

  /**
   * Get Directory Descriptions for all Directories stored in the database.
   *
   * @return {Promise} which resolves with a list of Directory Descriptions.
   */
  getDirectoryDescriptions(): Promise<DirectoryDescription[]> {
    return this.getDirectories().then((directories) => {
      const descriptions = [];
      for (const directory of directories.values()) {
        descriptions.push(directory.getDescription());
      }
      return descriptions;
    });
  }

  /**
   * Get a list of Directories by their hrefs.
   *
   * {Array} hrefs hrefs of the list of Directories to get.
   * @return {Promise} A promise which resolves with a list of Directories.
   */
  getListDirectories(hrefs: string[]): Promise<Directory[]> {
    return this.getDirectories().then((directories) => {
      const listDirectories: Directory[] = [];
      for (const href of hrefs) {
        directories.forEach((directory) => {
          if (directory.getHref() === href) {
            listDirectories.push(directory);
          }
        });
      }
      return listDirectories;
    });
  }

  /**
   * Get Directory Descriptions for a list of Directories by their hrefs.
   *
   * @param {Array} hrefs The hrefs of the list of Directories to get
   *                      descriptions of.
   * @return {Promise} which resolves with a list of Directory Descriptions.
   */
  getListDirectoryDescriptions(hrefs: string[]): Promise<DirectoryDescription[]> {
    return this.getListDirectories(hrefs).then((listDirectories) => {
      const descriptions = [];
      for (const directory of listDirectories) {
        descriptions.push(directory.getDescription());
      }
      return descriptions;
    });
  }

  /**
   * Create a new Directory with the given ID and description.
   *
   * @param String id ID to give Directory.
   * @param Object description Directory description.
   */
  createDirectory(id: string, description: DirectoryDescription): Promise<DirectoryDescription> {
    const directory = new Directory(id, description);

    return Database.createDirectory(directory.getId(), directory.getDescription()).then((directoryDesc) => {
      this.directories.set(directory.getId(), directory);
      return directoryDesc;
    });
  }

  /**
   * Get a Directory by its ID.
   *
   * @param {String} id The ID of the Directory to get.
   * @return {Promise<Directory>} A Directory object.
   */
  getDirectory(id: string): Promise<Directory> {
    return this.getDirectories().then((directories) => {
      const directory = directories.get(id);
      if (directory) {
        return directory;
      } else {
        throw new Error(`Unable to find directory with id = ${id}`);
      }
    });
  }

  /**
   * Get a Directory description for a directory by its ID.
   *
   * @param {String} id The ID of the Directory to get a description of.
   * @return {Promise<DirectoryDescription>} A Directory description object.
   */
  getDirectoryDescription(id: string): Promise<DirectoryDescription> {
    return this.getDirectory(id).then((directory) => {
      return directory?.getDescription();
    });
  }

  /**
   * Remove a Directory.
   *
   * @param String id ID to give Directory.
   */
  removeDirectory(id: string): Promise<void> {
    return Database.removeDirectory(id).then(() => {
      const directory = this.directories.get(id);
      if (!directory) {
        return;
      }

      directory.remove();
      this.directories.delete(id);
    });
  }

  clearState(): void {
    this.directories = new Map();
    this.removeAllListeners();
  }
}

const instance = new Directories();

export default instance;
