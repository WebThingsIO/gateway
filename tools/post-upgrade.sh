#!/bin/bash

# Performs any necessary steps after the main upgrade process is complete.

# For some reason NVM_DIR isn't set at this point
export NVM_DIR=/home/pi/.nvm
\. "$NVM_DIR/nvm.sh"  # This loads nvm
NODE_VERSION="--lts"
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}
# always use most recent version (lts)
nvm alias default node

# Allow node to use the Bluetooth adapter
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)

# Upgrade gateway-addon Python package
_url="git+https://github.com/mozilla-iot/gateway-addon-python#egg=gateway_addon"
sudo pip2 install -U "$_url"
sudo pip3 install -U "$_url"

touch .post_upgrade_complete
