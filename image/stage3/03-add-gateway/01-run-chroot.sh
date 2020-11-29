#!/bin/bash -e

set -x

# Install Python add-on bindings
pip3 install -r "/home/${FIRST_USER_NAME}/webthings/gateway/requirements.txt"

su - ${FIRST_USER_NAME} << 'EOF'
set -e -x

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm

export npm_config_arch=armv6l
export npm_config_target_arch=arm

# build the gateway
cd ~/webthings/gateway
npm ci
./node_modules/.bin/webpack
npm prune --production

# link the gateway-addon library to make it global
cd ./node_modules/gateway-addon
npm link
cd ../..

# Create the .post_upgrade_complete file so that it doesn't try to upgrade on
# the first boot.
touch .post_upgrade_complete

GATEWAY_VERSION="$(node -e "console.log(require('./package.json').version)")"
PYTHON_VERSIONS="$(python2 --version 2>&1 | cut -d' ' -f2 | cut -d. -f1-2),$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d. -f1-2)"
V8_VERSION="$(node -e 'console.log(process.config.variables.node_module_version)')"
ARCHITECTURE="linux-arm"
ADDON_LIST_URL="$(node -e "console.log(require('config').get('addonManager.listUrls')[0])")"
ADDONS_DIR="$HOME/.webthings/addons"

# Install default add-ons
mkdir -p "${ADDONS_DIR}"
params="?arch=${ARCHITECTURE}&node=${V8_VERSION}&python=${PYTHON_VERSIONS}&version=${GATEWAY_VERSION}"
addon_list=$(curl "${ADDON_LIST_URL}${params}")
tempdir=$(mktemp -d)
zigbee_url=$(echo "${addon_list}" | python3 -c "import json, sys; l = json.loads(sys.stdin.read()); print([p['url'] for p in l if p['id'] == 'zigbee-adapter'][0]);")
curl -L -o "${tempdir}/zigbee-adapter.tgz" "${zigbee_url}"
tar xzf "${tempdir}/zigbee-adapter.tgz" -C "${ADDONS_DIR}"
mv "${ADDONS_DIR}/package" "${ADDONS_DIR}/zigbee-adapter"
zwave_url=$(echo "${addon_list}" | python3 -c "import json, sys; l = json.loads(sys.stdin.read()); print([p['url'] for p in l if p['id'] == 'zwave-adapter'][0]);")
curl -L -o "${tempdir}/zwave-adapter.tgz" "${zwave_url}"
tar xzf "${tempdir}/zwave-adapter.tgz" -C "${ADDONS_DIR}"
mv "${ADDONS_DIR}/package" "${ADDONS_DIR}/zwave-adapter"
thing_url=$(echo "${addon_list}" | python3 -c "import json, sys; l = json.loads(sys.stdin.read()); print([p['url'] for p in l if p['id'] == 'thing-url-adapter'][0]);")
curl -L -o "${tempdir}/thing-url-adapter.tgz" "${thing_url}"
tar xzf "${tempdir}/thing-url-adapter.tgz" -C "${ADDONS_DIR}"
mv "${ADDONS_DIR}/package" "${ADDONS_DIR}/thing-url-adapter"
rm -rf "${tempdir}"
EOF
