'use strict';

const childProcess = require('child_process');
const config = require('config');
const fs = require('fs');
const fetch = require('node-fetch');
const semver = require('semver');
const Platform = require('../platform');
const PromiseRouter = require('express-promise-router');
const Utils = require('../utils');

const pkg = require('../../package.json');

const UpdatesController = PromiseRouter();

function readVersion(packagePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(packagePath, {encoding: 'utf8'}, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const pkgJson = JSON.parse(data);

        if (!semver.valid(pkgJson.version)) {
          reject(new Error(`Invalid gateway semver: ${pkgJson.version}`));
          return;
        }

        resolve(pkgJson.version);
      } catch (e) {
        reject(e);
      }
    });
  });
}

function stat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(null);
        } else {
          reject(err);
        }
      } else {
        resolve(stats);
      }
    });
  });
}

const cacheLatest = {
  tag: null,
  time: 0,
  value: {version: null},
};
const cacheDuration = 60 * 1000;

function cacheLatestInsert(response, value) {
  cacheLatest.tag = response.get('etag');
  cacheLatest.time = Date.now();
  cacheLatest.value = value;
}

/**
 * Send the client an object describing the latest release
 */
UpdatesController.get('/latest', async (request, response) => {
  const etag = request.get('If-None-Match');
  if (etag) {
    if (cacheLatest.tag === etag &&
        Date.now() - cacheLatest.time < cacheDuration) {
      response.sendStatus(304);
      return;
    }
  }

  const res = await fetch(
    config.get('updates.url'),
    {headers: {'User-Agent': Utils.getGatewayUserAgent()}}
  );

  const releases = await res.json();
  if (!releases || !releases.filter) {
    console.warn('API returned invalid releases, rate limit likely exceeded');
    const value = {version: null};
    response.send(value);
    cacheLatestInsert(response, value);
    return;
  }
  const latestRelease = releases.filter((release) => {
    if (release.prerelease && !config.get('updates.allowPrerelease')) {
      return false;
    }

    if (release.draft) {
      return false;
    }

    return true;
  })[0];
  if (!latestRelease) {
    console.warn('No releases found');
    const value = {version: null};
    response.send(value);
    cacheLatestInsert(response, value);
    return;
  }
  const releaseVer = latestRelease.tag_name;
  const value = {version: releaseVer};
  response.send(value);
  cacheLatestInsert(response, value);
});

/**
 * Send an object describing the update status of the gateway
 */
UpdatesController.get('/status', async (request, response) => {
  // gateway, gateway_failed, gateway_old
  // oldVersion -> gateway_old's package.json version
  // if (gateway_failed.version > thisversion) {
  //  update failed, last attempt was ctime of gateway_failed
  // }
  const currentVersion = pkg.version;

  const oldStats = await stat('../gateway_old/package.json');
  let oldVersion = null;
  if (oldStats) {
    try {
      oldVersion = await readVersion('../gateway_old/package.json');
    } catch (e) {
      console.error('Failed to read ../gateway_old/package.json:', e);
    }
  }

  const failedStats = await stat('../gateway_failed/package.json');
  let failedVersion = null;
  if (failedStats) {
    try {
      failedVersion = await readVersion('../gateway_failed/package.json');
    } catch (e) {
      console.error('Failed to read ../gateway_failed/package.json:', e);
    }
  }

  if (failedVersion && semver.gt(failedVersion, currentVersion)) {
    response.send({
      success: false,
      version: currentVersion,
      failedVersion,
      timestamp: failedStats.ctime,
    });
  } else {
    let timestamp = null;
    if (oldStats) {
      timestamp = oldStats.ctime;
    }
    response.send({
      success: true,
      version: currentVersion,
      oldVersion,
      timestamp,
    });
  }
});

UpdatesController.post('/update', async (request, response) => {
  childProcess.exec('sudo systemctl start ' +
    'webthings-gateway.check-for-update.service');

  response.json({});
});

UpdatesController.get('/self-update', async (request, response) => {
  if (!Platform.implemented('getSelfUpdateStatus')) {
    response.json({
      available: false,
      enabled: false,
    });
  } else {
    response.json(Platform.getSelfUpdateStatus());
  }
});

UpdatesController.put('/self-update', async (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('enabled')) {
    response.status(400).send('Enabled property not defined');
    return;
  }

  if (!Platform.implemented('setSelfUpdateStatus')) {
    response.status(500).send('Cannot toggle auto updates');
    return;
  }

  if (Platform.setSelfUpdateStatus(request.body.enabled)) {
    response.status(200).json({enabled: request.body.enabled});
  } else {
    response.status(500).send('Failed to toggle auto updates');
  }
});

module.exports = UpdatesController;
