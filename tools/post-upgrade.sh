#!/bin/bash

# Performs any necessary steps after the main upgrade process is complete.

NODE_VERSION="--lts"
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}
# always use most recent version (lts)
nvm alias default node

# Upgrade gateway-addon Python package
_url="git+https://github.com/mozilla-iot/gateway-addon-python#egg=gateway_addon"
sudo pip2 install -U "$_url"
sudo pip3 install -U "$_url"
