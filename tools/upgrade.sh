#!/bin/bash

# Performs an upgrade given the urls to the content-addressed archives. Expects
# to be run in the ~/mozilla-iot directory

gateway_archive_url=$1
node_modules_archive_url=$2

if [ -z $gateway_archive_url ] || [ -z $node_modules_archive_url ]; then
  echo "Usage: ./gateway/tools/upgrade.sh [gateway_archive_url] [node_modules_archive_url]"
  exit 1
fi

die() {
  sudo systemctl start mozilla-iot-gateway.service
  rm -f gateway-*.tar.gz
  rm -f node_modules-*.tar.gz
  exit -1
}


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

wget $gateway_archive_url
wget $node_modules_archive_url

extractCAArchive gateway-*.tar.gz /tmp
extractCAArchive node_modules-*.tar.gz /tmp/gateway

pushd /tmp/gateway
./tools/pre-upgrade.sh
popd

# bring down the gateway very late in the process since it'll probably be fine
sudo systemctl stop mozilla-iot-gateway.service

rm -fr gateway_old
mv gateway gateway_old
touch gateway_old/package.json
mv /tmp/gateway gateway

pushd gateway
./tools/post-upgrade.sh
popd

sudo systemctl start mozilla-iot-gateway.service
