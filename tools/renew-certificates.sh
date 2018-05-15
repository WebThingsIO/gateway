#!/bin/bash

MOZIOT_HOME="${MOZIOT_HOME:=/home/pi/.mozilla-iot}"

for file in $(find "${MOZIOT_HOME}/etc/renewal" -type f -name '*.conf'); do
    sed -i -e 's_/mozilla-iot/etc_/.mozilla-iot/etc_g' "${file}"
    sed -i -e 's_/mozilla-iot/var_/.mozilla-iot/var_g' "${file}"

    # Disable OCSP stapling
    sed -i -e 's/^must_staple.*/must_staple = False/' "${file}"
done

# NOTE: --renew-hook is deprecated and has been replaced by --deploy-hook.
#       However, the version of certbot in raspbian stretch doesn't have
#       --deploy-hook support, so we're sticking with the old option for now.
certbot renew \
    --config-dir "${MOZIOT_HOME}/etc" \
    --logs-dir "${MOZIOT_HOME}/var/log" \
    --work-dir "${MOZIOT_HOME}/var/lib" \
    --renew-hook "/home/pi/mozilla-iot/gateway/tools/deploy-certificates.sh"

chown -R pi:pi "${MOZIOT_HOME}/etc" "${MOZIOT_HOME}/var"
