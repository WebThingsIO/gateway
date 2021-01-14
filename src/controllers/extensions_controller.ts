import express from 'express';
import fs from 'fs';
import GlobToRegExp from 'glob-to-regexp';
import path from 'path';
import {APIRequest} from 'gateway-addon';
import UserProfile from '../user-profile';
import * as jwtMiddleware from '../jwt-middleware';

const AddonManager = require('../addon-manager');

function build(): express.Router {
  const auth = jwtMiddleware.middleware();
  const controller = express.Router();

  controller.get('/', auth, (_request, response) => {
    const map: Record<string, any> = {};
    for (const [key, value] of Object.entries(AddonManager.getExtensions())) {
      map[key] = (value as any).extensions;
    }
    response.status(200).json(map);
  });

  /**
   * Extension API handler.
   */
  controller.all('/:extensionId/api/*', auth, async (request, response) => {
    const extensionId = request.params.extensionId;
    const apiHandler = AddonManager.getAPIHandler(extensionId);
    if (!apiHandler) {
      response.status(404).send(`Extension "${extensionId}" not found.`);
      return;
    }

    const req = new APIRequest({
      method: request.method,
      path: `/${request.path.split('/').slice(3).join('/')}`,
      query: request.query || {},
      body: request.body || {},
    });

    try {
      const rsp = await apiHandler.handleRequest(req);
      response.status(rsp.status);

      if (rsp.contentType && rsp.content !== null &&
          typeof rsp.content !== 'undefined') {
        response.type(rsp.contentType);
        response.send(rsp.content);
      } else {
        response.end();
      }
    } catch (e) {
      console.error('Error calling API handler:', e);
      response.status(500).send(e);
    }
  });

  /**
   * Static resource handler for extensions. This is intentionally
   * unauthenticated, since we're just loading static content.
   */
  controller.get('/:extensionId/*', (request, response) => {
    const extensionId = request.params.extensionId;
    const relPath = request.path.split('/').slice(2).join('/');

    // make sure the extension is installed and enabled
    const extensions = AddonManager.getExtensions();
    if (!extensions.hasOwnProperty(extensionId)) {
      response.status(404).send();
      return;
    }

    // make sure the requested resource is listed in the extension's
    // web_accessible_resources array
    let matched = false;
    const resources = extensions[extensionId].resources;
    for (let resource of resources) {
      resource = GlobToRegExp(resource);
      if (resource.test(relPath)) {
        matched = true;
        break;
      }
    }

    if (!matched) {
      response.status(404).send();
      return;
    }

    // make sure the file actually exists
    const fullPath = path.join(UserProfile.addonsDir, extensionId, relPath);
    if (!fs.existsSync(fullPath)) {
      response.status(404).send();
      return;
    }

    // finally, send the file
    response.sendFile(fullPath);
  });

  return controller;
}

export = build;
