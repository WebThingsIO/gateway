#!/bin/bash -e

SCRIPTDIR="$(dirname ""$0"")"

WEBTHINGS_HOME="${WEBTHINGS_HOME:=${HOME}/.webthings}"
WEBTHINGS_TEST_HOME="${WEBTHINGS_HOME}/test"
if [ ! -f "${WEBTHINGS_TEST_HOME}/ssl/certificate.pem" ]; then
  WEBTHINGS_HOME="${WEBTHINGS_TEST_HOME}" ${SCRIPTDIR}/../../tools/make-self-signed-cert.sh
fi

# cleanup the previous outputs
rm -rf "${SCRIPTDIR}/../../browser-test-output"
rm -rf "${SCRIPTDIR}/../../browser-test-diff"

# Run the tests
NODE_TLS_REJECT_UNAUTHORIZED=0 "${SCRIPTDIR}/../../node_modules/.bin/jest" --runInBand --detectOpenHandles "$@"
