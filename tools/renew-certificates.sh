#!/bin/bash

moziot_dir="/home/pi/mozilla-iot"

certbot renew \
    --config-dir "$moziot_dir/etc" \
    --logs-dir "$moziot_dir/var/log" \
    --work-dir "$moziot_dir/var/lib" \
    --deploy-hook "$moziot_dir/gateway/tools/deploy-certificates.sh"

chown -R pi:pi "$moziot_dir/etc" "$moziot_dir/var"
