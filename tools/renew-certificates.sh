#!/bin/bash

moziot_dir="/home/pi/mozilla-iot"

# NOTE: --renew-hook is deprecated and has been replaced by --deploy-hook.
#       However, the version of certbot in raspbian stretch doesn't have
#       --deploy-hook support, so we're sticking with the old option for now.
certbot renew \
    --config-dir "$moziot_dir/etc" \
    --logs-dir "$moziot_dir/var/log" \
    --work-dir "$moziot_dir/var/lib" \
    --renew-hook "$moziot_dir/gateway/tools/deploy-certificates.sh"

chown -R pi:pi "$moziot_dir/etc" "$moziot_dir/var"
