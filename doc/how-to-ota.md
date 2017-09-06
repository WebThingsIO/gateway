# How To Release a Gateway Update

1. Bump the [semantic version](http://semver.org/) in [package.json](https://github.com/mozilla-iot/gateway/blob/master/package.json)
2. Push the bump to master
3. Make a new clone of this repo *on a raspberry pi*
4. Archive this new clone as a tar.gz. For example, if you cloned it as
   "gateway", this command should do the trick: `tar czvf gateway.tar.gz
   gateway`
5. Run `yarn install` in the new clone
6. Move `gateway.tar.gz` into the clone
7. Run [tools/create-release-archives.sh](https://github.com/mozilla-iot/gateway/blob/master/tools/create-release-archives.sh), producing `gateway-<hash>.tar.gz`
   and `node_modules-<hash>.tar.gz`
8. Create a release using the version from step 1 as its tag name
9. Attach the release archive to this release
10. Publish the release when ready or save as a draft

# What Comes Next
1. Gateway's `cron` runs [tools/check-for-update.js](https://github.com/mozilla-iot/gateway/blob/master/tools/check-for-update.js)
2. This script notices the new release and runs [tools/upgrade.sh](https://github.com/mozilla-iot/gateway/blob/master/tools/upgrade.sh).
3. [tools/upgrade.sh](https://github.com/mozilla-iot/gateway/blob/master/tools/upgrade.sh) performs the upgrade process

# The Upgrade Process
1. Download and verify `gateway-<hash>.tar.gz`
   and `node_modules-<hash>.tar.gz`
4. Copy the current gateway into `/tmp/gateway_new`
5. Extract `gateway-<hash>.tar.gz` into `gateway_new`, overwriting any matching
   files
6. Replace `gateway_new/node_modules` with the new release's `node_modules`
7. Stop `mozilla-iot-gateway.service`
8. Move the current gateway to `gateway_old`
9. Move the new gateway to `gateway`
10. Start `mozilla-iot-gateway.service`

# Rolling Back
1. Move the current gateway to `gateway_failed`
2. Move the the old gateway to `gateway`

# Future Work
- Automate cloning and archiving a clean gateway
- Allow omitting `node_modules` from releases
- Create `postupgrade` script for future migrations and other fiddling
