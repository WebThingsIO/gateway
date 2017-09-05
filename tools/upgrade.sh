#!/bin/bash

gateway_archive_url=$1
node_modules_archive_url=$2
# wget $gateway_archive_url
# wget $node_modules_archive_url

pwd

gateway_old=./gateway
cp -r $gateway_old /tmp/gateway
rm -r /tmp/gateway/node_modules
$gateway_old/tools/extract-ca-archive.sh gateway-*.tar.gz /tmp
$gateway_old/tools/extract-ca-archive.sh ../node_modules-*.tar.gz /tmp/gateway
# TODO: will sudo ever prompt for password?
sudo systemctl stop mozilla-iot-gateway.service
mv $gateway_old gateway_old
mv /tmp/gateway gateway
sudo systemctl start mozilla-iot-gateway.service
