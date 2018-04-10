#!/bin/bash

NVM_VERSION="v0.33.8"
NODE_VERSION="--lts"

cd /home/pi

# Update the base packages that come with the system. This is required
# so that we can install git

sudo apt update
sudo apt upgrade -y
sudo apt install git -y

mkdir -p mozilla-iot
cd mozilla-iot

# Install and configure nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/${NVM_VERSION}/install.sh | bash
# The following 2 lines are installed into ~/.bashrc by the above,
# but on the RPi, sourcing ~/.bashrc winds up being a no-op (when sourced
# from a script), so we just run it here.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}

# Download, build, and install OpenZWave
sudo apt install libusb-1.0-0-dev libudev-dev -y
if [ ! -d "open-zwave" ]; then
    git clone https://github.com/OpenZWave/open-zwave.git --depth 1
fi
cd open-zwave
make
sudo make install
sudo ldconfig /usr/local/lib

# Download and install the required node modules
cd ..
if [ ! -d "gateway" ]; then
    git clone https://github.com/moziot/gateway.git
fi
cd gateway
npm install .

# Setup systemctl so that the gateway will start at boot time
sudo cp systemd/system/mozilla-iot-gateway.service /etc/systemd/system
sudo systemctl enable mozilla-iot-gateway.service

sudo cp etc/init.d/gateway-iptables.sh /etc/init.d
sudo chmod +x /etc/init.d/gateway-iptables.sh
sudo update-rc.d gateway-iptables.sh defaults

# Create a self-signed cert. This is temporary (for development).
#if [ ! -f "certificate.pem" ]; then
#    ./tools/make-self-signed-cert.sh
#fi

echo "###################################################################"
echo "#"
echo "# Please reboot to properly activate NVM and the iptables rules."
echo "#"
echo "###################################################################"
