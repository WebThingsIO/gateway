/**
 * Directories Controller.
 *
 * Manages HTTP requests to /directories.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Constants from '../constants';
import express from 'express';
import expressWs from 'express-ws';
import Directory from '../models/directory';
import Directories from '../models/directories';
import Things from '../models/things';
import { WithJWT } from '../jwt-middleware';
import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

interface DirectoryAddedMessage {
  messageType: 'directoryAdded';
  id: string;
  data: Record<string, never>;
}

interface DirectoryModifiedMessage {
  messageType: 'directoryModified';
  id: string;
  data: Record<string, never>;
}

interface DirectoryRemovedMessage {
  messageType: 'directoryRemoved';
  id: string;
  data: Record<string, never>;
}

interface ErrorMessage {
  messageType: 'error';
  data: {
    code: number;
    status: string;
    message: string;
  };
}

type OutgoingMessage =
  | DirectoryAddedMessage
  | DirectoryModifiedMessage
  | DirectoryRemovedMessage
  | ErrorMessage;

function build(): express.Router {
  const controller: express.Router & expressWs.WithWebsocketMethod = express.Router();

  controller.ws('/', websocketHandler);

  /**
   * Get a list of Directories.
   */
  controller.get('/', (req, response) => {
    const request = <express.Request & WithJWT>req;
    if (request.jwt.getPayload()!.role !== Constants.USER_TOKEN) {
      if (!request.jwt.getPayload()!.scope) {
        response.status(400).send('Token must contain scope');
      } else {
        const scope = request.jwt.getPayload()!.scope!;
        if (
          !scope.includes(' ') &&
          scope.indexOf('/') == 0 &&
          scope.split('/').length == 2 &&
          scope.split(':')[0] === Constants.DIRECTORIES_PATH
        ) {
          Directories.getDirectoryDescriptions().then((directories) => {
            response.status(200).json(directories);
          });
        } else {
          // Get hrefs of directories in scope
          const paths = scope.split(' ');
          const hrefs = new Array(0);
          for (const path of paths) {
            const parts = path.split(':');
            hrefs.push(parts[0]);
          }
          Directories.getListDirectoryDescriptions(hrefs).then(
            (directories) => {
              response.status(200).json(directories);
            }
          );
        }
      }
    } else {
      Directories.getDirectoryDescriptions().then((directories) => {
        response.status(200).json(directories);
      });
    }
  });

  /**
   * Handle creating a new directory.
   */
  controller.post('/', async (request, response) => {
    const description = request.body;
    const id = uuidv4();

    try {
      // If the directory already exists, bail out.
      await Directories.getDirectory(id);
      const err = 'Directory already added';
      console.log(err, id);
      response.status(400).send(err);
      return;
    } catch (_e) {
      // Do nothing, this is what we want.
    }

    try {
      const directory = await Directories.createDirectory(id, description);
      console.log(`Successfully created new directory ${directory.title}`);
      response.status(201).send(directory);
    } catch (error) {
      console.error('Error saving new directory', id, description);
      console.error(error);
      response.status(500).send(error);
    }
  });

  /**
   * Get a Directory.
   */
  controller.get('/:directoryId', (request, response) => {
    const id = request.params.directoryId;
    Directories.getDirectoryDescription(id)
      .then((directory) => {
        response.status(200).json(directory);
      })
      .catch((error: unknown) => {
        console.error(`Error getting directory description for directory with id ${id}:`, error);
        response.status(404).send(error);
      });
  });

  /**
   * Get things in a Directory.
   */
  controller.get('/:directoryId/things', (request, response) => {
    const id = request.params.directoryId;
    Things.getThingDescriptions(request.get('Host'), request.secure)
      .then((things) => {
        const filteredThings = Array.from(things.values())
          .filter((thing) => {
            return thing.directory_id == id;
          });
        response.status(200).json(filteredThings);
      })
      .catch((error: unknown) => {
        console.error(`Error getting things in directory ${id}:`, error);
        response.status(404).send(error);
      });
  });

  /**
   * Modify a Directory's layout index.
   */
  controller.patch('/:directoryId', async (request, response) => {
    const directoryId = request.params.directoryId;
    if (!request.body) {
      response.status(400).send('request body missing');
      return;
    }

    let directory;
    try {
      directory = await Directories.getDirectory(directoryId);
    } catch (e) {
      response.status(404).send('directory not found');
      return;
    }

    let description;
    try {
      if (request.body.hasOwnProperty('layoutIndex')) {
        description = await directory.setLayoutIndex(request.body.layoutIndex);
      } else {
        response.status(400).send('request body missing required parameters');
        return;
      }

      response.status(200).json(description);
    } catch (e) {
      response.status(500).send(`Failed to update directory ${directoryId}: ${e}`);
    }
  });

  /**
   * Modify a Directory.
   */
  controller.put('/:directoryId', async (request, response) => {
    const directoryId = request.params.directoryId;
    if (!request.body || !request.body.hasOwnProperty('title')) {
      response.status(400).send('title parameter required');
      return;
    }

    const title = request.body.title.trim();
    if (title.length === 0) {
      response.status(400).send('Invalid title');
      return;
    }

    let directory;
    try {
      directory = await Directories.getDirectory(directoryId);
    } catch (e) {
      response.status(500).send(`Failed to retrieve directory ${directoryId}: ${e}`);
      return;
    }

    let description;
    try {
      description = await directory.setTitle(title);
    } catch (e) {
      response.status(500).send(`Failed to update directory ${directoryId}: ${e}`);
      return;
    }

    response.status(200).json(description);
  });

  /**
   * Remove a Directory.
   */
  controller.delete('/:directoryId', (request, response) => {
    const directoryId = request.params.directoryId;

    Directories.removeDirectory(directoryId)
      .then(() => {
        console.log(`Successfully deleted ${directoryId} from database.`);
        response.sendStatus(204);
      })
      .catch((e: unknown) => {
        response.status(500).send(`Failed to remove directory ${directoryId}: ${e}`);
      });
  });

  function websocketHandler(websocket: WebSocket, _request: express.Request): void {
    // Since the Gateway have the asynchronous express middlewares, there is a
    // possibility that the WebSocket have been closed.
    if (websocket.readyState !== WebSocket.OPEN) {
      return;
    }

    function sendMessage(message: OutgoingMessage): void {
      websocket.send(JSON.stringify(message), (err) => {
        if (err) {
          console.error(`WebSocket sendMessage failed: ${err}`);
        }
      });
    }

    let directoryCleanups: Record<string, () => void> = {};

    function addDirectory(directory: Directory): void {
      const onModified = (): void => {
        sendMessage({
          id: directory.getId(),
          messageType: Constants.DIRECTORY_MODIFIED,
          data: {},
        });
      };
      directory.addModifiedSubscription(onModified);

      const directoryCleanup = (): void => {
        directory.removeModifiedSubscription(onModified);
      };
      directoryCleanups[directory.getId()] = directoryCleanup;
    }

    function onDirectoryAdded(directory: Directory): void {
      sendMessage({
        id: directory.getId(),
        messageType: Constants.DIRECTORY_ADDED,
        data: {},
      });

      addDirectory(directory);
    }

    function onDirectoryRemoved(directory: Directory): void {
      if (directoryCleanups[directory.getId()]) {
        directoryCleanups[directory.getId()]();
        delete directoryCleanups[directory.getId()];
      }
      sendMessage({
        id: directory.getId(),
        messageType: Constants.DIRECTORY_REMOVED,
        data: {},
      });
    }

    Directories.getDirectories().then((directories: Map<string, Directory>) => {
      directories.forEach(addDirectory);
    });
    Directories.on(Constants.DIRECTORY_ADDED, onDirectoryAdded);
    Directories.on(Constants.DIRECTORY_REMOVED, onDirectoryRemoved);

    const heartbeatInterval = setInterval(() => {
      try {
        websocket.ping();
      } catch (e) {
        // Do nothing. Let cleanup() handle directories if necessary.
        websocket.terminate();
      }
    }, 30 * 1000);

    const cleanup = (): void => {
      Directories.removeListener(Constants.DIRECTORY_ADDED, onDirectoryAdded);
      for (const id in directoryCleanups) {
        directoryCleanups[id]();
      }
      directoryCleanups = {};
      clearInterval(heartbeatInterval);
    };

    websocket.on('error', cleanup);
    websocket.on('close', cleanup);

    websocket.on('message', (_requestText: string) => {
      sendMessage({
        messageType: Constants.ERROR,
        data: {
          code: 400,
          status: '400 Bad Request',
          message: `Invalid request`,
        },
      });
    });
  }

  return controller;
}

export default build;
