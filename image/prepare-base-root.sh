#!/bin/bash -e

NVM_VERSION="v0.33.8"
NODE_VERSION="--lts=carbon"

# first we install nvm
cd $HOME
curl -o- https://raw.githubusercontent.com/creationix/nvm/${NVM_VERSION}/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}

# Allow node and python3 to use the Bluetooth adapter
setcap cap_net_raw+eip $(eval readlink -f `which node`)
setcap cap_net_raw+eip $(eval readlink -f `which python3`)

# disable hostapd and dnsmasq auto start
systemctl disable hostapd.service
systemctl disable dnsmasq.service

# install hostapd and dnsmasq config files
cp ~pi/config-wifi/hostapd.conf /etc/hostapd/hostapd.conf
cp ~pi/config-wifi/dnsmasq.conf /etc/dnsmasq.conf
echo 'DAEMON_CONF="/etc/hostapd/hostapd.conf"' >> /etc/default/hostapd
