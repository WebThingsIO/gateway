process.env.ALLOW_CONFIG_MUTATIONS = 'true';
const config = require('config');
const exec = require('child_process').exec;
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');
const semver = require('semver');
const Utils = require('../src/utils');

// Load in the local.json file, if it exists
const baseDir = path.resolve(
  process.env.WEBTHINGS_HOME || config.get('profileDir')
);
const userConfigPath = path.join(baseDir, 'config', 'local.json');
if (fs.existsSync(userConfigPath)) {
  const localConfig = config.util.parseFile(userConfigPath);
  if (localConfig) {
    config.util.extendDeep(config, localConfig);
  }
}

fetch(config.get('updates.url'),
      {headers: {'User-Agent': Utils.getGatewayUserAgent()}})
  .then((res) => {
    return res.json();
  })
  .then((releases) => {
    // Assumes that releases are in chronological order, latest-first
    return releases.filter((release) => {
      if (release.prerelease && !config.get('updates.allowPrerelease')) {
        return false;
      }

      if (release.draft) {
        return false;
      }

      return true;
    })[0];
  })
  .then((latestRelease) => {
    if (!latestRelease) {
      console.error('No releases found');
      return;
    }
    const releaseVer = latestRelease.tag_name;
    const currentVer = pkg.version;
    if (semver.lt(currentVer, releaseVer)) {
      // do upgrade here woo
      // download latestRelease.assets[:].browser_download_url
      let gatewayUrl = null;
      let nodeModulesUrl = null;
      const validAssetRe = new RegExp(
        `/download/${releaseVer}/[a-z0-9_-]+.tar.gz$`);
      for (const asset of latestRelease.assets) {
        if (!asset.browser_download_url.match(validAssetRe)) {
          continue;
        }
        if (asset.name.match(/^gateway-[a-f0-9]+\.tar\.gz$/)) {
          gatewayUrl = asset.browser_download_url;
        }
        if (asset.name.match(/^node_modules-[a-f0-9]+\.tar\.gz$/)) {
          nodeModulesUrl = asset.browser_download_url;
        }
      }

      if (nodeModulesUrl && gatewayUrl) {
        exec(`./gateway/tools/upgrade.sh ${gatewayUrl} ${nodeModulesUrl}`,
             {cwd: '..'},
             (err, stdout, stderr) => {
               if (err) {
                 console.error('Upgrade failed', err, stdout, stderr);
               } else {
                 console.log('Upgrade succeeded');
               }
             });
      } else {
        console.warn(`Release ${releaseVer} does not include archives`,
                     latestRelease.assets);
      }
    } else {
      console.log(`Our version ${currentVer} >= ${releaseVer}, exiting`);
    }
  });
