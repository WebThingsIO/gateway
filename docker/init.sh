#!/bin/bash

# Set up the system time zone
if [ -z "$TZ" ]; then
    TZ="Etc/UTC"
fi

echo "$TZ" > /etc/timezone
ln -sf "/usr/share/zoneinfo/$TZ" /etc/localtime

# Run avahi-daemon in the background
/usr/sbin/avahi-daemon -s -D

# Run the gateway
export WEBTHINGS_HOME=/home/node/.webthings

if [[ -d /home/node/.mozilla-iot && ! -e /home/node/.webthings ]]; then
    pushd /home/node
    ln -sf .mozilla-iot .webthings
    chown -R node:node .mozilla-iot
    popd
fi

chown -R node:node "${WEBTHINGS_HOME}"
su node -c "cd /home/node/webthings/gateway && ./run-app.sh"
