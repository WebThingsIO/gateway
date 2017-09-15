#!/bin/bash

# Creates the gateway-<hash>,tar.gz and node_modules-<hash>.tar.gz archives
# which are then uploaded to the GitHub release

if [ ! -d "node_modules" ] || [ ! -e "gateway.tar.gz" ]; then
  echo "gateway.tar.gz and node_modules/ must be present. See https://github.com/mozilla-iot/gateway/blob/master/doc/how-to-ota.md for more information"
  exit 1
fi

makeContentAddressedArchive() {
  base_name=$1
  digest=$(openssl dgst -sha256 $base_name.tar.gz | awk '{print $2}')
  mv $base_name.tar.gz $base_name-$digest.tar.gz
}

tar czf node_modules.tar.gz node_modules
makeContentAddressedArchive node_modules
makeContentAddressedArchive gateway

