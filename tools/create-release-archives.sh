#!/bin/bash

# TODO: requires gateway.tar.gz to already exist

createCAArchive() {
  base_name=$1
  digest=$(openssl dgst -sha256 $base_name.tar.gz | awk '{print $2}')
  mv $base_name.tar.gz $base_name-$digest.tar.gz
}

tar czf node_modules.tar.gz node_modules
createCAArchive node_modules
createCAArchive gateway

