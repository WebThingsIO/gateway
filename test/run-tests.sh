#!/bin/sh -e

SCRIPTDIR="$(dirname ""$0"")"

if [ ! -f "certificate.pem" ]; then
  ${SCRIPTDIR}/../tools/make-self-signed-cert.sh
fi

mocha $(find ${SCRIPTDIR} -name '*-test.js')
