#!/bin/sh

SCRIPTDIR="$(dirname ""$0"")"

${SCRIPTDIR}/lint-all.sh

if [ ! -f "certificate.pem" ]; then
  ${SCRIPTDIR}/../tools/make-self-signed-cert.sh
fi
mocha
