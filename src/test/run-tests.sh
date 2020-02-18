#!/bin/bash -e

SCRIPTDIR="$(dirname ""$0"")"

MOZIOT_HOME="${MOZIOT_HOME:=${HOME}/.mozilla-iot}"
MOZIOT_TEST_HOME="${MOZIOT_HOME}/test"
if [ ! -f "${MOZIOT_TEST_HOME}/ssl/certificate.pem" ]; then
  MOZIOT_HOME="${MOZIOT_TEST_HOME}" ${SCRIPTDIR}/../../tools/make-self-signed-cert.sh
fi

# cleanup the previous outputs
rm -rf "${SCRIPTDIR}/../../browser-test-output"
rm -rf "${SCRIPTDIR}/../../browser-test-diff"

# Run the tests
NODE_TLS_REJECT_UNAUTHORIZED=0 "${SCRIPTDIR}/../../node_modules/.bin/jest" --runInBand --detectOpenHandles "$@"
