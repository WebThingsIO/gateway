#!/bin/bash
#
# This script is expected to be run on the Raspberry Pi and it is
# used to prepare the base image used for the gateway.
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.*

# The base image (tested with 2017-04-10-raspbian-jessie-lite.img)
# will be fairly out of date, so we update all of the packages.
#
# Many packages, like git, won't work unless this step is done.
#
# To use this script, create an sd card with the raspbian image
# and copy this script into /home/pi.
#
# You then need to login to the RPi (probably using the serial console)
# and execute this script under the pi user.
#
# See this wiki article:
# https://github.com/mozilla-iot/wiki/wiki/Creating-the-base-image-file-for-the-Raspberry-Pi
# for complete instructions on creating a base image.

sudo apt update
sudo apt upgrade -y

# Install and configure nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
# The following 2 lines are installed into ~/.bashrc by the above,
# but on the RPi, sourcing ~/.bashrc winds up being a no-op (when sourced
# from a script), so we just run it here.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install v7.10.1
nvm use v7.10.1

# Install prequisite packages
sudo apt install libusb-1.0-0-dev libudev-dev -y

# Create the service file needed by systemctl
sudo sh -c 'cat > /etc/systemd/system/mozilla-iot-gateway.service' <<END
[Unit]
Description=Mozilla IoT Gateway Client
After=network.target
OnFailure=mozilla-iot-gateway-update-rollback.service

[Service]
Type=simple
StandardOutput=journal
StandardError=journal
# Edit this line, if needed, to specify what user to run Vaani as
# If you delete this line, it will run as root
User=pi
# Edit this line, if needed, to specify where you installed the server
WorkingDirectory=/home/pi/mozilla-iot/gateway
# Edit this line, if needed, to set the correct path to node
ExecStart=/home/pi/mozilla-iot/gateway/run-app.sh
Restart=always
RestartSec=10s

[Install]
WantedBy=multi-user.target
END

sudo sh -c 'cat > /etc/systemd/system/mozilla-iot-gateway-update-rollback.service' <<END
[Unit]
Description=Mozilla IoT Gateway Client Update Rollback
After=network.target

[Service]
Type=simple
StandardOutput=journal
StandardError=journal
User=pi
# Edit this line, if needed, to specify where you installed the server
WorkingDirectory=/home/pi/mozilla-iot/gateway
# Edit this line, if needed, to set the correct path to the script
ExecStart=/home/pi/mozilla-iot/gateway/tools/rollback.sh

END

# Enable the gateway service so that it starts up automatically on each boot
sudo systemctl enable mozilla-iot-gateway.service

# Create a script which redirects port 80 to 8080 and 443 to 4443. This
# allows the gateway to run under the pi user rather than requiring to
# be root.

sudo sh -c 'cat > /etc/init.d/gateway-iptables.sh' << 'END'
#! /bin/sh
### BEGIN INIT INFO
# Provides:          gateway-iptables
# Required-Start:    $all
# Required-Stop:
# Default-Start:     3 4 5
# Default-Stop:
# Short-Description: Redirect :80 to :8080 and :443 to :4443
### END INIT INFO

PATH=/sbin:/usr/sbin:/bin:/usr/bin

. /lib/init/vars.sh
. /lib/lsb/init-functions

do_start() {
  [ "$VERBOSE" != no ] && log_begin_msg "Redirecting :80 to :8080 and :443 to :4443"
  iptables -t mangle -A PREROUTING -p tcp --dport 80 -j MARK --set-mark 1
  iptables -t mangle -A PREROUTING -p tcp --dport 443 -j MARK --set-mark 1
  iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
  iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 4443
  iptables -I INPUT -m state --state NEW -m tcp -p tcp --dport 8080 -m mark --mark 1 -j ACCEPT
  iptables -I INPUT -m state --state NEW -m tcp -p tcp --dport 4443 -m mark --mark 1 -j ACCEPT
  ES=$?
  [ "$VERBOSE" != no ] && log_end_msg $ES
  return $ES
}

case "$1" in
    start)
	do_start
        ;;
    restart|reload|force-reload)
        echo "Error: argument '$1' not supported" >&2
        exit 3
        ;;
    stop|status)
        # No-op
        exit 0
        ;;
    *)
        echo "Usage: $0 start|stop" >&2
        exit 3
        ;;
esac
END

# Activate the script so that it runs on each boot.
#
# NOTE: Do NOT be tempted to merge this with the systemctl stuff.
#       There are 2 reasons for this. The first is that run-app.sh
#       runs as the pi user, and the second is that we really only
#       want the iptables commands to be run once per boot. If you
#       want to run it a second time, then you need to detect that
#       you've previously installed some rules and uninstall them
#       before trying to install them again. With systemctl a user
#       could stop and restart the gateway and if this was merged
#       with run-app.sh then you'd be installing the rules a second
#       time.
sudo chmod +x /etc/init.d/gateway-iptables.sh
sudo update-rc.d gateway-iptables.sh defaults

echo "Done"