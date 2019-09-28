'use strict';

const AddonManager = require('../addon-manager');
const {APIRequest} = require('gateway-addon');
const UserProfile = require('../user-profile');
const express = require('express');
const fs = require('fs');
const globToRegExp = require('glob-to-regexp');
const jwtMiddleware = require('../jwt-middleware');
const path = require('path');

const auth = jwtMiddleware.middleware();
const ExtensionsController = express.Router();

ExtensionsController.get('/', auth, (request, response) => {
  const map = {};
  for (const [key, value] of Object.entries(AddonManager.getExtensions())) {
    map[key] = value.extensions;
  }
  response.status(200).json(map);
});

/**
 * Extension API handler.
 */
ExtensionsController.all(
  '/:extensionId/api/*',
  auth,
  async (request, response) => {
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

      if (rsp.contentType && rsp.content !== null) {
        response.type(rsp.contentType);
        response.send(rsp.content);
      } else {
        response.end();
      }
    } catch (e) {
      console.error('Error calling API handler:', e);
      response.status(500).send(e);
    }
  }
);

/**
 * Static resource handler for extensions. This is intentionally
 * unauthenticated, since we're just loading static content.
 */
ExtensionsController.get('/:extensionId/*', (request, response) => {
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
    resource = globToRegExp(resource);
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

module.exports = ExtensionsController;
