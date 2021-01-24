#!/bin/bash -e

SCRIPTDIR="$(dirname ""$0"")"

# make sure we have test certificates
WEBTHINGS_HOME="${WEBTHINGS_HOME:=${HOME}/.webthings}"
WEBTHINGS_TEST_HOME="${WEBTHINGS_HOME}/test"
if [ ! -f "${WEBTHINGS_TEST_HOME}/ssl/certificate.pem" ]; then
  WEBTHINGS_HOME="${WEBTHINGS_TEST_HOME}" ${SCRIPTDIR}/../../tools/make-self-signed-cert.sh
fi
