#!/bin/bash

# Update the base packages that come with the system. This is required
# so that we can install git

sudo apt update
sudo apt upgrade -y
sudo apt install git -y

mkdir mozilla-iot
cd mozilla-iot

# Install and configure nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
# The following 2 lines are installed into ~/.bashrc by the above,
# but on the RPi, sourcing ~/.bashrc winds up being a no-op (when sourced
# from a script), so we just run it here.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install v7.7.2
nvm use v7.7.2

# Download, build, and install OpenZWave
sudo apt install libusb-1.0-0-dev libudev-dev -y
git clone https://github.com/OpenZWave/open-zwave.git
cd open-zwave
make
sudo make install
sudo ldconfig /usr/local/lib

# Download and install the required node modules
cd ..
git clone https://github.com/moziot/gateway.git
cd gateway
npm install .

# Setup systemctl so that the gateway will start at boot time
sudo cp systemd/system/mozilla-iot-gateway.service /etc/systemd/system
sudo systemctl enable mozilla-iot-gateway.service

sudo cp gateway-iptables.sh /etc/init.d
sudo chmod +x /etc/init.d /etc/init.d/gateway-iptables.sh
sudo update-rc.d gateway-iptables.sh defaults

# Create a self-signed cert. This is temporary (for development).
./tools/make-self-signed-cert.sh

echo "###################################################################"
echo "#"
echo "# Please reboot to properly activate NVM and the iptables rules.
echo "#"
echo "###################################################################"
