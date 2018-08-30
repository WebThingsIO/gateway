#!/bin/bash -e

# Performs any necessary steps before the main upgrade process is complete.

# For some reason NVM_DIR isn't set at this point
export NVM_DIR=${HOME}/.nvm
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

_url="git+https://github.com/mycroftai/adapt#egg=adapt-parser"
sudo pip3 install -U "$_url"
