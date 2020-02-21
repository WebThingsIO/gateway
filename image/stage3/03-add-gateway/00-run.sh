#!/bin/bash -e

set -x

# copy the gateway into the chroot
install -v -o 1000 -g 1000 -d "${ROOTFS_DIR}/home/${FIRST_USER_NAME}/mozilla-iot"
cp -a files/gateway "${ROOTFS_DIR}/home/${FIRST_USER_NAME}/mozilla-iot/gateway"
chown -R 1000:1000 "${ROOTFS_DIR}/home/${FIRST_USER_NAME}/mozilla-iot/gateway"
