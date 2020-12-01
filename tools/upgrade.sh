#!/bin/bash

# Performs an upgrade given the urls to the content-addressed archives. Expects
# to be run in the ~/webthings directory

gateway_archive_url=$1
node_modules_archive_url=$2

if [ -z $gateway_archive_url ] || [ -z $node_modules_archive_url ]; then
  echo "Usage: ./gateway/tools/upgrade.sh [gateway_archive_url] [node_modules_archive_url]"
  exit 1
fi

# Bail out
die() {
  if [ -f /etc/systemd/system/webthings-gateway.service ]; then
    sudo systemctl start webthings-gateway.service
  else
    sudo systemctl start mozilla-iot-gateway.service
  fi
  rm -f gateway-*.tar.gz
  rm -f node_modules-*.tar.gz
  exit -1
}

# Extract an archive
extractCAArchive() {
  file=$1
  target=$2
  digest=${file#*-}
  digest=${digest%.tar.gz}
  base_name=${file%-*}
  archive_name=$base_name-$digest.tar.gz

  check_digest=$(openssl dgst -sha256 $archive_name | awk '{print $2}')

  if [ "$digest" != "$check_digest" ]; then
    echo "Digest mismatch: $digest != $check_digest"
    die
  fi

  if ! tar xzf $archive_name -C $target; then
    echo "Archive extraction failed"
    die
  fi
  rm $archive_name
}

# Download the gateway and node_modules archives
wget $gateway_archive_url
wget $node_modules_archive_url

# Extract the gateway and node_modules
extractCAArchive gateway-*.tar.gz /tmp
extractCAArchive node_modules-*.tar.gz /tmp/gateway

# Run the pre-upgrade script
pushd /tmp/gateway
./tools/pre-upgrade.sh
popd

# Bring down the gateway very late in the process since it'll probably be fine
sudo systemctl stop webthings-gateway.service || true
sudo systemctl stop mozilla-iot-gateway.service || true

# Back up the current gateway
rm -rf gateway_old
mv gateway gateway_old
touch gateway_old/package.json
mv /tmp/gateway gateway

# Back up the user profile
if [ -d "$HOME/.webthings" ]; then
  rm -rf "$HOME/.webthings.old" "$HOME/.mozilla-iot.old"
  cp -a "$HOME/.webthings" "$HOME/.webthings.old"
elif [ -d "$HOME/.mozilla-iot" ]; then
  rm -rf "$HOME/.webthings.old" "$HOME/.mozilla-iot.old"
  cp -a "$HOME/.mozilla-iot" "$HOME/.mozilla-iot.old"
  mv "$HOME/.mozilla-iot" "$HOME/.webthings"
fi

# Run the post-upgrade script
pushd gateway
./tools/post-upgrade.sh
popd

# Start the gateway back up
sudo systemctl start webthings-gateway.service
