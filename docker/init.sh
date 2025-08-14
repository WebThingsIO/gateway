#!/bin/bash

# Set up the system time zone
if [ -z "$TZ" ]; then
    TZ="Etc/UTC"
fi

echo "$TZ" > /etc/timezone
ln -sf "/usr/share/zoneinfo/$TZ" /etc/localtime

# Run avahi-daemon in the background
/usr/sbin/avahi-daemon -s -D

# If legacy .mozilla-iot directory exists, then move it to .webthings
if [[ "$WEBTHINGS_HOME" == "$HOME/.webthings" &&
      -d "$HOME/.mozilla-iot" &&
      ! -e "$HOME/.webthings" ]]; then
  mv "$HOME/.mozilla-iot" "$HOME/.webthings"
fi

# If .webthings directory doesn't exist then create it
if [[ ! -e /root/.webthings ]]; then
    mkdir -p /root/.webthings
fi

# Make sure the root user owns the .webthings data directory
chown -R root:root /root/.webthings

# Run the gateway
export WEBTHINGS_HOME=/root/.webthings
#su node -c "cd /home/node/webthings/gateway && ./run-app.sh"
cd /root/webthings/gateway && ./run-app.sh
