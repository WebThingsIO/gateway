#!/bin/bash

gateway_archive_url=$1
node_modules_archive_url=$2
wget $gateway_archive_url
wget $node_modules_archive_url

gateway_old=./gateway
cp -r $gateway_old /tmp/gateway
if [ -d "/tmp/gateway/node_modules" ]; then
	rm -r /tmp/gateway/node_modules
fi

extractCAArchive() {
  file=$1
  target=$2
  digest=${file#*-}
  digest=${digest%.tar.gz}
  base_name=${file%-*}

  check_digest=$(openssl dgst -sha256 $base_name-$digest.tar.gz | awk '{print $2}')

  if [ "$digest" != "$check_digest" ]; then
    echo "Digest mismatch: $digest != $check_digest"
    exit -1
  fi

  tar xzf "$base_name-$digest.tar.gz" -C $target
}

extractCAArchive gateway-*.tar.gz /tmp
rm gateway-*.tar.gz
extractCAArchive node_modules-*.tar.gz /tmp/gateway
rm node_modules-*.tar.gz

sudo systemctl stop mozilla-iot-gateway.service

if [ -d "gateway_old" ]; then
  rm -fr gateway_old
fi

mv $gateway_old gateway_old
mv /tmp/gateway gateway
sudo systemctl start mozilla-iot-gateway.service
