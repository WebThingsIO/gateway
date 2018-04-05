#!/bin/bash

# Performs an upgrade given the urls to the content-addressed archives. Expects
# to be run in the ~/mozilla-iot directory

gateway_archive_url=$1
node_modules_archive_url=$2

if [ -z $gateway_archive_url ] || [ -z $node_modules_archive_url ]; then
  echo "Usage: ./gateway/tools/upgrade.sh [gateway_archive_url] [node_modules_archive_url]"
  exit 1
fi

# bring down the gateway very early in the process so that it has time to
# asynchronously finalize
sudo systemctl stop mozilla-iot-gateway.service

wget $gateway_archive_url
wget $node_modules_archive_url

gateway_old=./gateway

# Copy all files from the current gateway to the upgraded gateway. This
# includes tunneltoken, notunnel, any certificates, db.sqlite3, and
# node_modules
cp -r $gateway_old /tmp/gateway
rm -fr /tmp/gateway/node_modules

die() {
  sudo systemctl start mozilla-iot-gateway.service
  rm -f gateway-*.tar.gz
  rm -f node_modules-*.tar.gz
  rm -fr /tmp/gateway
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

extractCAArchive gateway-*.tar.gz /tmp
extractCAArchive node_modules-*.tar.gz /tmp/gateway

rm -fr gateway_old

mv $gateway_old gateway_old
mv /tmp/gateway gateway
touch gateway_old/package.json

cd gateway
./tools/post-upgrade.sh

sudo systemctl start mozilla-iot-gateway.service
