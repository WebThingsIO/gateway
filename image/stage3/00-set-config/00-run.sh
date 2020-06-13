#!/bin/bash -e

set -x

cat >> "${ROOTFS_DIR}/boot/config.txt" <<END

enable_uart=1
force_turbo=1
core_freq=250
dtparam=i2c_arm=on
dtparam=spi=on
END

cat >> "${ROOTFS_DIR}/etc/modules" <<END

i2c-dev
END
