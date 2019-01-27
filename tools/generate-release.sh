#!/bin/bash

# Generates release archives based on the current Gateway revision

# Expects to be run in the Gateway directory and has the potential for errors
# if package.json has uncommitted changes.

if [ ! -e "package.json" ]; then
  echo "Usage: ./tools/generate-release.sh"
  echo "Error: missing package.json"
  exit 1
fi

npm install -g yarn

git init .
git config user.email "temporary@example.com"
git config user.name "Temporary"
git add .
git commit -m "Temporary"
git clone ./ gateway
cd gateway || exit
rm -fr .git
cp -r ../node_modules ./
yarn
./node_modules/.bin/webpack
rm -fr ./node_modules
cd .. || exit
tar czf gateway.tar.gz gateway
rm -fr gateway
./tools/create-release-archives.sh
