#!/bin/bash

# Performs any necessary steps after the main upgrade process is complete.

# Load nvm
export NVM_DIR=${HOME}/.nvm
\. "$NVM_DIR/nvm.sh"
nvm use
nvm alias default node

# Check for and install any missing system dependencies
_all_deps="ffmpeg mosquitto arping wiringpi python-six"
_missing_deps=""
for dep in $_all_deps; do
  if ! dpkg -s "$dep" 2>/dev/null | grep -q '^Status.*installed'; then
    _missing_deps="$_missing_deps $dep"
  fi
done

if [ -n "$_missing_deps" ]; then
  sudo apt update -y
  sudo apt install -y $_missing_deps
fi

# Upgrade gateway-addon Python package
sudo pip3 install -U -r "$HOME/webthings/gateway/requirements.txt"

# Uninstall py2 version of gateway-addon, if present
sudo pip2 uninstall -y gateway_addon || true

# Uninstall adapt-parser, if present
sudo pip3 uninstall -y adapt-parser || true

# Disable old system services
sudo systemctl disable mozilla-iot-gateway.service || true
# mozilla-iot-gateway.service is already stopped
sudo systemctl disable mozilla-iot-gateway.check-for-update.timer || true
sudo systemctl stop mozilla-iot-gateway.check-for-update.timer || true
sudo systemctl disable mozilla-gateway-wifi-setup.service || true
sudo systemctl stop mozilla-gateway-wifi-setup.service || true
sudo systemctl disable mozilla-iot-gateway.renew-certificates.timer || true
sudo systemctl stop mozilla-iot-gateway.renew-certificates.timer || true
sudo systemctl disable mozilla-iot-gateway.intent-parser.service || true
sudo systemctl stop mozilla-iot-gateway.intent-parser.service || true

# Enable new system services
sudo systemctl enable webthings-gateway.service
# webthings-gateway.service will be started by upgrade.sh
sudo systemctl enable webthings-gateway.check-for-update.timer
sudo systemctl start webthings-gateway.check-for-update.timer

# Handle legacy wifiskip file
if sudo test -e "/root/gateway-wifi-setup/wifiskip"; then
  if [ -d "$HOME/.webthings" ]; then
    touch "$HOME/.webthings/config/wifiskip"
  elif [ -d "$HOME/.mozilla-iot" ]; then
    touch "$HOME/.mozilla-iot/config/wifiskip"
  fi
fi

# Remove old intent parser
rm -rf "$HOME/webthings/intent-parser"

# If the node version changed, and we have a user profile, we need to update
# add-ons
if [ -d "$HOME/.webthings" ]; then
  if [[ ! -f "$HOME/webthings/gateway_old/.nvmrc" ||
        $(sha256sum "$HOME/webthings/gateway_old/.nvmrc") != $(sha256sum "$HOME/webthings/gateway/.nvmrc") ]]; then
    cd "$HOME/webthings/gateway"
    ./tools/update-addons.sh
    cd -
  fi
fi

# Link the gateway-addon module globally
cd "$HOME/webthings/gateway/node_modules/gateway-addon"
npm link
cd -

# Finished
touch .post_upgrade_complete
