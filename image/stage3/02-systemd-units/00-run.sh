#!/bin/bash -e

set -x

install -m 644 files/etc/hostapd/hostapd.conf "${ROOTFS_DIR}/etc/hostapd/"
install -m 755 files/etc/init.d/gateway-iptables "${ROOTFS_DIR}/etc/init.d/"
install -m 755 files/etc/init.d/resize2fs_once "${ROOTFS_DIR}/etc/init.d/"
install -m 644 files/etc/systemd/system/webthings-gateway.check-for-update.service "${ROOTFS_DIR}/etc/systemd/system/"
install -m 644 files/etc/systemd/system/webthings-gateway.service "${ROOTFS_DIR}/etc/systemd/system/"
install -m 644 files/etc/systemd/system/webthings-gateway.check-for-update.timer "${ROOTFS_DIR}/etc/systemd/system/"
install -m 644 files/etc/systemd/system/webthings-gateway.update-rollback.service "${ROOTFS_DIR}/etc/systemd/system/"
install -m 644 files/etc/default/hostapd "${ROOTFS_DIR}/etc/default/"
install -m 644 files/etc/dnsmasq.conf "${ROOTFS_DIR}/etc/"
install -m 644 files/etc/udev/98-co2mon.rules "${ROOTFS_DIR}/etc/udev/rules.d/"

on_chroot << EOF
# Disable hostapd and dnsmasq auto start
systemctl unmask hostapd.service
systemctl disable hostapd.service
systemctl disable dnsmasq.service

# Enable the gateway service so that it starts up automatically on each boot
systemctl enable webthings-gateway.service

# Check for an update every day.
systemctl enable webthings-gateway.check-for-update.timer

# Activate the iptables script so that it runs on each boot.
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
update-rc.d gateway-iptables defaults
EOF
