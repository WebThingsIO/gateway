#!/bin/sh -e

SCRIPTDIR="$(dirname ""$0"")"

MOZIOT_HOME="${MOZIOT_HOME:=${HOME}/.mozilla-iot}"
if [ ! -f "${MOZIOT_HOME}/ssl/certificate.pem" ]; then
  ${SCRIPTDIR}/../../tools/make-self-signed-cert.sh
fi

jest --runInBand "$@"
