#!/bin/sh -e

SCRIPTDIR="$(dirname ""$0"")"

MOZIOT_HOME="${MOZIOT_HOME:=${HOME}/.mozilla-iot}"
MOZIOT_TEST_HOME="${MOZIOT_HOME}/test"
if [ ! -f "${MOZIOT_TEST_HOME}/ssl/certificate.pem" ]; then
  MOZIOT_HOME="${MOZIOT_TEST_HOME}" ${SCRIPTDIR}/../../tools/make-self-signed-cert.sh
fi

# Check to see if the adapt module is installed
if ! python -c 'import adapt'; then
  pip install --user git+https://github.com/mycroftai/adapt#egg=adapt-parser
fi

# install or update the intent parser
(
  cd ${MOZIOT_TEST_HOME};
  if [ -d intent-parser ]; then
    cd intent-parser
    git pull
  else
    git clone https://github.com/mozilla-iot/intent-parser
  fi
)

# cleanup code to kill the intent parser when this script exits
function cleanup() {
  if [ ! -z "${INTENT_SERVER_PID}" ]; then
    sleep 1
    echo "Killing intent parser pid ${INTENT_SERVER_PID}"
    kill ${INTENT_SERVER_PID}
  fi
}
trap cleanup EXIT

# Fire up the intent parser
python "${MOZIOT_TEST_HOME}/intent-parser/intent-parser-server.py" &
INTENT_SERVER_PID=$!

# Run the tests
jest --runInBand "$@"
