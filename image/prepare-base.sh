#!/bin/bash -e
#
# This script is expected to be run on the Raspberry Pi and it is
# used to prepare the base image used for the gateway.
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# The base image (tested with 2017-04-10-raspbian-jessie-lite.img)
# will be fairly out of date, so we update all of the packages.
#
# Many packages, like git, won't work unless this step is done.
#
# To use this script, create an sd card with the raspbian image
# and copy this script into /home/pi.
#
# You then need to login to the RPi (probably using the serial console)
# and execute this script under the pi user.
#
# See this wiki article:
# https://github.com/mozilla-iot/wiki/wiki/Creating-the-base-image-file-for-the-Raspberry-Pi
# for complete instructions on creating a base image.

NVM_VERSION="v0.33.8"
NODE_VERSION="--lts=carbon"

sudo apt update -y
sudo apt upgrade -y
sudo apt update -y

# Install and configure nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/${NVM_VERSION}/install.sh | bash
# The following 2 lines are installed into ~/.bashrc by the above,
# but on the RPi, sourcing ~/.bashrc winds up being a no-op (when sourced
# from a script), so we just run it here.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}

# Install prerequisite packages
sudo apt install -y \
  arping \
  autoconf \
  dnsmasq \
  ffmpeg \
  git \
  hostapd \
  libboost-python-dev \
  libboost-thread-dev \
  libbluetooth-dev \
  libffi-dev \
  libglib2.0-dev \
  libnanomsg-dev \
  libnanomsg5 \
  libtool \
  libudev-dev \
  libusb-1.0-0-dev \
  mosquitto \
  policykit-1 \
  python-pip \
  python3-pip \
  sqlite3

# Install Python add-on bindings
_url="git+https://github.com/mozilla-iot/gateway-addon-python@v0.10.0#egg=gateway_addon"
sudo pip3 install "$_url"

_url="git+https://github.com/mycroftai/adapt#egg=adapt-parser"
sudo pip3 install "$_url"

# Allow node and python3 to use the Bluetooth adapter
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
sudo setcap cap_net_raw+eip $(eval readlink -f `which python3`)

git clone https://github.com/mozilla-iot/intent-parser "$HOME/mozilla-iot/intent-parser"

# Create the service files needed by systemd
sudo chown -R root:root ./etc
sudo cp -r ./etc /

# disable hostapd and dnsmasq auto start
sudo systemctl unmask hostapd.service
sudo systemctl disable hostapd.service
sudo systemctl disable dnsmasq.service

# Enable the gateway service so that it starts up automatically on each boot
sudo systemctl enable mozilla-iot-gateway.service

# Check for an update every day.
sudo systemctl enable mozilla-iot-gateway.check-for-update.timer

# Enable the intent parser at boot
sudo systemctl enable mozilla-iot-gateway.intent-parser.service

# Activate the iptables script so that it runs on each boot.
#
# NOTE: Do NOT be tempted to merge this with the systemctl stuff.
#       There are 2 reasons for this. The first is that run-app.sh
#       runs as the pi user, and the second is that we really only
#       want the iptables commands to be run once per boot. If you
#       want to run it a second time, then you need to detect that
#       you've previously installed some rules and uninstall them
#       before trying to install them again. With systemctl a user
#       could stop and restart the gateway and if this was merged
#       with run-app.sh then you'd be installing the rules a second
#       time.
sudo update-rc.d gateway-iptables defaults

# Clean up the preparation script and config files.
sudo rm -rf /home/pi/prepare-base.sh /home/pi/etc

echo "Done"
