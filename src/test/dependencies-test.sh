#!/bin/bash -e

# This script will fail if dependencies in package.json is insufficient to run gateway.

SCRIPT_DIR=$(cd $(dirname $0);pwd)
GATEWAY_DIR=${SCRIPT_DIR}/../../
TMP_DIR=/tmp/gateway-test
GATEWAY_SRC=./build/app.js
TEST_SRC=./build/test.js

# Setup temporary directory
rm -rf ${TMP_DIR}
cp -r ${GATEWAY_DIR} ${TMP_DIR}
cd ${TMP_DIR}

# install only production dependencies
npm prune --production

# Correct modules used by Gateway.
sed -n -e 's/^.*\(require([^)]*)\).*$/\1;/gp' ${GATEWAY_SRC} > ${TEST_SRC}
echo "process.exit(0);" >> ${TEST_SRC}

trap onError ERR
function onError() {
  echo "dependencies in package.json is insufficient"
  echo ""
  echo "Add lacking modules to dependencies"
}

# Check modules through require all modules.
node ${TEST_SRC}
