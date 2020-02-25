#!/bin/bash

# Performs any necessary steps before the main upgrade process is complete.

export NVM_DIR=${HOME}/.nvm
\. "$NVM_DIR/nvm.sh"  # This loads nvm

# Install and use the version of node specified in .nvmrc
nvm install
nvm use
nvm alias default node

# Clean up the nvm cache to free some space
nvm cache clear

# Allow node and python3 to use the Bluetooth adapter
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
sudo setcap cap_net_raw+eip $(eval readlink -f `which python3`)

sudo chown -R root:root "image/etc"
sudo cp -r "image/etc" /
sudo chown -R $(id -u):$(id -g) "image/etc"
