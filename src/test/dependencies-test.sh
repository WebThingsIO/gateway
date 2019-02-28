#! /bin/bash -e

# This script will fail if dependencies in package.json is insufficient to run gateway.

SCRIPTDIR=$(cd $(dirname $0);pwd)
GATEWAYDIR=${SCRIPTDIR}/../../
TMPDIR=/tmp/gateway-test
GATEWAYSRC=${GATEWAYDIR}/build/gateway.js

# Setup tempolary directory
rm -rf ${TMPDIR}
mkdir -p ${TMPDIR}
cp ${GATEWAYDIR}/package.json ${TMPDIR}/
cd ${TMPDIR}

# install only production dependencies
npm install --production

# Correct modules used by Gateway.
REQUIRE_MODULES=$(cat ${GATEWAYSRC} | sed -n -e 's/^.*\(require([^)]*)\).*$/\1/gp')

trap onError ERR
function onError() {
  echo "dependencies in package.json is insufficient"
  echo ""
  echo "Add lacking modules to dependencies"
}

# Check modules through require all modules.
node -e "${REQUIRE_MODULES}"
