#!/bin/bash

set -e

_gateway_version=$(grep '"version"' ../package.json | cut -d: -f2 | cut -d\" -f2)
_gateway_addon_python_version=$(egrep -o '[0-9][0-9.]+' ../requirements.txt)
_gateway_addon_python_url="https://github.com/WebThingsIO/gateway-addon-python"

# Clean up
rm -rf webthings-gateway

# Copy the gateway
tar --exclude='../deb' --exclude='../.git' -cf gateway.tar ..
mkdir webthings-gateway
tar -C webthings-gateway -xf gateway.tar
rm gateway.tar

# Pull down the gateway-addon Python library
git clone "${_gateway_addon_python_url}" webthings-gateway/gateway-addon-python
cd webthings-gateway/gateway-addon-python
git checkout "v${_gateway_addon_python_version}"
cd -

# Package everything up
tar czf "webthings-gateway_${_gateway_version}.orig.tar.gz" webthings-gateway
rm -rf webthings-gateway
