#!/bin/bash

# first we install nvm
cd $HOME
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install v7.10.1
nvm use v7.10.1

# download and install the code
wget https://github.com/mozilla-iot/gateway-wifi-setup/archive/master.zip
unzip master.zip -d .
mv gateway-wifi-setup-master/ gateway-wifi-setup/
cd gateway-wifi-setup/
npm install
chmod +x run.sh

# and install the systemd service
cp config/mozilla-gateway-wifi-setup.service /etc/systemd/system/mozilla-gateway-wifi-setup.service
sudo systemctl enable mozilla-gateway-wifi-setup.service
