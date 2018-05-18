#!/bin/bash

MOZIOT_HOME="${MOZIOT_HOME:=/home/pi/.mozilla-iot}"
_dir=$(dirname "$(readlink -f "$0")")

for file in $(find "${MOZIOT_HOME}/etc/renewal" -type f -name '*.conf'); do
    sed -i -e 's_/mozilla-iot/etc_/.mozilla-iot/etc_g' "${file}"
    sed -i -e 's_/mozilla-iot/var_/.mozilla-iot/var_g' "${file}"

    # Disable OCSP stapling
    sed -i -e 's/^must_staple.*/must_staple = False/' "${file}"
done

for file in $(find "${MOZIOT_HOME}/etc/accounts" -type f -name regr.json); do
    if ! grep -q new_authzr_uri "${file}"; then
        python - <<EOF
import json

with open('${file}') as f:
    data = json.load(f)

data['new_authzr_uri'] = 'https://acme-v01.api.letsencrypt.org/acme/new-authz'

with open('${file}', 'wt') as f:
    json.dump(data, f)
EOF
    fi
done

# NOTE: --renew-hook is deprecated and has been replaced by --deploy-hook.
#       However, the version of certbot in raspbian stretch doesn't have
#       --deploy-hook support, so we're sticking with the old option for now.
certbot renew \
    --config-dir "${MOZIOT_HOME}/etc" \
    --logs-dir "${MOZIOT_HOME}/var/log" \
    --work-dir "${MOZIOT_HOME}/var/lib" \
    --renew-hook "${_dir}/deploy-certificates.sh"

# chown the certs as uid/gid 1000, which maps to 'pi' in the Raspberry Pi image,
# and 'node' in the Docker image.
_user=$(id -un 1000)
if [ "${_user}" = "pi" -o "${_user}" = "node" ]; then
    chown -R 1000:1000 "${MOZIOT_HOME}/etc" "${MOZIOT_HOME}/var"
fi
