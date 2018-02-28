#!/bin/sh -e

SCRIPTDIR="$(dirname ""$0"")"

MOZIOT_HOME="${MOZIOT_HOME:=${HOME}/.mozilla-iot}"
MOZIOT_HOME="${MOZIOT_HOME}/test"
if [ ! -f "${MOZIOT_HOME}/ssl/certificate.pem" ]; then
  export MOZIOT_HOME
  ${SCRIPTDIR}/../../tools/make-self-signed-cert.sh
fi

jest --runInBand "$@"
