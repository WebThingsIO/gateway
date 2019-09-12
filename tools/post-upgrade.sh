#!/bin/bash

# Performs any necessary steps after the main upgrade process is complete.

sudo apt update -y

# Install ffmpeg, if necessary
if ! dpkg -s ffmpeg 2>/dev/null | grep -q '^Status.*installed'; then
  sudo apt install -y ffmpeg
fi

# Install mosquitto, if necessary
if ! dpkg -s mosquitto 2>/dev/null | grep -q '^Status.*installed'; then
  sudo apt install -y mosquitto
fi

# Upgrade gateway-addon Python package
_url="git+https://github.com/mozilla-iot/gateway-addon-python@v0.9.0#egg=gateway_addon"
sudo pip2 install -U "$_url"
sudo pip3 install -U "$_url"

# Upgrade adapt-parser Python package
_url="git+https://github.com/mycroftai/adapt#egg=adapt-parser"
sudo pip3 install -U "$_url"

sudo systemctl enable mozilla-iot-gateway.service
sudo systemctl disable mozilla-gateway-wifi-setup.service || true
sudo systemctl disable mozilla-iot-gateway.renew-certificates.timer || true

if sudo test -e "/root/gateway-wifi-setup/wifiskip"; then
  touch "$HOME/.mozilla-iot/config/wifiskip"
fi

(cd "$HOME/mozilla-iot/intent-parser"; git pull)
sudo systemctl restart mozilla-iot-gateway.intent-parser.service

touch .post_upgrade_complete
