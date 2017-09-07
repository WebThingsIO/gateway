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

$gateway_old/tools/extract-ca-archive.sh gateway-*.tar.gz /tmp
rm gateway-*.tar.gz
$gateway_old/tools/extract-ca-archive.sh node_modules-*.tar.gz /tmp/gateway
rm node_modules-*.tar.gz

sudo systemctl stop mozilla-iot-gateway.service

if [ -d "gateway_old" ]; then
  rm -fr gateway_old
fi

mv $gateway_old gateway_old
mv /tmp/gateway gateway
sudo systemctl start mozilla-iot-gateway.service
