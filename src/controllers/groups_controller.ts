/**
 * Groups Controller.
 *
 * Manages HTTP requests to /groups.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Constants from '../constants';
import express from 'express';
import expressWs from 'express-ws';
import Group from '../models/group';
import Groups from '../models/groups';
import Things from '../models/things';
import { WithJWT } from '../jwt-middleware';
import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

interface GroupAddedMessage {
  messageType: 'groupAdded';
  id: string;
  data: Record<string, never>;
}

interface GroupModifiedMessage {
  messageType: 'groupModified';
  id: string;
  data: Record<string, never>;
}

interface GroupRemovedMessage {
  messageType: 'groupRemoved';
  id: string;
  data: Record<string, never>;
}

interface LayoutModifiedMessage {
  messageType: 'layoutModified';
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
  | GroupAddedMessage
  | GroupModifiedMessage
  | GroupRemovedMessage
  | LayoutModifiedMessage
  | ErrorMessage;

function build(): express.Router {
  const controller: express.Router & expressWs.WithWebsocketMethod = express.Router();

  controller.ws('/', websocketHandler);

  /**
   * Get a list of Groups.
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
          scope.split(':')[0] === Constants.GROUPS_PATH
        ) {
          Groups.getGroupDescriptions().then((groups) => {
            response.status(200).json(groups);
          });
        } else {
          // Get hrefs of groups in scope
          const paths = scope.split(' ');
          const hrefs = new Array(0);
          for (const path of paths) {
            const parts = path.split(':');
            hrefs.push(parts[0]);
          }
          Groups.getListGroupDescriptions(hrefs).then((groups) => {
            response.status(200).json(groups);
          });
        }
      }
    } else {
      Groups.getGroupDescriptions().then((groups) => {
        response.status(200).json(groups);
      });
    }
  });

  /**
   * Handle creating a new group.
   */
  controller.post('/', async (request, response) => {
    const description = request.body;
    const id = uuidv4();

    try {
      // If the group already exists, bail out.
      await Groups.getGroup(id);
      const err = 'Group already added';
      console.log(err, id);
      response.status(400).send(err);
      return;
    } catch (_e) {
      // Do nothing, this is what we want.
    }

    try {
      const group = await Groups.createGroup(id, description);
      console.log(`Successfully created new group ${group.title}`);
      response.status(201).send(group);
    } catch (error) {
      console.error('Error saving new group', id, description);
      console.error(error);
      response.status(500).send(error);
    }
  });

  /**
   * Get a Group.
   */
  controller.get('/:groupId', (request, response) => {
    const id = request.params.groupId;
    Groups.getGroupDescription(id)
      .then((group) => {
        response.status(200).json(group);
      })
      .catch((error: unknown) => {
        console.error(`Error getting group description for group with id ${id}:`, error);
        response.status(404).send(error);
      });
  });

  /**
   * Get things in a Group.
   */
  controller.get('/:groupId/things', (request, response) => {
    const id = request.params.groupId;
    Things.getThingDescriptions(request.get('Host'), request.secure)
      .then((things) => {
        const filteredThings = Array.from(things.values()).filter((thing) => {
          return thing.groupId == id;
        });
        response.status(200).json(filteredThings);
      })
      .catch((error: unknown) => {
        console.error(`Error getting things in group ${id}:`, error);
        response.status(404).send(error);
      });
  });

  /**
   * Modify a Group's layout index.
   */
  controller.patch('/:groupId', async (request, response) => {
    const groupId = request.params.groupId;
    if (!request.body) {
      response.status(400).send('request body missing');
      return;
    }

    let group;
    try {
      group = await Groups.getGroup(groupId);
    } catch (e) {
      response.status(404).send('group not found');
      return;
    }

    try {
      if (request.body.hasOwnProperty('layoutIndex')) {
        await Groups.setGroupLayoutIndex(group, request.body.layoutIndex);
      } else {
        response.status(400).send('request body missing required parameters');
        return;
      }

      response.status(200).json(group.getDescription());
    } catch (e) {
      response.status(500).send(`Failed to update group ${groupId}: ${e}`);
    }
  });

  /**
   * Modify a Group.
   */
  controller.put('/:groupId', async (request, response) => {
    const groupId = request.params.groupId;
    if (!request.body || !request.body.hasOwnProperty('title')) {
      response.status(400).send('title parameter required');
      return;
    }

    const title = request.body.title.trim();
    if (title.length === 0) {
      response.status(400).send('Invalid title');
      return;
    }

    let group;
    try {
      group = await Groups.getGroup(groupId);
    } catch (e) {
      response.status(500).send(`Failed to retrieve group ${groupId}: ${e}`);
      return;
    }

    let description;
    try {
      description = await group.setTitle(title);
    } catch (e) {
      response.status(500).send(`Failed to update group ${groupId}: ${e}`);
      return;
    }

    response.status(200).json(description);
  });

  /**
   * Remove a Group.
   */
  controller.delete('/:groupId', (request, response) => {
    const groupId = request.params.groupId;

    Groups.removeGroup(groupId)
      .then(() => {
        console.log(`Successfully deleted ${groupId} from database.`);
        response.sendStatus(204);
      })
      .catch((e: unknown) => {
        response.status(500).send(`Failed to remove group ${groupId}: ${e}`);
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

    let groupCleanups: Record<string, () => void> = {};

    function addGroup(group: Group): void {
      const onModified = (): void => {
        sendMessage({
          id: group.getId(),
          messageType: Constants.GROUP_MODIFIED,
          data: {},
        });
      };
      group.addModifiedSubscription(onModified);

      const groupCleanup = (): void => {
        group.removeModifiedSubscription(onModified);
      };
      groupCleanups[group.getId()] = groupCleanup;
    }

    function onGroupAdded(group: Group): void {
      sendMessage({
        id: group.getId(),
        messageType: Constants.GROUP_ADDED,
        data: {},
      });

      addGroup(group);
    }

    function onGroupRemoved(group: Group): void {
      if (groupCleanups[group.getId()]) {
        groupCleanups[group.getId()]();
        delete groupCleanups[group.getId()];
      }
      sendMessage({
        id: group.getId(),
        messageType: Constants.GROUP_REMOVED,
        data: {},
      });
    }

    Groups.getGroups().then((groups: Map<string, Group>) => {
      groups.forEach(addGroup);
    });

    function onLayoutModified(): void {
      sendMessage({
        messageType: Constants.LAYOUT_MODIFIED,
        data: {},
      });
    }
    Groups.on(Constants.LAYOUT_MODIFIED, onLayoutModified);

    Groups.on(Constants.GROUP_ADDED, onGroupAdded);
    Groups.on(Constants.GROUP_REMOVED, onGroupRemoved);

    const heartbeatInterval = setInterval(() => {
      try {
        websocket.ping();
      } catch (e) {
        // Do nothing. Let cleanup() handle groups if necessary.
        websocket.terminate();
      }
    }, 30 * 1000);

    const cleanup = (): void => {
      Groups.removeListener(Constants.GROUP_ADDED, onGroupAdded);
      for (const id in groupCleanups) {
        groupCleanups[id]();
      }
      groupCleanups = {};
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
