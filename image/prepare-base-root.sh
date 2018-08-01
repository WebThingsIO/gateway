#!/bin/bash -e

# Allow node and python3 to use the Bluetooth adapter
setcap cap_net_raw+eip $(eval readlink -f `which node`)
setcap cap_net_raw+eip $(eval readlink -f `which python3`)

# disable hostapd and dnsmasq auto start
systemctl disable hostapd.service
systemctl disable dnsmasq.service

# install hostapd and dnsmasq config files
cp ~pi/mozilla-iot/gateway/image/config/hostapd.conf /etc/hostapd/hostapd.conf
cp ~pi/mozilla-iot/gateway/image/config/dnsmasq.conf /etc/dnsmasq.conf
echo 'DAEMON_CONF="/etc/hostapd/hostapd.conf"' >> /etc/default/hostapd
