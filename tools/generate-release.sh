#!/bin/bash

# Generates release archives based on the current Gateway revision

# Expects to be run in the Gateway directory and has the potential for errors
# if package.json has uncommitted changes.

if [ ! -e "package.json" ]; then
  echo "Usage: ./tools/generate-release.sh"
  echo "Error: missing package.json"
  exit 1
fi

yarn
git clone ./ gateway
tar czf gateway.tar.gz gateway
rm -fr gateway
./tools/create-release-archives.sh
