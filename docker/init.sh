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
if [[ ! -e /home/node/.webthings ]]; then
    mkdir -p /home/node/.webthings
fi

# Give the Node user access to the .webthings data directory
chown -R node:node /home/node/.webthings

# Run the gateway
export WEBTHINGS_HOME=/home/node/.webthings
su node -c "cd /home/node/webthings/gateway && ./run-app.sh"
