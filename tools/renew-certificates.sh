#!/bin/bash

MOZIOT_HOME="${MOZIOT_HOME:=/home/pi/.mozilla-iot}"

# NOTE: --renew-hook is deprecated and has been replaced by --deploy-hook.
#       However, the version of certbot in raspbian stretch doesn't have
#       --deploy-hook support, so we're sticking with the old option for now.
certbot renew \
    --config-dir "${MOZIOT_HOME}/etc" \
    --logs-dir "${MOZIOT_HOME}/var/log" \
    --work-dir "${MOZIOT_HOME}/var/lib" \
    --renew-hook "/home/pi/mozilla-iot/gateway/tools/deploy-certificates.sh"

chown -R pi:pi "${MOZIOT_HOME}/etc" "${MOZIOT_HOME}/var"
