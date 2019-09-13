'use strict';

const AddonManager = require('../addon-manager');
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
