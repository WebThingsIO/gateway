#!/bin/bash -e

NVM_VERSION="v0.33.8"
NODE_VERSION="--lts"

# first we install nvm
cd $HOME
curl -o- https://raw.githubusercontent.com/creationix/nvm/${NVM_VERSION}/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}

# download and install the code
wget https://github.com/mozilla-iot/gateway-wifi-setup/archive/master.zip
unzip master.zip -d .
rm master.zip
mv gateway-wifi-setup-master/ gateway-wifi-setup/
cd gateway-wifi-setup/
npm install
chmod +x run.sh

# install and enable the systemd service
cp config/mozilla-gateway-wifi-setup.service /etc/systemd/system/mozilla-gateway-wifi-setup.service
systemctl enable mozilla-gateway-wifi-setup.service

# disable hostapd and dnsmasq auto start
systemctl disable hostapd.service
systemctl disable dnsmasq.service

# install hostapd and dnsmasq config files 
cp config/hostapd.conf /etc/hostapd/hostapd.conf
cp config/dnsmasq.conf /etc/dnsmasq.conf
sudo sh -c 'cat >> /etc/default/hostapd' << END
DAEMON_CONF="/etc/hostapd/hostapd.conf"
END
