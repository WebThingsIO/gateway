#!/bin/sh

# Set up the system time zone
if [ -z "$TZ" ]; then
    TZ="Etc/UTC"
fi

echo "$TZ" > /etc/timezone
ln -sf "/usr/share/zoneinfo/$TZ" /etc/localtime

# Run avahi-daemon in the background
/usr/sbin/avahi-daemon -s -D

# Run the gateway
export MOZIOT_HOME=/home/node/.mozilla-iot
chown -R node:node "${MOZIOT_HOME}"
su node -c "cd /home/node/mozilla-iot/gateway && ./run-app.sh"
