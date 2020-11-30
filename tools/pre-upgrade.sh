#!/bin/bash

# Performs any necessary steps before the main upgrade process is complete.

# Load nvm
export NVM_DIR=${HOME}/.nvm
\. "$NVM_DIR/nvm.sh"

# Rename the base directory
if [[ -d "$HOME/mozilla-iot" && ! -e "$HOME/webthings" ]]; then
  ln -sf "$HOME/mozilla-iot" "$HOME/webthings"
fi

# Install and use the version of node specified in .nvmrc
nvm install
nvm use
nvm alias default node
nvm install-latest-npm

# Clean up the nvm cache to free some space
nvm cache clear

# Allow node and python3 to use the Bluetooth adapter
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
sudo setcap cap_net_raw+eip $(eval readlink -f `which python3`)

# Copy any new system config files
sudo chown -R root:root image/stage3/02-systemd-units/files/etc
sudo cp -r image/stage3/02-systemd-units/files/etc /
sudo chown -R $(id -u):$(id -g) image/stage3/02-systemd-units/files/etc
