const fetch = require('node-fetch');
const fs = require('fs');
const semver = require('semver');

const exec = require('child_process').exec;

let pkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf-8'}));

fetch('https://api.github.com/repos/hobinjk/gateway/releases').then(res => {
  return res.json();
}).then(releases => {
  // Assumes that releases are in chronological order, latest-first
  return releases.filter(release => {
    return !release.prerelease && !release.draft;
  })[0];
}).then(latestRelease => {
  if (!latestRelease) {
    console.error('No releases found');
    return;
  }
  let releaseVer = latestRelease.tag_name;
  let currentVer = pkg.version;
  if (semver.lt(currentVer, releaseVer)) {
    // do upgrade here woo
    // download latestRelease.assets[:].browser_download_url
    let gatewayUrl = null;
    let nodeModulesUrl = null;
    let validAssetRe = new RegExp('^https://github.com/hobinjk/gateway/releases/download/' + releaseVer + '/[a-z0-9_-]+.tar.gz$');
    for (let asset of latestRelease.assets) {
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
      return new Promise(function(resolve, reject) {
        exec(`./gateway/tools/upgrade.sh ${gatewayUrl} ${nodeModulesUrl}`, {cwd: '..'}, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } else {
      console.warn(`Release ${releaseVer} does not include archives`, latestRelease.assets);
    }
  } else {
    console.log(`Our version ${currentVer} >= ${releaseVer}, exiting`);
  }
});
