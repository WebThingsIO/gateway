#!/bin/bash

# Performs any necessary steps after the main upgrade process is complete.

export NVM_DIR=${HOME}/.nvm
\. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use
nvm alias default node

sudo apt update -y

_all_deps="ffmpeg mosquitto arping wiringpi python-six"
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
_url="git+https://github.com/WebThingsIO/gateway-addon-python@v0.12.0#egg=gateway_addon"
sudo pip3 install -U "$_url"

# Uninstall py2 version of gateway-addon, if present
sudo pip2 uninstall -y gateway_addon || true

# Uninstall adapt-parser, if present
sudo pip3 uninstall -y adapt-parser || true

sudo systemctl enable mozilla-iot-gateway.service
sudo systemctl disable mozilla-gateway-wifi-setup.service || true
sudo systemctl disable mozilla-iot-gateway.renew-certificates.timer || true

if sudo test -e "/root/gateway-wifi-setup/wifiskip"; then
  touch "$HOME/.mozilla-iot/config/wifiskip"
fi

rm -rf "$HOME/mozilla-iot/intent-parser"
sudo systemctl disable mozilla-iot-gateway.intent-parser.service || true

# if the node version changed, we need to update add-ons
if [[ ! -f "$HOME/mozilla-iot/gateway_old/.nvmrc" ||
      $(sha256sum "$HOME/mozilla-iot/gateway_old/.nvmrc") != $(sha256sum "$HOME/mozilla-iot/gateway/.nvmrc") ]]; then
  cd "$HOME/mozilla-iot/gateway"
  ./tools/update-addons.sh
  cd -
fi

cd "$HOME/mozilla-iot/gateway/node_modules/gateway-addon"
npm link
cd -

touch .post_upgrade_complete
