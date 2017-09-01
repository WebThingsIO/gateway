const fetch = require('node-fetch');
const fs = require('fs');
const semver = require('semver');
const util = require('util');

const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

let pkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf-8'}));

fetch('https://api.github.com/repos/mozilla-iot/gateway/releases').then(res => {
  return res.json();
}).then(releases => {
  // Assumes that releases are in chronological order, latest-first
  return releases.filter(release => {
    return !release.prerelease && !release.draft;
  })[0];
}).then(latestRelease => {
  let releaseVer = latestRelease.tag_name;
  let currentVer = pkg.version;
  if (semver.lt(currentVer, releaseVer)) {
    // do upgrade here woo
    // download latestRelease.assets[:].browser_download_url
    let gatewayUrl = null;
    let nodeModulesUrl = null;
    for (let asset of latestRelease.assets) {
      if (asset.name.match(/^gateway-[a-f0-9]\.tar\.gz$/)) {
        gatewayUrl = asset.browser_download_url;
      }
      if (asset.name.match(/^node_modules-[a-f0-9]\.tar\.gz$/)) {
        nodeModulesUrl = asset.browser_download_url;
      }
    }

    if (nodeModulesUrl && gatewayUrl) {
      return exec(`./tools/upgrade.sh ${gatewayUrl} ${nodeModulesUrl}`)
    } else {
      console.warn(`Release ${latestRelease} does not include archives`);
    }
  } else {
    console.log(`Our version ${currentVer} >= ${releaseVer}, exiting`);
  }
});
