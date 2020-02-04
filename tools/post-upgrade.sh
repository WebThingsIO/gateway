#!/bin/bash

# Performs any necessary steps after the main upgrade process is complete.

sudo apt update -y

_all_deps="ffmpeg mosquitto arping wiringpi"
_missing_deps=""
for dep in $_all_deps; do
  if ! dpkg -s "$dep" 2>/dev/null | grep -q '^Status.*installed'; then
    _missing_deps="$_missing_deps $dep"
  fi
done

if [ -n "$_missing_deps" ]; then
  sudo apt install -y $_missing_deps
fi

# Upgrade gateway-addon Python package
_url="git+https://github.com/mozilla-iot/gateway-addon-python@v0.11.0#egg=gateway_addon"
sudo pip3 install -U "$_url"

# Uninstall py2 version of gateway-addon, if present
sudo pip2 uninstall -y gateway_addon || true

# Upgrade adapt-parser Python package
sudo pip3 install -U adapt-parser==0.3.4

sudo systemctl enable mozilla-iot-gateway.service
sudo systemctl disable mozilla-gateway-wifi-setup.service || true
sudo systemctl disable mozilla-iot-gateway.renew-certificates.timer || true

if sudo test -e "/root/gateway-wifi-setup/wifiskip"; then
  touch "$HOME/.mozilla-iot/config/wifiskip"
fi

(cd "$HOME/mozilla-iot/intent-parser"; git pull)
sudo systemctl restart mozilla-iot-gateway.intent-parser.service

touch .post_upgrade_complete
