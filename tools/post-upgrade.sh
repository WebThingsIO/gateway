#!/bin/bash -e

# Performs any necessary steps after the main upgrade process is complete.

# For some reason NVM_DIR isn't set at this point
export NVM_DIR=/home/pi/.nvm
\. "$NVM_DIR/nvm.sh"  # This loads nvm
NODE_VERSION="--lts=carbon"
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}
# always use most recent version (lts)
nvm alias default node

# Allow node and python3 to use the Bluetooth adapter
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
sudo setcap cap_net_raw+eip $(eval readlink -f `which python3`)

# Upgrade gateway-addon Python package
_url="git+https://github.com/mozilla-iot/gateway-addon-python#egg=gateway_addon"
sudo pip2 install -U "$_url"
sudo pip3 install -U "$_url"

# Install thing-url-adapter
addons_dir=/home/pi/.mozilla-iot/addons
if [ ! -d "${addons_dir}/thing-url-adapter" ]; then
  mkdir -p "${addons_dir}"
  addon_list=$(curl "https://raw.githubusercontent.com/mozilla-iot/addon-list/master/list.json")
  tempdir=$(mktemp -d)
  thing_url=$(echo "${addon_list}" | python3 -c \
    "import json, sys; \
    l = json.loads(sys.stdin.read()); \
    print([x['packages'] for x in l if x['name'] == 'thing-url-adapter'][0]['linux-arm']['url']);")
  curl -L -o "${tempdir}/thing-url-adapter.tgz" "${thing_url}"
  tar xzf "${tempdir}/thing-url-adapter.tgz" -C "${addons_dir}"
  mv "${addons_dir}/package" "${addons_dir}/thing-url-adapter"
  rm -rf "${tempdir}"
fi

touch .post_upgrade_complete
