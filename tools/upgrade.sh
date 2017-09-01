#!/bin/bash

gateway_archive_url=$1
node_modules_archive_url=$2
wget $gateway_archive_url
wget $node_modules_archive_url
./tools/extract-release.sh ./gateway-*.tar.gz ./node_modules-*.tar.gz
