#!/bin/bash

# Performs any necessary steps after the main upgrade process is complete.

# Install ffmpeg, if necessary
if ! dpkg -s ffmpeg 2>/dev/null | grep -q '^Status.*installed'; then
  sudo apt update -y
  sudo apt install -y ffmpeg
fi

# Install thing-url-adapter
addons_dir=${HOME}/.mozilla-iot/addons
if [ ! -d "${addons_dir}/thing-url-adapter" ]; then
  mkdir -p "${addons_dir}"
  addon_list=$(curl "https://raw.githubusercontent.com/mozilla-iot/addon-list/master/list.json")
  tempdir=$(mktemp -d)
  thing_url=$(echo "${addon_list}" | python3 -c \
    "import json, sys; \
    l = json.loads(sys.stdin.read()); \
    print([x['packages'] for x in l if x['name'] == 'thing-url-adapter'][0]['linux-arm']['url']);")
  curl -L -o "${tempdir}/thing-url-adapter.tgz" "${thing_url}"
  tar xzf "${tempdir}/thing-url-adapter.tgz" -C "${addons_dir}"
  mv "${addons_dir}/package" "${addons_dir}/thing-url-adapter"
  rm -rf "${tempdir}"
fi

sudo systemctl enable mozilla-iot-gateway.service
sudo systemctl disable mozilla-gateway-wifi-setup.service || true
sudo systemctl disable mozilla-iot-gateway.renew-certificates.timer || true

if sudo test -e "/root/gateway-wifi-setup/wifiskip"; then
  touch "$HOME/.mozilla-iot/config/wifiskip"
fi

(cd "$HOME/mozilla-iot/intent-parser"; git pull)
sudo systemctl restart mozilla-iot-gateway.intent-parser.service

touch .post_upgrade_complete
